import React, { useContext, useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { AppContext } from "../context/AppContext";
import Loading from "../components/Loading";
import Navbar from "../components/Navbar";
import { assets } from "../assets/assets";
import kconvert from "k-convert";
import moment from "moment";
import JobCard from "../components/JobCard";
import Footer from "../components/Footer";
import { toast } from "react-toastify";

const ApplyJob = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { jobs, backendUrl, userData, api } = useContext(AppContext);

  const [JobData, setJobData] = useState(null);
  const [isApplying, setIsApplying] = useState(false);
  const [hasApplied, setHasApplied] = useState(false);
  const [userApplications, setUserApplications] = useState([]);

  // Fetch job details
  const fetchJob = async () => {
    try {
      const { data } = await api.get(`${backendUrl}/api/jobs/${id}`);
      if (data.success) {
        setJobData(data.job);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
    }
  };

  // Fetch user's applications
  const fetchUserApplications = async () => {
    if (!userData) return;
    try {
      const { data } = await api.get(`${backendUrl}/api/user/applications`);
      if (data.success) {
        setUserApplications(data.applications);
        const applied = data.applications.some((app) => app.jobId._id === id);
        setHasApplied(applied);
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to fetch applications"
      );
    }
  };

  // Apply for job
  const handleApplyJob = async () => {
    if (!userData) {
      toast.error("Please login to apply for jobs");
      return;
    }
    if (hasApplied) {
      toast.info("You have already applied for this job");
      return;
    }

    try {
      setIsApplying(true);
      const { data } = await api.post(`${backendUrl}/api/user/apply`, {
        jobId: id,
      });
      if (data.success) {
        toast.success(data.message);
        setHasApplied(true);
        setUserApplications((prev) => [...prev, { jobId: { _id: id } }]);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
    } finally {
      setIsApplying(false);
    }
  };

  useEffect(() => {
    fetchJob();
  }, [id]);

  useEffect(() => {
    if (userData) {
      fetchUserApplications();
    }
  }, [userData]);

  // Return loading state if JobData is not available
  if (!JobData) {
    return <Loading />;
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen flex flex-col py-10 container px-4 2xl:px-20 mx-auto">
        <div className="bg-white text-black rounded-lg w-full">
          {/* Job Header */}
          <div className="flex justify-center md:justify-between flex-wrap gap-8 px-14 py-20 mb-6 bg-sky-50 border border-sky-400 rounded-xl">
            <div className="flex flex-col md:flex-row items-center">
              <img
                className="h-24 bg-white rounded-lg p-4 mr-4 max-md:mb-4 border"
                src={JobData.companyId?.image || "default-image-path.jpg"}
                alt={JobData.companyId?.name || "Unknown Company"}
              />
              <div className="text-center md:text-left text-neutral-700">
                <h1 className="text-2xl sm:text-4xl font-medium">
                  {JobData.title}
                </h1>
                <div className="flex flex-row flex-wrap max-md:justify-center gap-y-2 gap-6 items-center text-gray-600 mt-2">
                  <span className="flex items-center gap-1">
                    <img src={assets.suitcase_icon} alt="" />
                    {JobData.companyId?.name || "This Company"}
                  </span>
                  <span className="flex items-center gap-1">
                    <img src={assets.location_icon} alt="" />
                    {JobData.location}
                  </span>
                  <span className="flex items-center gap-1">
                    <img src={assets.person_icon} alt="" />
                    {JobData.level}
                  </span>
                  <span className="flex items-center gap-1">
                    <img src={assets.money_icon} alt="" />
                    CTC: {kconvert.convertTo(JobData.salary)}
                  </span>
                </div>
              </div>
            </div>
            <div className="flex flex-col justify-center text-end text-sm max-md:mx-auto max-md:text-center">
              <button
                onClick={handleApplyJob}
                disabled={isApplying || !userData || hasApplied}
                className={`p-2.5 px-10 text-white rounded transition-colors ${
                  hasApplied
                    ? "bg-green-600 cursor-default"
                    : "bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
                }`}
              >
                {isApplying
                  ? "Applying..."
                  : hasApplied
                  ? "Applied ✓"
                  : "Apply Now"}
              </button>
              <p className="mt-2 text-gray-600 text-center">
                Posted {moment(JobData.date).fromNow()}
              </p>
            </div>
          </div>

          {/* Job Description & Sidebar */}
          <div className="flex flex-col lg:flex-row justify-between items-start">
            <div className="w-full lg:w-2/3">
              <h2 className="font-bold text-2xl mb-4">Job Description</h2>
              <div
                className="rich-text"
                dangerouslySetInnerHTML={{ __html: JobData.description }}
              ></div>

              {/* Apply / Applied */}
              <div className="mt-4 flex gap-4 text-sm">
                {hasApplied ? (
                  <button className="bg-green-600 text-white px-4 py-2 rounded cursor-default">
                    Applied ✓
                  </button>
                ) : (
                  <button
                    onClick={() => {
                      navigate(`/apply-job/${JobData._id}`);
                      window.scrollTo(0, 0);
                    }}
                    className="bg-gray-400 hover:bg-blue-500 text-white px-4 py-2 rounded"
                  >
                    Apply Now
                  </button>
                )}
              </div>
            </div>

            {/* More Jobs from Company */}
            <div className="w-full lg:w-1/3 mt-8 lg:mt-0 lg:ml-8 space-y-5">
              <h2>
                More Jobs from {JobData?.companyId?.name || "This Company"}
              </h2>
              {jobs
                .filter(
                  (job) =>
                    job._id !== JobData._id &&
                    job.companyId?._id === JobData.companyId?._id
                )
                .slice(0, 4)
                .map((job) => {
                  const hasAppliedToThisJob = userApplications.some(
                    (application) => application.jobId._id === job._id
                  );
                  return (
                    <JobCard
                      key={job._id} // Use job._id as the key
                      job={job}
                      hasApplied={hasAppliedToThisJob}
                    />
                  );
                })}
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default ApplyJob;

import React, { useContext, useEffect, useState, useCallback } from "react";
import moment from "moment";
import { useNavigate } from "react-router-dom";
import { AppContext } from "../context/AppContext";
import axios from "axios";
import { toast } from "react-toastify";
import { Loader2 } from "lucide-react";

const ManageJobs = () => {
  const navigate = useNavigate();

  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [updatingId, setUpdatingId] = useState(null);

  const { backendUrl, companyToken } = useContext(AppContext);

  const fetchCompanyJobs = useCallback(async () => {
    if (!backendUrl || !companyToken) return;

    setLoading(true);
    try {
      const { data } = await axios.get(`${backendUrl}/api/company/list-jobs`, {
        headers: { token: companyToken },
      });

      if (data.success && Array.isArray(data.jobsData)) {
        setJobs([...data.jobsData].reverse());
      } else {
        setJobs([]);
        toast.error(data.message || "Failed to load jobs");
      }
    } catch (error) {
      console.error(error);
      setJobs([]);
      toast.error(error.response?.data?.message || "Error fetching jobs");
    } finally {
      setLoading(false);
    }
  }, [backendUrl, companyToken]);

  // Function to change job visibility
  const changeJobVisibility = async (jobId) => {
    if (updatingId) return; // Prevent multiple simultaneous updates
    
    setUpdatingId(jobId);


    try {
      const { data } = await axios.post(
        `${backendUrl}/api/company/change-visibility`,
        { id: jobId },
        { headers: { token: companyToken } }
      );

      if (data.success) {
        toast.success(data.message);
        // Update UI after successful API call
        setJobs((prev) =>
          prev.map((job) =>
            job._id === jobId ? { ...job, visible: !job.visible } : job
          )
        );
      } else {
        toast.error(data.message || "Failed to change visibility");
      }
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || error.message);
    } finally {
      setUpdatingId(null);
    }
  };

  useEffect(() => {
    if (companyToken) {
      fetchCompanyJobs();
    }
  }, [companyToken, fetchCompanyJobs]);

  return (
    <div className="container mx-auto p-4 sm:px-6 lg:px-8">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-lg font-semibold text-gray-800">Manage Jobs</h1>
        <button
          onClick={() => navigate("/dashboard/add-job")}
          className="rounded bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 text-sm transition-colors"
        >
          + Add New Job
        </button>
      </div>

      <div className="bg-white border border-gray-200 rounded-lg shadow-sm">
        {loading ? (
          <div className="py-6 text-center text-gray-500">Loading jobs...</div>
        ) : jobs.length === 0 ? (
          <div className="py-6 text-center text-gray-500">No jobs found.</div>
        ) : (
          <div className="overflow-x-auto rounded-lg">
            <table className="min-w-full text-sm">
              <thead className="bg-gray-100 text-gray-700">
                <tr>
                  <th className="px-4 py-3 text-left max-sm:hidden">#</th>
                  <th className="px-4 py-3 text-left">Job Title</th>
                  <th className="px-4 py-3 text-left max-sm:hidden">Date</th>
                  <th className="px-4 py-3 text-left max-sm:hidden">Location</th>
                  <th className="px-4 py-3 text-center">Applicants</th>
                  <th className="px-4 py-3 text-center">Status</th>
                </tr>
              </thead>
              <tbody>
                {jobs.map((job, index) => (
                  <tr
                    key={job._id || index}
                    className={`border-t hover:bg-gray-50 transition-colors ${
                      index % 2 === 0 ? "bg-white" : "bg-gray-50/50"
                    }`}
                  >
                    <td className="px-4 py-3 max-sm:hidden text-gray-500">
                      {index + 1}
                    </td>
                    <td className="px-4 py-3 font-medium text-gray-800">
                      {job.title}
                    </td>
                    <td className="px-4 py-3 max-sm:hidden text-gray-600 text-sm">
                      {moment(job.date).format("ll")}
                    </td>
                    <td className="px-4 py-3 max-sm:hidden text-gray-600">
                      {job.location}
                    </td>
                    <td className="px-4 py-3 text-center font-semibold text-gray-700">
                      {job.applicants}
                    </td>
                    <td className="px-4 py-3 text-center">
                    {updatingId === job._id ? (
                    <div className="flex justify-center items-center">
                    <Loader2 className="h-5 w-5 text-blue-600 animate-spin" />
                    </div>
                    ) : (
                    <input
                    type="checkbox"
                    onChange={() => changeJobVisibility(job._id)}
                    className="h-4 w-4 text-blue-600 scale-125 ml-4 cursor-pointer"
                    checked={job.visible || false}
                    />
                    )}
                  </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default ManageJobs;

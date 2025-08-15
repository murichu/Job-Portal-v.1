import React, { useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { assets } from "../assets/assets";
import moment from "moment";
import { useContext } from "react";
import { AppContext } from "../context/AppContext";
import axios from "axios";
import { toast } from "react-toastify";

const Applications = () => {
  const {
    userApplications,
    backendUrl,
    fetchUserApplications,
    token,
    setToken,
    setUserData,
  } = useContext(AppContext);

  const [isEdit, setIsEdit] = useState(false);
  const [resume, setResume] = useState(null);
  const [isUploading, setIsUploading] = useState(false);

  const handleResumeUpdate = async () => {
    if (!resume) {
      toast.error("Please select a resume file");
      return;
    }

    try {
      setIsUploading(true);

      // Get token from context or localStorage
      const authToken = token || localStorage.getItem("token");
      if (!authToken) {
        toast.error("You are not logged in");
        return;
      }

      const formData = new FormData();
      formData.append("resume", resume);

      const { data } = await axios.post(
        `${backendUrl}/api/user/update-resume`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (data.success) {
        toast.success(data.message);
        setIsEdit(false);
        setResume(null);
        fetchUserApplications(); // refresh after upload
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || error.message);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <>
      <Navbar />

      <div className="container px-4 min-h-[65vh] 2xl:px-20 mx-auto my-10">
        <h2 className="text-xl font-semibold">Your Resume</h2>
        <div className="flex gap-2 mb-6 mt-3">
          {isEdit ? (
            <>
              <label className="flex items-center" htmlFor="resumeUpload">
                <p className="bg-blue-100 text-blue-600 px-4 py-2 rounded-lg mr-2">
                  Select Resume
                </p>
                <input
                  id="resumeUpload"
                  onChange={(e) => setResume(e.target.files[0])}
                  accept=".pdf"
                  type="file"
                  hidden
                />
                <img src={assets.profile_upload_icon} alt="Upload icon" />
              </label>
              <button
                onClick={handleResumeUpdate}
                disabled={isUploading}
                className="bg-green-100 border border-green-400 rounded-lg px-4 py-2 disabled:opacity-50"
              >
                {isUploading ? "Saving..." : "Save"}
              </button>
            </>
          ) : (
            <div className="flex gap-2">
              <a
                className="bg-blue-100 text-blue-600 px-4 py-2 rounded-lg"
                href=""
              >
                Resume
              </a>
              <button
                onClick={() => setIsEdit(true)}
                className="text-gray-500 border border-gray-300 rounded-lg px-4 py-2"
              >
                Edit
              </button>
            </div>
          )}
        </div>

        <h2 className="text-xl font-semibold mb-4">Jobs Applied</h2>
        <table className="min-w-full bg-white border rounded-lg">
          <thead>
            <tr>
              <th className="py-3 px-4 border-b text-left">Company</th>
              <th className="py-3 px-4 border-b text-left">Job Title</th>
              <th className="py-3 px-4 border-b text-left max-sm:hidden">
                Location
              </th>
              <th className="py-3 px-4 border-b text-left max-sm:hidden">
                Date
              </th>
              <th className="py-3 px-4 border-b text-left">Status</th>
            </tr>
          </thead>
          <tbody>
            {userApplications && userApplications.length > 0 ? (
              userApplications.map((application, index) => (
                <tr key={index}>
                  <td className="py-3 px-4 flex items-center gap-2 border-b">
                    <img
                      className="w-8 h-8"
                      src={application.companyId.image}
                      alt=""
                    />
                    {application.companyId.name}
                  </td>
                  <td className="py-2 px-4 border-b">
                    {application.jobId.title}
                  </td>
                  <td className="py-2 px-4 border-b max-sm:hidden">
                    {application.jobId.location}
                  </td>
                  <td className="py-2 px-4 border-b max-sm:hidden">
                    {moment(application.date).format("ll")}
                  </td>
                  <td className="py-2 px-4 border-b">
                    <span
                      className={`${
                        application.status === "Accepted"
                          ? "bg-green-100"
                          : application.status === "Rejected"
                          ? "bg-red-100"
                          : "bg-blue-100"
                      } px-4 py-1.5 rounded`}
                    >
                      {application.status}
                    </span>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="py-8 text-center text-gray-500">
                  No applications found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <Footer />
    </>
  );
};

export default Applications;

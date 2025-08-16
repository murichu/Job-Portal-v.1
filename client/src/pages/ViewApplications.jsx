import React, { useContext, useEffect, useState } from 'react';
import { assets } from '../assets/assets';
import { AppContext } from '../context/AppContext';
import axios from 'axios';
import { toast } from 'react-toastify';
import moment from 'moment';

const ViewApplications = () => {
  const { backendUrl, companyToken } = useContext(AppContext);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingStatus, setUpdatingStatus] = useState(null);

  // Fetch company applications
  const fetchApplications = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(`${backendUrl}/api/company/applications`, {
        headers: { token: companyToken }
      });
      
      if (data.success) {
        setApplications(data.applications || []);
      } else {
        toast.error(data.message || 'Failed to fetch applications');
      }
    } catch (error) {
      console.error('Error fetching applications:', error);
      toast.error(error.response?.data?.message || 'Failed to fetch applications');
    } finally {
      setLoading(false);
    }
  };

  // Update application status
  const updateApplicationStatus = async (applicationId, status) => {
    try {
      setUpdatingStatus(applicationId);
      const { data } = await axios.post(
        `${backendUrl}/api/company/change-status`,
        { applicationId, status },
        { headers: { token: companyToken } }
      );

      if (data.success) {
        toast.success(`Application ${status.toLowerCase()} successfully`);
        // Update local state
        setApplications(prev => 
          prev.map(app => 
            app._id === applicationId 
              ? { ...app, status } 
              : app
          )
        );
      } else {
        toast.error(data.message || 'Failed to update status');
      }
    } catch (error) {
      console.error('Error updating status:', error);
      toast.error(error.response?.data?.message || 'Failed to update status');
    } finally {
      setUpdatingStatus(null);
    }
  };

  useEffect(() => {
    if (companyToken) {
      fetchApplications();
    }
  }, [companyToken]);

  if (loading) {
    return (
      <div className="container p-4 sm:px-6 lg:px-8 border border-gray-200 ml-2 mt-2 rounded-lg">
        <div className="flex justify-center items-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span className="ml-2">Loading applications...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="container p-4 sm:px-6 lg:px-8 border border-gray-200 ml-2 mt-2 rounded-lg">
      <div className="mb-4">
        <h2 className="text-xl font-semibold text-gray-800">Job Applications</h2>
        <p className="text-gray-600">Manage applications for your job postings</p>
      </div>

      {applications.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-500">No applications found</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full max-w-7xl bg-white max-sm:text-sm">
            <thead className="bg-gray-100 text-left text-sm font-semibold text-gray-700">
              <tr className='border-b'>
                <th className="px-4 py-2 text-left">#</th>
                <th className="px-4 py-2 text-left">Applicant</th>
                <th className="px-4 py-2 text-left max-sm:hidden">Job Title</th>
                <th className="px-4 py-2 text-left max-sm:hidden">Applied Date</th>
                <th className="px-4 py-2 text-left">Status</th>
                <th className="px-4 py-2 text-left">Resume</th>
                <th className="px-4 py-2 text-left">Action</th>
              </tr>
            </thead>
            <tbody className="text-sm text-gray-600">
              {applications.map((application, index) => (
                <tr key={application._id} className="text-gray-700 hover:bg-gray-50 border-b">
                  <td className="px-4 py-3 text-center">{index + 1}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center">
                      <img 
                        src={application.userId?.image || assets.profile_img} 
                        alt={application.userId?.name || 'User'} 
                        className="w-10 h-10 rounded-full mr-3 max-sm:hidden object-cover" 
                        onError={(e) => {
                          e.target.src = assets.profile_img;
                        }}
                      />
                      <span className='max-sm:text-sm'>
                        {application.userId?.name || 'Unknown User'}
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-3 max-sm:hidden">
                    {application.jobId?.title || 'N/A'}
                  </td>
                  <td className="px-4 py-3 max-sm:hidden">
                    {moment(application.date).format('MMM DD, YYYY')}
                  </td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      application.status === 'Accepted' 
                        ? 'bg-green-100 text-green-800'
                        : application.status === 'Rejected'
                        ? 'bg-red-100 text-red-800'
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {application.status}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    {application.userId?.resume ? (
                      <a 
                        href={application.userId.resume} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-800 py-1 gap-2 inline-flex rounded items-center"
                      >
                        Resume
                        <img src={assets.resume_download_icon} alt="Download Resume" className="w-4 h-4 ml-1" />
                      </a>
                    ) : (
                      <span className="text-gray-400">No resume</span>
                    )}
                  </td>
                  <td className="px-4 py-3 relative">
                    {application.status === 'Pending' ? (
                      <div className="relative inline-block text-left group">
                        <button 
                          className="text-gray-500 hover:text-gray-700 px-2 py-1"
                          disabled={updatingStatus === application._id}
                        >
                          {updatingStatus === application._id ? '...' : '⋮'}
                        </button>
                        <div className="z-10 absolute hidden bg-white right-0 md:left-0 top-0 mt-2 w-32 border border-gray-200 rounded shadow group-hover:block">
                          <button 
                            onClick={() => updateApplicationStatus(application._id, 'Accepted')}
                            className="block w-full px-4 py-2 text-left text-green-600 hover:bg-gray-100"
                            disabled={updatingStatus === application._id}
                          >
                            Accept
                          </button>
                          <button 
                            onClick={() => updateApplicationStatus(application._id, 'Rejected')}
                            className="block w-full px-4 py-2 text-left text-red-600 hover:bg-gray-100"
                            disabled={updatingStatus === application._id}
                          >
                            Reject
                          </button>
                        </div>
                      </div>
                    ) : (
                      <span className="text-gray-400 text-sm">
                        {application.status}
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default ViewApplications;
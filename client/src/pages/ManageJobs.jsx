import React from 'react';
import { manageJobsData } from '../assets/assets';
import moment from 'moment';
import { useNavigate } from 'react-router-dom';

const ManageJobs = () => {

  const navigate = useNavigate();

  return (
    <div className="container p-4 sm:px-6 lg:px-8 border border-gray-200 ml-2 mt-2 rounded-lg">
      <div className="overflow-x-auto sm:rounded-lg">
        <table className="min-w-full bg-white border-b border-gray-100 table-auto">
          <thead className="bg-gray-100 text-left text-sm font-semibold text-gray-700">
            <tr>
              <th className="px-4 py-2 border-b text-left max-sm:hidden">#</th>
              <th className="px-4 py-2 border-b text-left">Job Title</th>
              <th className="px-4 py-2 border-b text-left max-sm:hidden">Date</th>
              <th className="px-4 py-2 border-b text-left max-sm:hidden">Location</th>
              <th className="px-4 py-2 border-b text-center">Applicants</th>
              <th className="px-4 py-2 border-b text-left">Visible</th>
            </tr>
          </thead>
          <tbody className="text-sm text-gray-600">
            {manageJobsData.map((job, index) => (
              <tr key={index} className="text-gray-700 hover:bg-gray-200">
                <td className="px-4 py-2 border-b max-sm:hidden">{index + 1}</td>
                <td className="px-4 py-2 border-b">{job.title}</td>
                <td className="px-4 py-2 border-b max-sm:hidden">{moment(job.date).format('ll')}</td>
                <td className="px-4 py-2 border-b max-sm:hidden">{job.location}</td>
                <td className="px-4 py-2 border-b text-center">{job.applicants}</td>
                <td className="px-4 py-2 border-b">
                  <input type="checkbox" className="h-4 w-4 text-blue-600 scale-125 ml-4" />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className='mt-4 flex justify-end'>
        <button onClick={() => navigate('/dashboard/add-job')} className='rounded bg-blue-600 text-white px-2 py-2 mt-4'>Add New Job</button>
      </div>
    </div>
  )
}

export default ManageJobs

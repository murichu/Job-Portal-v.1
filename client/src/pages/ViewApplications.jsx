import React from 'react'
import { assets, viewApplicationsPageData } from '../assets/assets'

const ViewApplications = () => {
  return (
    <div className="container mx-auto p-4">
      <div>
        <table className="w-full max-w-7xl bg-white border border-gray-200 max-sm:text-sm">
          <thead className="bg-gray-100">
            <tr className='border-b'>
              <th className="px-4 py-2 text-left">#</th>
              <th className="px-4 py-2 text-left">User Name</th>
              <th className="px-4 py-2 text-left max-sm:hidden">Job Title</th>
              <th className="px-4 py-2 text-left max-sm:hidden">Location</th>
              <th className="px-4 py-2 text-left">Resume</th>
              <th className="px-4 py-2 text-left">Action</th>
            </tr>
          </thead>
          <tbody>
            {viewApplicationsPageData.map((applicant, index) => (
              <tr key={index} className="text-gray-700 hover:bg-gray-200">
                <td className="px-4 py-2 border-b text-center">{index+1}</td>
                <td className="px-4 py-2 border-b flex text-center">
                  <img src={applicant.imgSrc} alt='' className="w-10 h-10 rounded-full mr-3 max-sm:hidden" />
                  <span className='max-sm:text-sm'>{applicant.name}</span>
                </td>
                <td className="px-4 py-2 border-b max-sm:hidden">{applicant.jobTitle}</td>
                <td className="px-4 py-2 border-b max-sm:hidden">{applicant.location}</td>
                <td className="px-4 py-2 border-b">
                    <a href="" target="_blank" className="text-blue-400 py-1 gap-2 inline-flex rounded items-center">
                      Resume
                      <img src={assets.resume_download_icon} alt="Download Resume" className="w-4 h-4 ml-2" />
                    </a>
                </td>
                <td className="px-4 py-2 border-b relative">
                  <div className="relative inline-block text-left group">
                    <button className="text-gray-500 action-button">
                      ...
                    </button>
                    <div className="z-10 absolute hidden bg-white right-0 md:left-0 top-0 mt-2 w-32 border border-gray-200 rounded shadow group-hover:block">
                      <button className="block w-full px-4 py-2 text-left text-blue-500 hover:bg-gray-100">
                        Accept
                      </button>
                      <button className="block w-full px-4 py-2 text-left text-red-500 hover:bg-gray-100">
                        Reject
                      </button>
                    </div>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default ViewApplications

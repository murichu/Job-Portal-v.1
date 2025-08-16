import React from "react";
import { assets } from "../assets/assets";
import { useNavigate } from "react-router-dom";
import DOMPurify from 'dompurify';

const JobCard = ({ job, hasApplied }) => {
  const navigate = useNavigate();

  // Safely access nested company data
  const companyImage = job.companyId?.image || job.company?.image || '/default-company.png';
  const companyName = job.companyId?.name || job.company?.name || 'Unknown Company';

  // Sanitize HTML content
  const sanitizedDescription = DOMPurify.sanitize(job.description || '');
  return (
    <div className="border p-6 shadow rounded">
      {/* Company Icon */}
      <div className="flex justify-between items-center">
        <img 
          className="h-8" 
          src={companyImage} 
          alt={`${companyName} Icon`}
          onError={(e) => {
            e.target.src = '/default-company.png';
          }}
        />
      </div>

      {/* Job Title */}
      <h4 className="font-medium text-xl mt-2">{job.title}</h4>

      {/* Job Location and Level */}
      <div className="flex items-center gap-3 mt-2 text-xs">
        <span className="bg-blue-50 border border-blue-200 px-4 py-1.5 rounded">
          {job.location}
        </span>
        <span className="bg-red-50 border border-red-200 px-4 py-1.5 rounded">
          {job.level}
        </span>
      </div>

      {/* Job Description */}
      <p
        className="text-gray-500 text-sm mt-4"
        dangerouslySetInnerHTML={{
          __html: sanitizedDescription.slice(0, 150) + "...",
        }}
      ></p>

      {/* Apply / Applied and Learn More Buttons */}
      <div className="mt-4 flex gap-4 text-sm">
        {hasApplied ? (
          <button
            disabled
            className="bg-green-600 text-white px-4 py-2 rounded cursor-default"
          >
            Applied ✓
          </button>
        ) : (
          <button
            onClick={() => {
              navigate(`/apply-job/${job._id}`);
              window.scrollTo(0, 0);
            }}
            className="bg-gray-400 hover:bg-blue-500 text-white px-4 py-2 rounded"
          >
            Apply Now
          </button>
        )}

        <button
          onClick={() => {
            navigate(`/apply-job/${job._id}`);
            window.scrollTo(0, 0);
          }}
          className="text-gray-500 border border-gray-500 hover:bg-gray-100 rounded px-4 py-2"
        >
          Learn More
        </button>
      </div>
    </div>
  );
};

export default JobCard;

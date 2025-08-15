import React, { useContext, useEffect, useState } from "react";
import { AppContext } from "../context/AppContext";
import { assets, JobCategories, JobLocations } from "../assets/assets";
import JobCard from "../components/JobCard";

const JobListings = () => {
  const { isSearched, searchFilter, setSearchFilter, jobs, userData, api, backendUrl } =
    useContext(AppContext);

  const [showFilter, setShowFilter] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedLocations, setSelectedLocations] = useState([]);
  const [filteredJobs, setFilteredJobs] = useState([]);
  const [userApplications, setUserApplications] = useState([]);

  // Toggle category/location filter
  const toggleSelection = (selectedList, setSelectedList, value) => {
    setSelectedList((prev) =>
      prev.includes(value) ? prev.filter((item) => item !== value) : [...prev, value]
    );
  };

  // Fetch user's applied jobs
  const fetchUserApplications = async () => {
    if (!userData) return;
    try {
      const { data } = await api.get(`${backendUrl}/api/user/applications`);
      if (data.success) {
        setUserApplications(data.applications.map((app) => app.jobId._id));
      }
    } catch (error) {
      console.error("Error fetching user applications:", error);
    }
  };

  // Filter jobs
  useEffect(() => {
    const matchesCategory = (job) =>
      selectedCategories.length === 0 || selectedCategories.includes(job.category);

    const matchesLocation = (job) =>
      selectedLocations.length === 0 || selectedLocations.includes(job.location);

    const matchesTitle = (job) =>
      !searchFilter.title || job.title.toLowerCase().includes(searchFilter.title.toLowerCase());

    const matchesSearchLocation = (job) =>
      !searchFilter.location || job.location.toLowerCase().includes(searchFilter.location.toLowerCase());

    const newFilteredJobs = jobs
      .slice()
      .reverse()
      .filter(
        (job) =>
          matchesCategory(job) &&
          matchesLocation(job) &&
          matchesTitle(job) &&
          matchesSearchLocation(job)
      );

    setFilteredJobs(newFilteredJobs);
    setCurrentPage(1);
  }, [jobs, selectedCategories, selectedLocations, searchFilter]);

  useEffect(() => {
    fetchUserApplications();
  }, [userData]);

  return (
    <div className="container 2xl:px-20 mx-auto flex flex-col lg:flex-row max-lg:space-y-8 py-8">
      
      {/* Sidebar */}
      <div className="w-full lg:w-1/4 bg-white px-4">
        {isSearched && (searchFilter.title || searchFilter.location) && (
          <>
            <h3 className="font-medium text-lg mb-4">Current Search</h3>
            <div className="mb-4 text-gray-600 flex flex-wrap gap-2">
              {searchFilter.title && (
                <span className="inline-flex items-center gap-2.5 bg-blue-50 border border-blue-200 px-4 py-1.5 rounded">
                  {searchFilter.title}
                  <img
                    onClick={() => setSearchFilter((prev) => ({ ...prev, title: "" }))}
                    className="cursor-pointer"
                    src={assets.cross_icon}
                    alt="Clear Title Filter"
                  />
                </span>
              )}
              {searchFilter.location && (
                <span className="inline-flex items-center gap-2.5 bg-red-50 border border-red-200 px-4 py-1.5 rounded">
                  {searchFilter.location}
                  <img
                    onClick={() => setSearchFilter((prev) => ({ ...prev, location: "" }))}
                    className="cursor-pointer"
                    src={assets.cross_icon}
                    alt="Clear Location Filter"
                  />
                </span>
              )}
            </div>
          </>
        )}

        {/* Mobile Filter Toggle */}
        <button
          onClick={() => setShowFilter((prev) => !prev)}
          className="px-6 py-1.5 rounded border border-gray-400 lg:hidden"
        >
          {showFilter ? "Close" : "Filters"}
        </button>

        {/* Category Filter */}
        <div className={showFilter ? "" : "max-lg:hidden"}>
          <h4 className="font-medium text-lg py-4">Search by Categories</h4>
          <ul className="space-y-3 text-gray-600">
            {JobCategories.map((category, index) => (
              <li key={index} className="flex gap-3 items-center">
                <input
                  type="checkbox"
                  onChange={() => toggleSelection(selectedCategories, setSelectedCategories, category)}
                  checked={selectedCategories.includes(category)}
                  className="scale-125"
                />
                <label className="cursor-pointer">{category}</label>
              </li>
            ))}
          </ul>
        </div>

        {/* Location Filter */}
        <div className={showFilter ? "" : "max-lg:hidden"}>
          <h4 className="font-medium text-lg py-4 pt-10">Search by Location</h4>
          <ul className="space-y-3 text-gray-600">
            {JobLocations.map((location, index) => (
              <li key={index} className="flex gap-3 items-center">
                <input
                  type="checkbox"
                  onChange={() => toggleSelection(selectedLocations, setSelectedLocations, location)}
                  checked={selectedLocations.includes(location)}
                  className="scale-125"
                />
                <label className="cursor-pointer">{location}</label>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Job Listings */}
      <section className="w-full lg:w-3/4 text-gray-800 max-lg:px-4">
        <h3 className="font-medium text-3xl py-2" id="job-list">Latest Jobs</h3>
        <p className="mb-8">
          {filteredJobs.length === 0
            ? "No jobs found. Try adjusting your search criteria."
            : "Get your desired job from top companies."}
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
          {filteredJobs
            .slice((currentPage - 1) * 6, currentPage * 6)
            .map((job) => {
              const hasApplied = userApplications.includes(job._id);
              return <JobCard key={job._id} job={job} hasApplied={hasApplied} />;
            })}
        </div>

        {/* Pagination */}
        {filteredJobs.length > 6 && (
          <div className="flex justify-center items-center space-x-2 mt-10">
            <button
              onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
              disabled={currentPage === 1}
            >
              <img src={assets.left_arrow_icon} alt="Previous Page" />
            </button>
            {Array.from({ length: Math.ceil(filteredJobs.length / 6) }).map((_, i) => (
              <a key={i} href="#job-list">
                <button
                  onClick={() => setCurrentPage(i + 1)}
                  className={`w-10 h-10 flex items-center justify-center border rounded ${
                    currentPage === i + 1
                      ? "bg-blue-100 text-blue-500"
                      : "text-gray-500 hover:bg-red-100"
                  }`}
                >
                  {i + 1}
                </button>
              </a>
            ))}
            <button
              onClick={() =>
                setCurrentPage((p) => Math.min(p + 1, Math.ceil(filteredJobs.length / 6)))
              }
              disabled={currentPage === Math.ceil(filteredJobs.length / 6)}
            >
              <img src={assets.right_arrow_icon} alt="Next Page" />
            </button>
          </div>
        )}
      </section>
    </div>
  );
};

export default JobListings;

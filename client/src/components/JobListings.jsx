import React, { useContext } from 'react';
import { AppContext } from '../context/AppContext';
import { assets } from '../assets/assets';

const JobCategories = [
    "Programming",
    "Data Science",
    "Designing",
    "Networking",
    "Management",
    "Marketing",
    "Cybersecurity"
];

const JobListings = () => {
  const { isSearched, searchFilter, setSearchFilter } = useContext(AppContext);

  return (
    <div className="container 2xl:px-20 mx-auto flex flex-col lg:flex-row max-lg:space-y-8 py-8">

      {/* Sidebar */}
      <div className="w-full lg:w-1/4 bg-white px-4">

        {/* Search Filter from Hero Component */}
        {isSearched && (searchFilter.title !== "" || searchFilter.location !== "") && (
          <>
            <h3 className="font-medium text-lg mb-4">Current Search</h3>
            <div className="mb-4 text-gray-600">
              {searchFilter.title && (
                <span className="inline-flex items-center gap-2.5 bg-blue-50 border border-blue-200 px-4 py-1.5 rounded">
                  {searchFilter.title}
                  <img
                    onClick={() => setSearchFilter(prev => ({ ...prev, title: "" }))}
                    className="cursor-pointer"
                    src={assets.cross_icon}
                    alt="Clear Title Filter"
                  />
                </span>
              )}
              {searchFilter.location && (
                <span className="ml-2 inline-flex items-center gap-2.5 bg-red-50 border border-red-200 px-4 py-1.5 rounded">
                  {searchFilter.location}
                  <img
                    onClick={() => setSearchFilter(prev => ({ ...prev, location: "" }))}
                    className="cursor-pointer"
                    src={assets.cross_icon}
                    alt="Clear Location Filter"
                  />
                </span>
              )}
            </div>
          </>
        )}

        {/* Category Filter */}
        <div className="max-lg:hidden">
          <h4 className="font-medium text-lg py-4">Search by Categories</h4>
          <ul className="space-y text-gray-600">
            {JobCategories.map((category, index) => (
              <li className="flex gap-3 items-center" key={category}>
                <input 
                  type="checkbox" name={category} id={`category-${index}`} className='sale-125'/>
                 {category}
              </li>
            ))}
          </ul>
        </div>

      </div>
    </div>
  );
}

export default JobListings;

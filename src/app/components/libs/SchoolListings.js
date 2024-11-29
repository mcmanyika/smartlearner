"use client";
import React, { useState, useEffect, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import { database } from "../../../../utils/firebaseConfig";
import { ref, onValue } from "firebase/database";

const SchoolListings = () => {
  const [schools, setSchools] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    name: '',
    location: '',
    curriculum: '',
    feeRange: '',
    ownership: ''
  });

  // Reset to first page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [filters]);

  // Filter change handler
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Filter function
  const filterSchools = useMemo(() => {
    return schools.filter(school => {
      const nameMatch = school.schoolName.toLowerCase().includes(filters.name.toLowerCase());
      const locationMatch = !filters.location || school.location === filters.location;
      const curriculumMatch = !filters.curriculum || school.curriculum === filters.curriculum;
      const feeRangeMatch = !filters.feeRange || school.feeRange === filters.feeRange;
      const ownershipMatch = !filters.ownership || school.ownership === filters.ownership;

      return nameMatch && locationMatch && curriculumMatch && feeRangeMatch && ownershipMatch;
    });
  }, [schools, filters]);

  // Get unique values for select options
  const uniqueLocations = [...new Set(schools.map(school => school.location))].sort();
  const uniqueCurriculums = [...new Set(schools.map(school => school.curriculum))].sort();
  const uniqueFeeRanges = [...new Set(schools.map(school => school.feeRange))].sort();
  const uniqueOwnerships = [...new Set(schools.map(school => school.ownership))].sort();

  // Add these new state variables
  const [currentPage, setCurrentPage] = useState(1);
  const schoolsPerPage = 9; // 3x3 grid

  // Calculate pagination values
  const indexOfLastSchool = currentPage * schoolsPerPage;
  const indexOfFirstSchool = indexOfLastSchool - schoolsPerPage;
  const currentSchools = filterSchools.slice(indexOfFirstSchool, indexOfLastSchool);
  const totalPages = Math.ceil(filterSchools.length / schoolsPerPage);

  // Pagination controls
  const paginate = (pageNumber) => {
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Add Firebase data fetching
  useEffect(() => {
    const schoolsRef = ref(database, 'schools');
    
    setLoading(true);
    onValue(schoolsRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        // Convert Firebase object to array with IDs
        const schoolsArray = Object.entries(data).map(([id, school]) => ({
          id,
          ...school
        }));
        setSchools(schoolsArray);
      } else {
        setSchools([]);
      }
      setLoading(false);
    }, (error) => {
      console.error('Error fetching schools:', error);
      setLoading(false);
    });
  }, []);

  return (
    <div className="w-full p-6 bg-gray-50">
      {/* Filter Section */}
      <div className="mb-8 bg-white p-6 rounded-xl shadow-sm">
        <h2 className="text-xl font-semibold mb-4 text-gray-800">Filter Schools</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          {/* Name Filter */}
          <div className="space-y-2">
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">
              School Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={filters.name}
              onChange={handleFilterChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Search by name..."
            />
          </div>

          {/* Location Filter */}
          <div className="space-y-2">
            <label htmlFor="location" className="block text-sm font-medium text-gray-700">
              Location
            </label>
            <select
              id="location"
              name="location"
              value={filters.location}
              onChange={handleFilterChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">All Locations</option>
              {uniqueLocations.map(location => (
                <option key={location} value={location}>{location}</option>
              ))}
            </select>
          </div>

          {/* Curriculum Filter */}
          <div className="space-y-2">
            <label htmlFor="curriculum" className="block text-sm font-medium text-gray-700">
              Curriculum
            </label>
            <select
              id="curriculum"
              name="curriculum"
              value={filters.curriculum}
              onChange={handleFilterChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">All Curriculums</option>
              {uniqueCurriculums.map(curriculum => (
                <option key={curriculum} value={curriculum}>{curriculum}</option>
              ))}
            </select>
          </div>

          {/* Fee Range Filter */}
          <div className="space-y-2">
            <label htmlFor="feeRange" className="block text-sm font-medium text-gray-700">
              Fee Range
            </label>
            <select
              id="feeRange"
              name="feeRange"
              value={filters.feeRange}
              onChange={handleFilterChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">All Fee Ranges</option>
              {uniqueFeeRanges.map(range => (
                <option key={range} value={range}>{range}</option>
              ))}
            </select>
          </div>

          {/* Ownership Filter */}
          <div className="space-y-2">
            <label htmlFor="ownership" className="block text-sm font-medium text-gray-700">
              Ownership
            </label>
            <select
              id="ownership"
              name="ownership"
              value={filters.ownership}
              onChange={handleFilterChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">All Types</option>
              {uniqueOwnerships.map(ownership => (
                <option key={ownership} value={ownership}>{ownership}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Reset Filters Button */}
        <div className="mt-4 flex justify-end">
          <button
            onClick={() => setFilters({
              name: '',
              location: '',
              curriculum: '',
              feeRange: '',
              ownership: ''
            })}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Reset Filters
          </button>
        </div>
      </div>

      {/* Results Count */}
      <div className="mb-4 text-gray-600">
        Found {filterSchools.length} schools matching your criteria
      </div>

      {loading ? (
        <div className="flex justify-center items-center min-h-[200px]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        </div>
      ) : filterSchools.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-600 text-lg">No schools match your search criteria.</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {currentSchools.map((school) => (
              <div
                key={school.id}
                className="bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300 overflow-hidden"
              >
                <div className="p-6">
                  <h2 className="text-xl font-semibold mb-3 text-gray-800">{school.schoolName}</h2>
                  <div className="space-y-2">
                    <div className="flex items-center text-gray-600">
                      <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      <p>{school.location}</p>
                    </div>
                    <div className="flex items-center text-gray-600">
                      <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                      </svg>
                      <p>{school.curriculum}</p>
                    </div>
                    <div className="flex items-center text-gray-600">
                      <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                      </svg>
                      <p>{school.ownership}</p>
                    </div>
                    <div className="flex items-center text-gray-600">
                      <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <p>{school.feeRange}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination Controls */}
          <div className="mt-8 flex justify-center items-center gap-2">
            <button
              onClick={() => paginate(currentPage - 1)}
              disabled={currentPage === 1}
              className={`px-4 py-2 rounded-lg ${
                currentPage === 1
                  ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                  : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-300'
              }`}
            >
              Previous
            </button>

            {[...Array(totalPages)].map((_, index) => {
              const pageNumber = index + 1;
              // Show only nearby pages
              if (
                pageNumber === 1 ||
                pageNumber === totalPages ||
                (pageNumber >= currentPage - 1 && pageNumber <= currentPage + 1)
              ) {
                return (
                  <button
                    key={pageNumber}
                    onClick={() => paginate(pageNumber)}
                    className={`px-4 py-2 rounded-lg ${
                      currentPage === pageNumber
                        ? 'bg-blue-500 text-white'
                        : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-300'
                    }`}
                  >
                    {pageNumber}
                  </button>
                );
              } else if (
                pageNumber === currentPage - 2 ||
                pageNumber === currentPage + 2
              ) {
                return (
                  <span key={pageNumber} className="px-2">
                    ...
                  </span>
                );
              }
              return null;
            })}

            <button
              onClick={() => paginate(currentPage + 1)}
              disabled={currentPage === totalPages}
              className={`px-4 py-2 rounded-lg ${
                currentPage === totalPages
                  ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                  : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-300'
              }`}
            >
              Next
            </button>
          </div>

          {/* Page Info */}
          <div className="mt-4 text-center text-gray-600">
            Showing {indexOfFirstSchool + 1} to {Math.min(indexOfLastSchool, filterSchools.length)} of{' '}
            {filterSchools.length} schools
          </div>
        </>
      )}
    </div>
  );
};

export default SchoolListings;

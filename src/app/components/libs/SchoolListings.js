"use client";
import React, { useState, useEffect, useMemo } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { database } from "../../../../utils/firebaseConfig";
import { ref, onValue } from "firebase/database";

const SchoolListings = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [schools, setSchools] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);

  // Initialize filters from URL params
  const [filters, setFilters] = useState({
    schoolName: searchParams.get('schoolName') || '',
    location: searchParams.get('location') || '',
    curriculum: searchParams.get('curriculum') || '',
    feeRange: searchParams.get('feeRange') || '',
    ownership: searchParams.get('ownership') || ''
  });

  // Reset to first page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [filters]);

  // Filter function
  const filteredSchools = useMemo(() => {
    return schools.filter(school => {
      const nameMatch = !filters.schoolName || 
        school.schoolName?.toLowerCase().includes(filters.schoolName.toLowerCase());
      
      const locationMatch = !filters.location || 
        school.location?.toLowerCase() === filters.location.toLowerCase();
      
      const curriculumMatch = !filters.curriculum || 
        school.curriculum?.toLowerCase() === filters.curriculum.toLowerCase();
      
      const feeRangeMatch = !filters.feeRange || 
        school.feeRange === filters.feeRange;
      
      const ownershipMatch = !filters.ownership || 
        school.ownership?.toLowerCase() === filters.ownership.toLowerCase();

      return nameMatch && locationMatch && curriculumMatch && 
             feeRangeMatch && ownershipMatch;
    });
  }, [schools, filters]);

  // Get unique values for filter options
  const uniqueLocations = [...new Set(schools.map(school => school.location))].sort();
  const uniqueCurriculums = [...new Set(schools.map(school => school.curriculum))].sort();
  const uniqueFeeRanges = [...new Set(schools.map(school => school.feeRange))].sort();
  const uniqueOwnerships = [...new Set(schools.map(school => school.ownership))].sort();

  // Pagination calculations
  const schoolsPerPage = 9;
  const indexOfLastSchool = currentPage * schoolsPerPage;
  const indexOfFirstSchool = indexOfLastSchool - schoolsPerPage;
  const currentSchools = filteredSchools.slice(indexOfFirstSchool, indexOfLastSchool);
  const totalPages = Math.ceil(filteredSchools.length / schoolsPerPage);

  // Handle filter changes
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));

    // Update URL
    const newParams = new URLSearchParams(searchParams.toString());
    if (value) {
      newParams.set(name, value);
    } else {
      newParams.delete(name);
    }
    router.replace(`/libs/schools?${newParams.toString()}`, { scroll: false });
  };

  // Reset filters
  const resetFilters = () => {
    setFilters({
      schoolName: '',
      location: '',
      curriculum: '',
      feeRange: '',
      ownership: ''
    });
    router.replace('/libs/schools');
  };

  // Fetch schools data
  useEffect(() => {
    const schoolsRef = ref(database, 'schools');
    
    setLoading(true);
    onValue(schoolsRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
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

  // Pagination handler
  const paginate = (pageNumber) => {
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="w-full p-6 bg-gray-50">
      {/* Filter Section */}
      <div className="mb-8 bg-white p-6 rounded-xl shadow-sm">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-800">Filter Schools</h2>
          <button
            onClick={resetFilters}
            className="text-sm text-gray-600 hover:text-blue-600"
          >
            Reset Filters
          </button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          <input
            type="text"
            name="schoolName"
            value={filters.schoolName}
            onChange={handleFilterChange}
            placeholder="School Name"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg"
          />
          
          <select
            name="location"
            value={filters.location}
            onChange={handleFilterChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg"
          >
            <option value="">All Locations</option>
            {uniqueLocations.map(location => (
              <option key={location} value={location}>{location}</option>
            ))}
          </select>

          <select
            name="curriculum"
            value={filters.curriculum}
            onChange={handleFilterChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg"
          >
            <option value="">All Curriculums</option>
            {uniqueCurriculums.map(curriculum => (
              <option key={curriculum} value={curriculum}>{curriculum}</option>
            ))}
          </select>

          <select
            name="feeRange"
            value={filters.feeRange}
            onChange={handleFilterChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg"
          >
            <option value="">All Fee Ranges</option>
            {uniqueFeeRanges.map(range => (
              <option key={range} value={range}>{range}</option>
            ))}
          </select>

          <select
            name="ownership"
            value={filters.ownership}
            onChange={handleFilterChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg"
          >
            <option value="">All Ownerships</option>
            {uniqueOwnerships.map(ownership => (
              <option key={ownership} value={ownership}>{ownership}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Results Count */}
      <div className="mb-4 text-gray-600">
        Found {filteredSchools.length} schools matching your criteria
      </div>

      {/* School Cards */}
      {loading ? (
        <div className="flex justify-center items-center min-h-[200px]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        </div>
      ) : filteredSchools.length === 0 ? (
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
            Showing {indexOfFirstSchool + 1} to {Math.min(indexOfLastSchool, filteredSchools.length)} of{' '}
            {filteredSchools.length} schools
          </div>
        </>
      )}
    </div>
  );
};

export default SchoolListings;

"use client";
import React, { useState, useEffect, useMemo } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { database } from "../../../../utils/firebaseConfig";
import { ref, onValue } from "firebase/database";
import SchoolCard from './SchoolCard';
import SchoolFilterForm from './SchoolFilterForm';

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

  // Update filters when URL params change
  useEffect(() => {
    setFilters({
      schoolName: searchParams.get('schoolName') || '',
      location: searchParams.get('location') || '',
      curriculum: searchParams.get('curriculum') || '',
      feeRange: searchParams.get('feeRange') || '',
      ownership: searchParams.get('ownership') || ''
    });
  }, [searchParams]);

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
      {/* Filter Form */}
      <SchoolFilterForm
        filters={filters}
        handleFilterChange={handleFilterChange}
        resetFilters={resetFilters}
        uniqueLocations={uniqueLocations}
        uniqueCurriculums={uniqueCurriculums}
        uniqueFeeRanges={uniqueFeeRanges}
        uniqueOwnerships={uniqueOwnerships}
      />

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
              <SchoolCard key={school.id} school={school} />
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

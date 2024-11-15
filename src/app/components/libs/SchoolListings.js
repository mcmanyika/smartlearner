import React, { useState, useEffect, useMemo } from "react";
import { database } from "../../../../utils/firebaseConfig"; // Adjust the path as necessary
import { ref, onValue, update } from "firebase/database";
import {  toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const SchoolListings = () => {
  const [schools, setSchools] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedSchool, setSelectedSchool] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // State for filters
  const [filterName, setFilterName] = useState("");
  const [filterLocation, setFilterLocation] = useState("");
  const [filterCurriculum, setFilterCurriculum] = useState("ZIMSEC");
  const [filterFeeRange, setFilterFeeRange] = useState("Less than $100");
  const [filterOwnership, setFilterOwnership] = useState("Government");

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const schoolsPerPage = 20;

  // Static filter options
  const feeRanges = ["Less than $100", "$101 - $500", "$501 - $1000", "$1001 - $3000", "Plus $3001"];
  const ownershipOptions = ["Government", "Council", "Private"];
  const curriculumOptions = ["Cambridge", "ZIMSEC", "IB", "Others"];
  const provinces = [
    "Harare",
    "Bulawayo",
    "Manicaland",
    "Mashonaland East",
    "Mashonaland West",
    "Masvingo",
    "Midlands",
    "Matabeleland North",
    "Matabeleland South",
  ];

  useEffect(() => {
    const schoolsRef = ref(database, "schools");
    onValue(schoolsRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const schoolList = Object.keys(data).map((key) => ({
          id: key,
          ...data[key],
        }));
        setSchools(schoolList);
      } else {
        setSchools([]);
      }
      setLoading(false);
    });
  }, []);

  const filterSchools = (school) => {
    return (
      (filterName === "" || school.schoolName.toLowerCase().includes(filterName.toLowerCase())) &&
      (filterLocation === "" || school.location === filterLocation) &&
      (filterCurriculum === "" || school.curriculum === filterCurriculum) &&
      (filterFeeRange === "" || school.feeRange === filterFeeRange) &&
      (filterOwnership === "" || school.ownership === filterOwnership)
    );
  };

  const filteredSchools = useMemo(() => {
    return schools
      .filter(filterSchools)
      .sort((a, b) => a.schoolName.localeCompare(b.schoolName));
  }, [schools, filterName, filterLocation, filterCurriculum, filterFeeRange, filterOwnership]);

  const indexOfLastSchool = currentPage * schoolsPerPage;
  const indexOfFirstSchool = indexOfLastSchool - schoolsPerPage;
  const currentSchools = filteredSchools.slice(indexOfFirstSchool, indexOfLastSchool);
  const totalPages = Math.ceil(filteredSchools.length / schoolsPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handleSchoolClick = (school) => {
    setSelectedSchool(school);
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setSelectedSchool(null);
    setIsModalOpen(false);
  };

  const handleSchoolUpdate = () => {
    if (selectedSchool) {
      const schoolRef = ref(database, `schools/${selectedSchool.id}`);
      update(schoolRef, selectedSchool)
        .then(() => {
          toast.success("School updated successfully!");
          setIsModalOpen(false);
        })
        .catch((error) => {
          console.error("Error updating school:", error);
          toast.error("Failed to update school.");
        });
    }
  };

  const renderPagination = () => {
    const pageNumbers = [];
    for (let i = 1; i <= totalPages; i++) {
      pageNumbers.push(i);
    }

    const visiblePages = pageNumbers.slice(
      Math.max(0, currentPage - 2),
      Math.min(totalPages, currentPage + 1)
    );

    return (
      <div className="flex justify-center mt-4 space-x-2">
        {currentPage > 3 && (
          <>
            <button
              className="px-3 py-1 rounded bg-gray-300"
              onClick={() => handlePageChange(1)}
            >
              1
            </button>
            {currentPage > 4 && <span className="px-3 py-1">...</span>}
          </>
        )}
        {visiblePages.map((page) => (
          <button
            key={page}
            onClick={() => handlePageChange(page)}
            className={`px-3 py-1 rounded ${
              currentPage === page ? "bg-blue-500 text-white" : "bg-gray-300 text-black"
            }`}
          >
            {page}
          </button>
        ))}
        {currentPage < totalPages - 3 && (
          <>
            {currentPage < totalPages - 4 && <span className="px-3 py-1">...</span>}
            <button
              className="px-3 py-1 rounded bg-gray-300"
              onClick={() => handlePageChange(totalPages)}
            >
              {totalPages}
            </button>
          </>
        )}
      </div>
    );
  };

  return (
    <div className="w-full p-4 bg-white text-sm">
      <div className="md:flex">
        <div className="w-full md:w-1/6 md:mr-10">
          <h3 className="text-md font-bold mt-8 mb-4">Refine Your Search:</h3>
          <div className="grid grid-cols-1 gap-4">
            <input
              type="text"
              placeholder="Filter by School Name"
              value={filterName}
              onChange={(e) => setFilterName(e.target.value)}
              className="w-full px-3 py-2 border rounded-full text-sm"
            />
            <select
              value={filterLocation}
              onChange={(e) => setFilterLocation(e.target.value)}
              className="w-full px-3 py-2 border rounded-full text-sm"
            >
              <option value="">Filter by Location</option>
              {provinces.map((province) => (
                <option key={province} value={province}>
                  {province}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="w-full md:w-5/6">
          {loading ? (
            <p>Loading...</p>
          ) : currentSchools.length === 0 ? (
            <p>No schools found.</p>
          ) : (
            <div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {currentSchools.map((school) => (
                  <div
                    key={school.id}
                    onClick={() => handleSchoolClick(school)}
                    className="border border-gray-200 mb-3 shadow-sm p-4 rounded-xl text-center cursor-pointer"
                  >
                    <h2 className="text-md font-semibold mb-2">{school.schoolName}</h2>
                    <p>{school.location}</p>
                    <p>{school.curriculum}</p>
                    <p>{school.ownership}</p>
                  </div>
                ))}
              </div>
              {renderPagination()}
            </div>
          )}
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && selectedSchool && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg max-w-md w-full">
            <h2 className="text-xl font-semibold mb-4">Edit School</h2>
            <input
              type="text"
              value={selectedSchool.schoolName}
              onChange={(e) =>
                setSelectedSchool((prev) => ({ ...prev, schoolName: e.target.value }))
              }
              className="w-full px-3 py-2 border rounded mb-4"
              placeholder="School Name"
              readOnly
            />
            <select
              value={selectedSchool.curriculum}
              onChange={(e) =>
                setSelectedSchool((prev) => ({ ...prev, curriculum: e.target.value }))
              }
              className="w-full px-3 py-2 border rounded mb-4"
            >
              {curriculumOptions.map((curriculum) => (
                <option key={curriculum} value={curriculum}>
                  {curriculum}
                </option>
              ))}
            </select>
            <select
              value={selectedSchool.feeRange}
              onChange={(e) =>
                setSelectedSchool((prev) => ({ ...prev, feeRange: e.target.value }))
              }
              className="w-full px-3 py-2 border rounded mb-4"
            >
              {feeRanges.map((fee) => (
                <option key={fee} value={fee}>
                  {fee}
                </option>
              ))}
            </select>
            <select readOnly
              value={selectedSchool.ownership}
              onChange={(e) =>
                setSelectedSchool((prev) => ({ ...prev, ownership: e.target.value }))
              }
              className="w-full px-3 py-2 border rounded mb-4"
            >
              {ownershipOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
              
            </select>
            <input
              type="text"
              value={selectedSchool.website}
              onChange={(e) =>
                setSelectedSchool((prev) => ({ ...prev, website: e.target.value }))
              }
              className="w-full px-3 py-2 border rounded mb-4"
              placeholder="Website URL"
              readOnly
            />
            <div className="flex justify-end space-x-2">
              <button
                onClick={handleModalClose}
                className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
              >
                Cancel
              </button>
              <button
                onClick={handleSchoolUpdate}
                
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                Update
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SchoolListings;

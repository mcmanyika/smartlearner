import { useState, useEffect, useMemo } from "react";
import { database } from "../../../../utils/firebaseConfig"; // Adjust the path as necessary
import { ref, onValue } from "firebase/database";

const SchoolListings = () => {
  const [schools, setSchools] = useState([]);
  const [loading, setLoading] = useState(true);

  // State for filters
  const [filterName, setFilterName] = useState("");
  const [filterLocation, setFilterLocation] = useState("");
  const [filterCurriculum, setFilterCurriculum] = useState("");
  const [filterFeeRange, setFilterFeeRange] = useState("");
  const [filterOwnership, setFilterOwnership] = useState("");

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const schoolsPerPage = 10; // Number of schools per page

  // Static filter options
  const feeRanges = ["Less than $100", "$101 - $500", "$501 - $1000", "$1001 - $3000", "Plus $3001"];
  const ownershipOptions = ["Government", "Council", "Private"];
  const provinces = [
    "Harare", "Bulawayo", "Manicaland", "Mashonaland East", "Mashonaland West", "Masvingo", "Midlands",
    "Matabeleland North", "Matabeleland South"
  ];

  useEffect(() => {
    const schoolsRef = ref(database, "schools");

    // Fetch schools from Firebase
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

  // Filter function encapsulated
  const filterSchools = (school) => {
    return (
      (filterName === "" || school.schoolName.toLowerCase().includes(filterName.toLowerCase())) &&
      (filterLocation === "" || school.location === filterLocation) &&
      (filterCurriculum === "" || school.curriculum === filterCurriculum) &&
      (filterFeeRange === "" || school.feeRange === filterFeeRange) &&
      (filterOwnership === "" || school.ownership === filterOwnership)
    );
  };

  // Memoized filtered schools
  const filteredSchools = useMemo(() => {
    return schools.filter(filterSchools);
  }, [schools, filterName, filterLocation, filterCurriculum, filterFeeRange, filterOwnership]);

  // Calculate pagination
  const indexOfLastSchool = currentPage * schoolsPerPage;
  const indexOfFirstSchool = indexOfLastSchool - schoolsPerPage;
  const currentSchools = filteredSchools.slice(indexOfFirstSchool, indexOfLastSchool);
  const totalPages = Math.ceil(filteredSchools.length / schoolsPerPage);

  // Handle page change
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  // Render filter inputs as reusable components
  const renderFilterInput = (label, value, onChange, placeholder) => (
    <input
      type="text"
      placeholder={placeholder || `Filter by ${label}`}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full px-3 py-2 border rounded-full"
    />
  );

  const renderDropdown = (label, value, onChange, options) => (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full px-3 py-2 border rounded-full"
    >
      <option value="">{`Filter by ${label}`}</option>
      {options.map((option) => (
        <option key={option} value={option}>
          {option}
        </option>
      ))}
    </select>
  );

  return (
    <div className="w-full p-4 pt-0 pb-0 bg-white text-sm">
      {/* Layout with filters and school listings */}
      <div className="flex">
        {/* Filters Section */}
        <div className="w-1/6 mr-10 border-0 rounded-tr-lg border-r-4">
          <h3 className="text-md font-bold mt-20  m-4">Refine Your Search:</h3>
          <div className="grid grid-cols-1 mr-6 gap-4">
            {renderFilterInput("School Name", filterName, setFilterName)}
            {renderDropdown("Location", filterLocation, setFilterLocation, provinces)}
            {renderDropdown("Curriculum", filterCurriculum, setFilterCurriculum, ["Cambridge", "ZIMSEC", "IB", "Others"])}
            {renderDropdown("Fee Range", filterFeeRange, setFilterFeeRange, feeRanges)}
            {renderDropdown("Ownership", filterOwnership, setFilterOwnership, ownershipOptions)}
          </div>
        </div>

        {/* School Listings Section */}
        <div className="w-5/6">
          {loading ? (
            <p>Loading schools...</p>
          ) : currentSchools.length === 0 ? (
            <p>No schools found.</p>
          ) : (
            <>
              <div className=" p-6">
                <h1 className="text-2xl pl-12"><strong>{filteredSchools.length}</strong> Schools found</h1>
              </div>
              <div id="listing" className="grid grid-cols-1 gap-3 overflow-y-auto h-[56rem] mb-0 scrollbar-none">
                {/* Display number of schools found */}
                {currentSchools.map(({ id, schoolName, location, curriculum, feeRange, ownership }) => (
                  <div key={id} className=" border border-gray-200 hover:shadow cursor-pointer p-5 rounded-3xl">
                    <div className="w-full flex">
                        <div className="w-3/4">
                            <h2 className="text-md font-semibold mb-2">{schoolName}</h2>
                            <p>{location}</p>
                            <p>{curriculum}</p>
                            <p>{ownership}</p>
                        </div>
                        <div className="w-1/4 flex items-end justify-end">
                        <button className="p-2 bg-slate-200 rounded-l-full">{feeRange}</button>
                        <button className="p-2 bg-blue-400 text-white rounded-r-full">Visit Site</button>
                        </div>
                    </div>
                  </div>
                ))}
                {/* Pagination Controls */}
                <div className="flex justify-end mt-4 space-x-2">
                  {Array.from({ length: totalPages }, (_, index) => (
                    <button
                      key={index + 1}
                      onClick={() => handlePageChange(index + 1)}
                      className={`px-4 py-2 rounded-full ${currentPage === index + 1 ? 'bg-blue-500 text-white' : 'bg-gray-300 text-black'}`}
                    >
                      {index + 1}
                    </button>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default SchoolListings;

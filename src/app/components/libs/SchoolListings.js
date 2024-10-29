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
  const schoolsPerPage = 10;

  // Static filter options
  const feeRanges = ["Less than $100", "$101 - $500", "$501 - $1000", "$1001 - $3000", "Plus $3001"];
  const ownershipOptions = ["Government", "Council", "Private"];
  const provinces = [
    "Harare", "Bulawayo", "Manicaland", "Mashonaland East", "Mashonaland West", "Masvingo", "Midlands",
    "Matabeleland North", "Matabeleland South"
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

  const renderFilterInput = (label, value, onChange, placeholder) => (
    <input
      type="text"
      placeholder={placeholder || `Filter by ${label}`}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full px-3 py-2 border rounded-full text-sm"
    />
  );

  const renderDropdown = (label, value, onChange, options) => (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full px-3 py-2 border rounded-full text-sm"
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
    <div className="w-full p-4 bg-white text-sm">
      <div className="md:flex">
        <div className="w-full md:w-1/6 md:mr-10">
          <h3 className="text-md font-bold mt-8 mb-4">Refine Your Search:</h3>
          <div className="grid grid-cols-1 gap-4">
            {renderFilterInput("School Name", filterName, setFilterName)}
            {renderDropdown("Location", filterLocation, setFilterLocation, provinces)}
            {renderDropdown("Curriculum", filterCurriculum, setFilterCurriculum, ["Cambridge", "ZIMSEC", "IB", "Others"])}
            {renderDropdown("Fee Range", filterFeeRange, setFilterFeeRange, feeRanges)}
            {renderDropdown("Ownership", filterOwnership, setFilterOwnership, ownershipOptions)}
          </div>
        </div>

        <div className="w-full md:w-5/6">
          {loading ? (
            <p>Loading...</p>
          ) : currentSchools.length === 0 ? (
            <p>No schools found.</p>
          ) : (
            <div>
              <div className="p-4">
                <h1 className="text-xl font-light"><strong>{filteredSchools.length}</strong> Schools found</h1>
              </div>
              <div className="grid grid-cols-1 gap-4">
                <div className="overflow-y-auto h-[56rem]">
                  {currentSchools.map(({ id, schoolName, location, curriculum, feeRange, ownership, website }) => (
                    <div key={id} className="border border-gray-200 mb-3 shadow-sm p-4 rounded-xl text-center md:text-left">
                      <h2 className="text-md font-semibold mb-2">{schoolName}</h2>
                      <p>{location}</p>
                      <p>{curriculum}</p>
                      <p>{ownership}</p>
                      <div className="flex justify-center md:justify-end mt-4 space-x-2">
                        <button className="px-3 py-1 bg-slate-200 rounded-full">{feeRange}</button>
                        <button
                          className="px-3 py-1 bg-blue-500 text-white rounded-full"
                          onClick={() => window.open(website, '_blank')}
                          disabled={!website}
                        >
                          Visit Site
                        </button>
                      </div>
                    </div>
                  ))}
                  <div className="flex justify-center md:justify-end mt-4 space-x-2">
                    {Array.from({ length: totalPages }, (_, index) => (
                      <button
                        key={index + 1}
                        onClick={() => handlePageChange(index + 1)}
                        className={`px-3 py-1 rounded-full ${currentPage === index + 1 ? 'bg-blue-500 text-white' : 'bg-gray-300 text-black'}`}
                      >
                        {index + 1}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SchoolListings;

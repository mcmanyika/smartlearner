import { useState } from "react";
import { database } from "../../../../utils/firebaseConfig"; // Adjust the path as necessary
import { ref, push } from "firebase/database";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const AddSchool = () => {
  const [schoolName, setSchoolName] = useState("");
  const [location, setLocation] = useState("");
  const [curriculum, setCurriculum] = useState("");
  const [feeRange, setFeeRange] = useState("");
  const [ownership, setOwnership] = useState(""); 
  const [website, setWebsite] = useState(""); // State for the website field

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

  const feeRanges = [
    "Less than $100",
    "$101 - $500",
    "$501 - $1000",
    "$1001 - $3000",
    "Plus $3001",
  ];

  const ownershipOptions = [
    "Government",
    "Council",
    "Private",
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newSchool = {
      schoolName,
      location,
      curriculum,
      feeRange,
      ownership,
      website, // Include the website in the new school data
    };

    try {
      await push(ref(database, "schools"), newSchool);

      setSchoolName("");
      setLocation("");
      setCurriculum("");
      setFeeRange("");
      setOwnership("");
      setWebsite(""); // Clear the website field

      toast.success("School added successfully!");
    } catch (error) {
      console.error("Error adding school:", error);
      toast.error("Error adding school. Please try again.");
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white rounded-lg text-gray-500 font-thin">
      <h1 className="text-xl font-bold mb-4">Add a New School</h1>
      <form onSubmit={handleSubmit}>
        {/* School Name */}
        <div className="mb-4">
          <input
            type="text"
            id="schoolName"
            value={schoolName}
            onChange={(e) => setSchoolName(e.target.value)}
            required
            className="w-full p-2 pl-6 pr-6 border rounded-full"
            placeholder="School name"
          />
        </div>

        {/* Location (Dropdown) */}
        <div className="mb-4">
          <select
            id="location"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            required
            className="w-full p-2 pl-6 pr-6 border rounded-full"
          >
            <option value="">Select location</option>
            {provinces.map((province) => (
              <option key={province} value={province}>
                {province}
              </option>
            ))}
          </select>
        </div>

        {/* Curriculum (Dropdown) */}
        <div className="mb-4">
          <select
            id="curriculum"
            value={curriculum}
            onChange={(e) => setCurriculum(e.target.value)}
            required
            className="w-full p-2 pl-6 pr-6 border rounded-full"
          >
            <option value="">Select curriculum</option>
            <option value="Cambridge">Cambridge</option>
            <option value="ZIMSEC">ZIMSEC</option>
            <option value="IB">International Baccalaureate (IB)</option>
            <option value="Others">Others</option>
          </select>
        </div>

        {/* Fee Range (Dropdown) */}
        <div className="mb-4">
          <select
            id="feeRange"
            value={feeRange}
            onChange={(e) => setFeeRange(e.target.value)}
            required
            className="w-full p-2 pl-6 pr-6 border rounded-full"
          >
            <option value="">Select fee range</option>
            {feeRanges.map((fee) => (
              <option key={fee} value={fee}>
                {fee}
              </option>
            ))}
          </select>
        </div>

        {/* Ownership (Dropdown) */}
        <div className="mb-4">
          <select
            id="ownership"
            value={ownership}
            onChange={(e) => setOwnership(e.target.value)}
            required
            className="w-full p-2 pl-6 pr-6 border rounded-full"
          >
            <option value="">Select ownership type</option>
            {ownershipOptions.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        </div>

        {/* Website */}
        <div className="mb-4">
          <input
            type="url"
            id="website"
            value={website}
            onChange={(e) => setWebsite(e.target.value)}
            required
            className="w-full p-2 pl-6 pr-6 border rounded-full"
            placeholder="School website URL"
          />
        </div>

        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition"
        >
          Add School
        </button>
      </form>
      <ToastContainer
        position="bottom-center"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
      />
    </div>
  );
};

export default AddSchool;

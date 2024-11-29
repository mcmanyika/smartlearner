import { useState } from "react";
import { database } from "../../../../utils/firebaseConfig"; // Adjust the path as necessary
import { ref, push } from "firebase/database";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const AddSchool = () => {
  const [schoolName, setSchoolName] = useState("");
  const [location, setLocation] = useState("");

  // Default values for hidden fields
  const curriculum = "ZIMSEC";
  const feeRange = "Less than $100";
  const ownership = "Government";
  const website = "https://smartlearner.vercel.app/";

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

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newSchool = {
      schoolName,
      location,
      curriculum, // Default value
      feeRange,   // Default value
      ownership,  // Default value
      website,    // Default value
    };

    try {
      await push(ref(database, "schools"), newSchool);

      setSchoolName("");
      setLocation("");

      toast.success("School added successfully!");
    } catch (error) {
      console.error("Error adding school:", error);
      toast.error("Error adding school. Please try again.");
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white rounded-lg text-gray-500 font-thin">
      <h1 className="text-xl font-bold mt-20 mb-4">Add a New School</h1>
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

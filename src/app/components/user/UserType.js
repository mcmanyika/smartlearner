import { useState } from 'react';
import { ref, set, get } from 'firebase/database';
import { database } from '../../../../utils/firebaseConfig'; // Adjust the path as needed
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useRouter } from 'next/router';

const UserTypeSelector = ({ userEmail }) => {
  const [userType, setUserType] = useState('');
  const [selectedSchool, setSelectedSchool] = useState('');
  const router = useRouter();

  const handleUserTypeChange = (event) => {
    setUserType(event.target.value);
  };

  const handleSchoolChange = (event) => {
    setSelectedSchool(event.target.value);
  };

  const handleSubmit = async () => {
    if (userEmail && userType && selectedSchool) {
      try {
        const userRef = ref(database, `userTypes/${userEmail.replace('.', '_')}`);
        const snapshot = await get(userRef);
        
        if (snapshot.exists()) {
          toast.error('This email is already registered.');
        } else {
          await set(userRef, { userType, school: selectedSchool });
          toast.success('User type and school saved successfully');
          setTimeout(() => {
            router.push('/');
          }, 2000); // Redirect after 2 seconds to allow the toast message to be shown
        }
      } catch (error) {
        toast.error('Error saving user type and school');
        console.error('Error saving user type and school: ', error);
      }
    } else {
      toast.warning('Please select a user type and school');
    }
  };

  return (
    <div className="mb-4">
      <select
        id="school"
        value={selectedSchool}
        onChange={handleSchoolChange}
        className="mt-4 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
      >
        <option value="" disabled>Select school...</option>
        <option value="Divaris Makaharis High">Divaris Makaharis High</option>
        <option value="Glenview 2 High">Glenview 2 High</option>
      </select>
      <select
        id="userType"
        value={userType}
        onChange={handleUserTypeChange}
        className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
      >
        <option value="" disabled>Select user type...</option>
        <option value="student">Student</option>
        <option value="teacher">Teacher</option>
        <option value="staff">Staff</option>
        <option value="parent">Parent</option>
        <option value="contractor">Contractor</option>
      </select>
      <button
        onClick={handleSubmit}
        className="mt-4 w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-700"
      >
        Submit
      </button>
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

export default UserTypeSelector;

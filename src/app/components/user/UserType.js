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

  const generateUserId = (type) => {
    const prefix = type === 'student' ? 'STID' :
                   type === 'teacher' ? 'TEID' :
                   type === 'staff' ? 'SFID' :
                   type === 'parent' ? 'PRID' :
                   'CTID';
    return `${prefix}-${Math.floor(Math.random() * 1000000).toString().padStart(6, '0')}`;
  };

  const handleSubmit = async () => {
    if (userEmail && userType && selectedSchool) {
      try {
        const userRef = ref(database, `userTypes/${userEmail.replace('.', '_')}`);
        const snapshot = await get(userRef);
        
        if (snapshot.exists()) {
          toast.error('This email is already registered.');
        } else {
          const userId = generateUserId(userType);
          await set(userRef, { userType, school: selectedSchool, userId });
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
    <div className="max-w-lg mx-auto mt-10 p-8 bg-white rounded-lg shadow-md">
      <select
        id="school"
        value={selectedSchool}
        onChange={handleSchoolChange}
        className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
      >
        <option value="" disabled>Select school...</option>
        <option value="Divaris Makaharis High">Divaris Makaharis High</option>
        <option value="Glenview 2 High">Glenview 2 High</option>
      </select>
      <select
        id="userType"
        value={userType}
        onChange={handleUserTypeChange}
        className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
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

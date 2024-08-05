import React, { useState, useEffect } from 'react';
import { ref, set } from 'firebase/database';
import { database } from '../../utils/firebaseConfig'; // Adjust the path as necessary
import SmartBlankLayout from '../app/components/SmartBlankLayout';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useRouter } from 'next/router';
import { useSession } from 'next-auth/react'; // Import useSession from next-auth
import { useGlobalState } from '../app/store'; // Adjust the path as necessary

const generateStudentId = () => {
  return `STID-${Math.floor(Math.random() * 1000000).toString().padStart(6, '0')}`;
};

const StudentForm = () => {
  const { data: session } = useSession(); // Fetch session data
  const [formData, setFormData] = useState({
    studentId: '',
    email: '',
    schoolName: '',
    gradeLevel: '',
    className: '',
    graduationYear: '',
  });
  const [studentId, setStudentId] = useGlobalState('studentId');
  const router = useRouter();

  useEffect(() => {
    const newStudentId = generateStudentId();
    setFormData((prevFormData) => ({
      ...prevFormData,
      studentId: newStudentId,
      email: session?.user?.email || '', // Set email from session
    }));
  }, [session]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const studentRef = ref(database, `students/${formData.studentId}`);
      await set(studentRef, formData);
      toast.success('Student information saved successfully');
      setStudentId(formData.studentId); // Save student ID in global state
      // Redirect to profile attributes component
      setTimeout(() => {
        router.push('/profile_attributes');
      }, 2000); // Redirect after 2 seconds to allow the toast message to be shown
    } catch (error) {
      toast.error('Error saving student information');
      console.error('Error saving student information: ', error);
    }
  };

  return (
    <SmartBlankLayout>
      <div className="max-w-lg mx-auto mt-10 p-8 bg-white rounded-lg shadow-md">
        <h2 className="text-2xl font-bold mb-6">Student Information Form</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Student ID</label>
            <input
              type="text"
              name="studentId"
              value={formData.studentId}
              readOnly
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md bg-gray-100 cursor-not-allowed"
            />
          </div>
          <div className="mb-4">
            <input
              type="hidden"
              name="email"
              value={formData.email}
              readOnly
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md bg-gray-100 cursor-not-allowed"
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">School Name</label>
            <input
              type="text"
              name="schoolName"
              value={formData.schoolName}
              onChange={handleChange}
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Grade Level</label>
            <input
              type="text"
              name="gradeLevel"
              value={formData.gradeLevel}
              onChange={handleChange}
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Class Name</label>
            <input
              type="text"
              name="className"
              value={formData.className}
              onChange={handleChange}
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Graduation Year</label>
            <input
              type="text"
              name="graduationYear"
              value={formData.graduationYear}
              onChange={handleChange}
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600"
          >
            Submit
          </button>
        </form>
        <ToastContainer 
          position="bottom-center" 
          autoClose={5000} 
          hideProgressBar={false} 
          newestOnTop={false} 
          closeOnClick 
          rtl={true} 
          pauseOnFocusLoss 
          draggable 
          pauseOnHover 
          theme="dark"
        />
      </div>
    </SmartBlankLayout>
  );
};

export default StudentForm;

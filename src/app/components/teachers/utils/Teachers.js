import React, { useState, useEffect } from 'react';
import { ref, onValue } from 'firebase/database';
import { database } from '../../../../../utils/firebaseConfig';
import { FaSpinner } from 'react-icons/fa';

const Students = () => {
  const [students, setStudents] = useState([]);
  const [classes, setClasses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchStudentsAndClasses = async () => {
      try {
        const studentsRef = ref(database, 'students');
        const classesRef = ref(database, 'classes');

        // Fetch students data
        onValue(studentsRef, (snapshot) => {
          const studentsData = snapshot.val();
          if (studentsData) {
            const studentsArray = Object.keys(studentsData).map(key => ({
              id: key,
              ...studentsData[key] // Adjusting to fetch all data
            }));
            setStudents(studentsArray);
          } else {
            console.log('No students data found.');
          }
        });

        // Fetch classes data
        onValue(classesRef, (snapshot) => {
          const classesData = snapshot.val();
          if (classesData) {
            const classesArray = Object.keys(classesData).map(key => ({
              id: key,
              ...classesData[key] // Adjusting to fetch all data
            }));
            setClasses(classesArray);
          } else {
            console.log('No classes data found.');
          }
        });

      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchStudentsAndClasses();
  }, []);

  // Filter students based on matching studentClass and className, and studentId starts with "STID"
  const filteredStudents = students.filter(student => 
    student.studentId?.startsWith('STID') &&
    classes.some(cls => cls.className === student.studentClass)
  );

  if (isLoading) {
    return (
      <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-gray-200 bg-opacity-75 z-50">
        <FaSpinner className="animate-spin text-4xl text-gray-500" />
      </div>
    );
  }

  if (filteredStudents.length === 0) {
    return <div className="text-center mt-4">No students found.</div>;
  }

  return (
    <div className="w-full text-sm p-6 bg-white">
      <h2 className="text-xl font-semibold mb-4">My Students</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full text-left border-collapse">
          <thead>
            <tr>
              <th className="p-2 border-b">Student ID</th>
              <th className="p-2 border-b">Student Class</th>
              <th className="p-2 border-b">Student Level</th>
              <th className="p-2 border-b">Graduation Year</th>
              <th className="p-2 border-b">Email</th>
            </tr>
          </thead>
          <tbody>
            {filteredStudents.map(student => (
              <tr key={student.id}>
                <td className="p-2 border-b">{student.studentId || 'N/A'}</td>
                <td className="p-2 border-b">{student.studentClass || 'N/A'}</td>
                <td className="p-2 border-b capitalize">{student.gradeLevel || 'N/A'}</td>
                <td className="p-2 border-b">{student.graduationYear || 'N/A'}</td>
                <td className="p-2 border-b">{student.email || 'N/A'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Students;

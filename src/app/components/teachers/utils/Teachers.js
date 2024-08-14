import React, { useState, useEffect } from 'react';
import { ref, onValue } from 'firebase/database';
import { database } from '../../../../../utils/firebaseConfig';
import { FaSpinner } from 'react-icons/fa';

const Students = () => {
  const [students, setStudents] = useState([]);
  const [classes, setClasses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortColumn, setSortColumn] = useState('');
  const [sortOrder, setSortOrder] = useState('asc');

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
    classes.some(cls => cls.className === student.studentClass) &&
    (student.studentId.toLowerCase().includes(searchTerm.toLowerCase()) ||
     student.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
     student.studentClass.toLowerCase().includes(searchTerm.toLowerCase()) ||
     student.gradeLevel.toLowerCase().includes(searchTerm.toLowerCase()) ||
     student.graduationYear.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  // Sort students by selected column
  const sortedStudents = filteredStudents.sort((a, b) => {
    if (!sortColumn) return 0;
    const valA = a[sortColumn].toLowerCase();
    const valB = b[sortColumn].toLowerCase();
    if (valA < valB) return sortOrder === 'asc' ? -1 : 1;
    if (valA > valB) return sortOrder === 'asc' ? 1 : -1;
    return 0;
  });

  const handleSort = (column) => {
    const order = sortColumn === column && sortOrder === 'asc' ? 'desc' : 'asc';
    setSortColumn(column);
    setSortOrder(order);
  };

  if (isLoading) {
    return (
      <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-gray-200 bg-opacity-75 z-50">
        <FaSpinner className="animate-spin text-4xl text-gray-500" />
      </div>
    );
  }

  if (sortedStudents.length === 0) {
    return <div className="text-center mt-4">No students found.</div>;
  }

  return (
    <div className="w-full text-sm p-6 bg-white">
      <h2 className="text-xl font-semibold mb-4">My Students</h2>
      <input
        type="text"
        placeholder="Search by Student ID, Email, Class, Level, or Year"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="mb-4 p-2 border border-gray-300 rounded w-full"
      />
      <div className="overflow-x-auto">
        <table className="min-w-full text-left border-collapse">
          <thead>
            <tr>
              {['studentId', 'studentClass', 'gradeLevel', 'graduationYear', 'email'].map((column) => (
                <th
                  key={column}
                  className="p-2 border-b cursor-pointer text-blue-400 uppercase"
                  onClick={() => handleSort(column)}
                >
                  {column.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                  {sortColumn === column && (sortOrder === 'asc' ? ' ▲' : ' ▼')}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {sortedStudents.map(student => (
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

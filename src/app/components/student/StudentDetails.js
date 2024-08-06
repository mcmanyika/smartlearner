// components/student/StudentDetails.js
import React from 'react';

const StudentDetails = ({ studentData }) => {
  return (
    <div className="mb-4">
      <p><strong>Student ID:</strong> {studentData.studentId}</p>
      <p><strong>Email:</strong> {studentData.email}</p>
      <p><strong>Grade Level:</strong> {studentData.gradeLevel}</p>
      <p><strong>Class Name:</strong> {studentData.studentClass}</p>
      <p><strong>Graduation Year:</strong> {studentData.graduationYear}</p>
    </div>
  );
};

export default StudentDetails;

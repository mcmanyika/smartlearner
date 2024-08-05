// components/student/StudentDetails.js
import React from 'react';

const StudentDetails = ({ studentData }) => {
  return (
    <div className="mb-4">
      <h2 className="text-xl font-bold">Student Details</h2>
      <p><strong>Student ID:</strong> {studentData.studentId}</p>
      <p><strong>Email:</strong> {studentData.email}</p>
      <p><strong>School Name:</strong> {studentData.schoolName}</p>
      <p><strong>Grade Level:</strong> {studentData.gradeLevel}</p>
      <p><strong>Class Name:</strong> {studentData.className}</p>
      <p><strong>Graduation Year:</strong> {studentData.graduationYear}</p>
    </div>
  );
};

export default StudentDetails;

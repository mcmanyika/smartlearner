import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import withAuth from '../../utils/withAuth';
import AdminLayout from './admin/adminLayout';
import { FaSpinner } from 'react-icons/fa'; // Import FaSpinner
import NoticeCount from '../app/components/notice/NoticeCount';
import ClassRoutine from '../app/components/student/ClassRoutine';
import { database } from '../../utils/firebaseConfig'; // Adjust the path as necessary
import { ref, get } from 'firebase/database';
import StudentDetails from '../app/components/student/StudentDetails'; // Import the new component
import { useRouter } from 'next/router'; // Import useRouter

const StudentDash = () => {
  const { data: session, status } = useSession(); // Get session and status
  const [loading, setLoading] = useState(true);
  const [studentData, setStudentData] = useState(null);
  const router = useRouter(); // Initialize useRouter

  useEffect(() => {
    if (status === 'loading') {
      // Wait until the session status is determined
      return;
    }

    if (session) {
      fetchStudentData(session.user.email);
    }
  }, [session, status]);

  const fetchStudentData = async (email) => {
    try {
      // Reference to 'students' node
      const studentRef = ref(database, 'students');
      const studentSnapshot = await get(studentRef);

      if (studentSnapshot.exists()) {
        const allStudentData = studentSnapshot.val();
        // Find student record where email matches
        const studentEntries = Object.entries(allStudentData);
        const matchedStudent = studentEntries.find(([id, student]) => student.email === email);

        if (matchedStudent) {
          const [studentId, studentInfo] = matchedStudent;
          setStudentData(studentInfo);
        } else {
          // Redirect to student_form if no student data is found
          router.push('/student_form');
        }
      } else {
        console.log('No student data found.');
        router.push('/student_form');
      }

      setLoading(false);
    } catch (error) {
      console.error('Error fetching student data: ', error);
      setLoading(false);
    }
  };

  return (
    <AdminLayout>
      <div className="flex flex-col md:flex-row">
        <div className="w-full">
          {loading ? (
            <div className="flex items-center justify-center h-32">
              <FaSpinner className="animate-spin text-blue-500 text-3xl" />
            </div>
          ) : (
            <>
              <NoticeCount />
              <div className="w-full flex flex-col md:flex-row mt-4">
                <div className="w-1/3 bg-white border shadow-sm rounded p-5 m-2 mt-0 ml-0">
                  {studentData ? (
                    <StudentDetails studentData={studentData} /> // Use the new component
                  ) : (
                    <div className="flex items-center justify-center h-32">
                      <p>No student data found.</p>
                    </div>
                  )}
                </div>
                <div className="w-2/3 bg-white border shadow-sm rounded m-2 mt-0 ml-0">
                  <ClassRoutine />
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </AdminLayout>
  );
};

export default withAuth(StudentDash);

import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useSession, getSession } from 'next-auth/react';
import withAuth from '../../utils/withAuth';
import AdminLayout from './admin/adminLayout';
import fetchUserType from '../../utils/fetchUserType';
import StudentProfileDisplay from '../app/components/user/utils/StudentProfileDisplay';
import { FaSpinner } from 'react-icons/fa'; // Import FaSpinner
import NoticeCount from '../app/components/notice/NoticeCount';
import Teachers from '../app/components/teachers/utils/Teachers'

const TeacherDashboard = () => {
  const { data: session } = useSession();
  const [loading, setLoading] = useState(true);
  const router = useRouter();

 
  return (
    <AdminLayout>
      <div className="flex flex-col md:flex-row">
        <div className="w-full ">
          <NoticeCount />
          <div className="w-full flex flex-col md:flex-row mt-4">
            <div className="w-full bg-white border shadow-sm rounded m-2 mt-0 ml-0">
              <Teachers />
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default withAuth(TeacherDashboard);

export async function getServerSideProps(context) {
  const session = await getSession(context);

  return {
    props: {
      session
    }
  };
}

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { FaBars, FaSpinner } from 'react-icons/fa';
import '../../app/globals.css';
import { database } from '../../../utils/firebaseConfig';
import { ref, onValue } from 'firebase/database';
import {
  FaTachometerAlt,
  FaPencilRuler,
  FaCalendarAlt,
  FaClipboardList,
  FaUserGraduate,
} from 'react-icons/fa';
import { MdOutlineLibraryBooks } from 'react-icons/md';
import { LiaChalkboardTeacherSolid } from 'react-icons/lia';
import { IoPeopleOutline } from 'react-icons/io5';
import { RiAdminFill } from 'react-icons/ri';

const iconMapping = {
  FaTachometerAlt: FaTachometerAlt,
  FaPencilRuler: FaPencilRuler,
  FaCalendarAlt: FaCalendarAlt,
  FaClipboardList: FaClipboardList,
  FaUserGraduate: FaUserGraduate,
  MdOutlineLibraryBooks: MdOutlineLibraryBooks,
  LiaChalkboardTeacherSolid: LiaChalkboardTeacherSolid,
  IoPeopleOutline: IoPeopleOutline,
  RiAdminFill: RiAdminFill,
};

const AdminLayout = ({ children }) => {
  const { data: session } = useSession();
  const [isExpanded, setIsExpanded] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [titles, setTitles] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch titles from the database
  useEffect(() => {
    const fetchTitles = async () => {
      try {
        const titleRef = ref(database, 'title');

        onValue(titleRef, (snapshot) => {
          const data = snapshot.val();
          if (data) {
            const titlesArray = Object.keys(data)
              .map((key) => ({
                id: key,
                title: data[key].title,
                link: data[key].link || '#',
                status: data[key].status,
                category: data[key].category,
                icon: data[key].icon || 'FaTachometerAlt',
              }))
              .filter((title) => 
                title.status === 'Active' && 
                title.title !== 'Add School'
              );
            setTitles(titlesArray);
          } else {
            console.warn('No titles found in Firebase.');
            setTitles([]);
          }
          setIsLoading(false);
        });
      } catch (error) {
        console.error('Error fetching titles from Firebase:', error);
        setIsLoading(false);
      }
    };

    fetchTitles();
  }, []);

  const toggleSidebar = () => {
    setIsExpanded(!isExpanded);
  };

  const toggleMobileSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="flex min-h-screen text-base bg-white relative">
      {/* Sidebar */}
      <aside
        className={`fixed z-40 transform ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } transition-transform duration-300 md:relative md:translate-x-0 ${
          isExpanded ? 'w-72' : 'w-16'
        } bg-blue-400 text-white p-4 min-h-screen`}
      >
        <div className="flex justify-between items-center mb-6">
          {isExpanded && <h2 className="text-lg font-thin">School Finder</h2>}
          <FaBars className="cursor-pointer text-2xl" onClick={toggleSidebar} />
        </div>
        <nav>
          {isLoading ? (
            <div className="flex items-center justify-center h-32">
              <FaSpinner className="animate-spin text-blue-500 text-3xl" />
            </div>
          ) : (
            <ul>
              {titles.length > 0 &&
                titles.map((rw) => {
                  const IconComponent = iconMapping[rw.icon];
                  return (
                    <li key={rw.id} className="mb-4 flex items-center">
                      <Link href={rw.link} className="flex items-center">
                        <IconComponent className="mr-2 text-2xl" />
                        {isExpanded && (
                          <div className="block p-2 rounded cursor-pointer">
                            {rw.title}
                          </div>
                        )}
                      </Link>
                    </li>
                  );
                })}
            </ul>
          )}
        </nav>
      </aside>

      {/* Overlay for Mobile Sidebar */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black opacity-50 z-30 md:hidden"
          onClick={toggleMobileSidebar}
        ></div>
      )}

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col transition-all duration-300 ease-in-out">
        <header className="flex items-center justify-between bg-blue-400 text-white p-4 md:hidden">
          <div className="flex items-center">
            <FaBars className="cursor-pointer text-2xl mr-4" onClick={toggleMobileSidebar} />
            <h1 className="text-lg">Smart Learner</h1>
          </div>
        </header>
        <main className="flex-1">{children}</main>
      </div>
    </div>
  );
};

export default AdminLayout;

import { ref, onValue, query, orderByChild, equalTo } from 'firebase/database';
import { database } from '../../../../utils/firebaseConfig';
import {
  FaTachometerAlt,
  FaPencilRuler,
  FaCalendarAlt,
  FaClipboardList,
  FaUserGraduate
} from 'react-icons/fa';
import { MdOutlineLibraryBooks } from 'react-icons/md';
import { LiaChalkboardTeacherSolid } from 'react-icons/lia';
import { IoPeopleOutline } from 'react-icons/io5';
import { RiAdminFill } from 'react-icons/ri';

// Map icons to their components
export const iconMapping = {
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

// Fetch user type and set state
export const fetchUserType = async (email, setUserType) => {
  const userRef = ref(database, `userTypes/${email.replace('.', '_')}`);
  onValue(userRef, (snapshot) => {
    const data = snapshot.val();
    setUserType(data);
  }, {
    onlyOnce: true // Retrieve the value only once to avoid continuous updates
  });
};

// Fetch titles and set state based on user type
export const fetchTitles = async (userType, setTitles) => {
  try {
    const titleRef = ref(database, 'title');
    const statusQuery = query(titleRef, orderByChild('status'), equalTo('Active'));

    onValue(statusQuery, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const titlesArray = Object.keys(data)
          .map((key) => ({
            id: key,
            title: data[key].title,
            link: data[key].link,
            status: data[key].status,
            category: data[key].category,
            icon: data[key].icon,
          }))
          .filter(a => a.category === 'dashboard' && a.status === 'Active');

        // Filter out specific titles if userType is 'student'
        const filteredTitles = titlesArray.filter(title => !(userType === 'student' && ['Teachers', 'Class Routine', 'Notice'].includes(title.title)));
        setTitles(filteredTitles);
      } else {
        setTitles([]);
      }
    }, {
      onlyOnce: true // Retrieve the value only once to avoid continuous updates
    });
  } catch (error) {
    console.error('Firebase Error:', error);
    setTitles([]); // Clear titles on error
  }
};

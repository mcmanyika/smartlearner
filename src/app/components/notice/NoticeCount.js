import React, { useState, useEffect } from 'react';
import { ref, onValue } from 'firebase/database';
import { database } from '../../../../utils/firebaseConfig';
import { MdOutlineLibraryBooks } from "react-icons/md";
import { FaCalendarAlt, FaClipboardList } from 'react-icons/fa';
import { useGlobalState } from '../../store';

const NoticeCount = () => {
  const [totalNotices, setTotalNotices] = useState(0);
  const [totalEvents, setTotalEvents] = useState(0);
  const [routineCount] = useGlobalState('routineCount');

  useEffect(() => {
    const noticesRef = ref(database, 'notices');
    const eventsRef = ref(database, 'events');

    const currentDate = new Date();

    const unsubscribeNotices = onValue(noticesRef, (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.val();
        const noticesArray = Object.keys(data).map((key) => ({
          id: key,
          ...data[key],
        }));

        const validNotices = noticesArray.filter(notice => {
          const noticeDate = new Date(notice.date);
          return noticeDate >= currentDate;
        });

        setTotalNotices(validNotices.length);
      } else {
        setTotalNotices(0);
      }
    }, (error) => {
      console.error(`Error fetching notices: ${error.message}`);
    });

    const unsubscribeEvents = onValue(eventsRef, (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.val();
        const eventsArray = Object.keys(data).map((key) => ({
          id: key,
          ...data[key],
        }));

        const validEvents = eventsArray.filter(event => {
          const eventDate = new Date(event.date);
          return eventDate >= currentDate;
        });

        setTotalEvents(validEvents.length);
      } else {
        setTotalEvents(0);
      }
    }, (error) => {
      console.error(`Error fetching events: ${error.message}`);
    });

    return () => {
      unsubscribeNotices();
      unsubscribeEvents();
    };
  }, []);

  return (
    <div className="w-full flex flex-col sm:flex-row text-center">
      <div className="w-full sm:w-1/3 flex bg-white border shadow-sm rounded m-2">
        <div className='w-1/3 flex items-center justify-center p-2'>
          <MdOutlineLibraryBooks className='w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-blue-300 text-white p-2' />
        </div>
        <div className="w-2/3 text-xs sm:text-sm p-2 sm:p-4 text-right">
          Notifications <br />{totalNotices}
        </div>
      </div>
      <div className="w-full sm:w-1/3 flex bg-white border shadow-sm rounded m-2">
        <div className='w-1/3 flex items-center justify-center p-2'>
          <FaCalendarAlt className='w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-orange-300 text-white p-2' />
        </div>
        <div className="w-2/3 text-xs sm:text-sm p-2 sm:p-4 text-right">
          Events <br />{totalEvents}
        </div>
      </div>
      <div className="w-full sm:w-1/3 flex bg-white border shadow-sm rounded m-2">
        <div className='w-1/3 flex items-center justify-center p-2'>
          <FaClipboardList className='w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-purple-300 text-white p-2' />
        </div>
        <div className="w-2/3 text-xs sm:text-sm p-2 sm:p-4 text-right">
          Upcoming Classes <br />{routineCount}
        </div>
      </div>
    </div>
  );
};

export default NoticeCount;

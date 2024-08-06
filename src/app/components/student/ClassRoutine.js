import React, { useEffect, useState } from 'react';
import { ref, onValue } from 'firebase/database';
import { database } from '../../../../utils/firebaseConfig';
import { useGlobalState } from '../../store';

const ClassRoutine = () => {
  const [routine, setRoutine] = useState([]);
  const [studentClass] = useGlobalState('studentClass');
  const [, setRoutineCount] = useGlobalState('routineCount');

  useEffect(() => {
    console.log('Fetching routines for studentClass:', studentClass); // Debug log

    const routineRef = ref(database, 'classRoutine');
    const handleData = (snapshot) => {
      const data = snapshot.val();
      console.log('Fetched data:', data); // Debug log

      if (data) {
        const currentDate = new Date();
        const filteredRoutine = Object.keys(data)
          .map(key => ({
            id: key,
            ...data[key]
          }))
          .filter(entry => {
            console.log('Evaluating entry:', entry); // Debug log
            return entry.studentclass === studentClass && new Date(entry.date) > currentDate;
          });

        console.log('Filtered routine:', filteredRoutine); // Debug log
        setRoutine(filteredRoutine);
        setRoutineCount(filteredRoutine.length);
      }
    };

    onValue(routineRef, handleData, {
      onlyOnce: true
    });

  }, [studentClass, setRoutineCount]);

  const getDayOfWeek = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { weekday: 'long' });
  };

  return (
    <div className="w-full text-sm p-6">
      <h2 className="text-xl font-semibold mb-4">Class Routine</h2>
      {routine.length === 0 ? (
        <p className="text-center">There are no upcoming classes assigned yet.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full text-left border-collapse">
            <thead>
              <tr className='uppercase'>
                <th className="p-2 border-b">Day</th>
                <th className="p-2 border-b">Time</th>
                <th className="p-2 border-b">Subject</th>
                <th className="p-2 border-b">Teacher</th>
                <th className="p-2 border-b">Date</th>
                <th className="p-2 border-b">Room</th>
              </tr>
            </thead>
            <tbody>
              {routine.map((entry) => (
                <tr key={entry.id}>
                  <td className="p-2 border-b">{getDayOfWeek(entry.date)}</td>
                  <td className="p-2 border-b">{entry.time}</td>
                  <td className="p-2 border-b">{entry.subject}</td>
                  <td className="p-2 border-b">{entry.teacher}</td>
                  <td className="p-2 border-b">{entry.date}</td>
                  <td className="p-2 border-b">{entry.room}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default ClassRoutine;

import { createGlobalState } from 'react-hooks-global-state';

const initialState = {
  isOverlayVisible: false,
  user: null,
  studentClass: '',
  userType: '',
  studentId: '',
  routineCount: 0
};

const { useGlobalState, getGlobalState, setGlobalState } = createGlobalState(initialState);

const setUser = (user) => setGlobalState('user', user);
const setStudentClass = (studentClass) => setGlobalState('studentClass', studentClass);
const setStudentId = (studentId) => setGlobalState('studentId', studentId);
const setUserType = (userType) => setGlobalState('userType', userType);
const setRoutineCount = (routineCount) => setGlobalState('routineCount', routineCount);
const setIsOverlayVisible = (isOverlayVisible) => setGlobalState('isOverlayVisible', isOverlayVisible);

export { useGlobalState, 
        getGlobalState, 
        setUser,
        setStudentClass,
        setUserType,
        setStudentId,
        setRoutineCount,
        setIsOverlayVisible };

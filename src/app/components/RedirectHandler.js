// components/RedirectHandler.js

import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { useGlobalState } from '../../app/store';
import { FaSpinner } from 'react-icons/fa';

const RedirectHandler = ({ children }) => {
  const router = useRouter();
  const [userType] = useGlobalState('userType');
  const [isLoading, setIsLoading] = React.useState(true);

  useEffect(() => {
    if (userType === 'teacher') {
      router.push('/teachers_dashboard');
    } else {
      setIsLoading(false);
    }
  }, [userType, router]);

  if (isLoading) {
    return <div className="flex items-center justify-center h-screen"><FaSpinner className="animate-spin text-blue-500 text-3xl" /></div>;
  }

  return children;
};

export default RedirectHandler;

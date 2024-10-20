import React, { useEffect } from 'react';
import { signIn,  useSession } from 'next-auth/react';
import Image from 'next/image';
import Alumni from './libs/Alumni';
import Hero from '../components/Hero'

const Dashboard = () => {
  const { data: session } = useSession();

  useEffect(() => {
    if (session) {
      // Redirect to student dashboard if session exists
      window.location.href = '/admin/dashboard';
    }
  }, [session]);

 
  return (<>
    {!session && (
        <>
        <Alumni />
        <Hero />
    </>
    )}
    </>
  );
};

export default Dashboard;

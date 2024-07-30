import React, { useEffect, useState } from 'react';
import { signIn, signOut, useSession } from 'next-auth/react';
import Link from 'next/link';
import { FaSpinner } from 'react-icons/fa'; // Import FaSpinner

const Dashboard = () => {
  const { data: session } = useSession();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (session?.user?.email) {
      // Additional logic can be added here if necessary
      setLoading(false);
    } else {
      setLoading(false);
    }
  }, [session]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <FaSpinner className="animate-spin text-blue-400 text-4xl" />
      </div>
    );
  }
  return (
    <section className="flex flex-col md:flex-row items-center justify-center text-center h-screen">
      <div className="flex-1 bg-slate-400 w-full h-full">&nbsp;</div>
      <div className="flex-1 p-8">
        <h1 className="text-5xl font-bold uppercase mb-4">Smart Learner</h1>
        <p className="text-lg capitalize mb-8">Powering schools to future of learning.</p>
        <div className="p-10">
          {session ? (
            <div className="relative">
              <span className="ml-4">
               <Link href='/dashboard'> Hi {session.user.name}</Link>
              </span>
              <button
                onClick={() => signOut()}
                className="ml-4 text-white bg-red-500 p-2 rounded-md hover:bg-red-600"
              >
                Sign Out
              </button>
            </div>
          ) : (
            <button
              onClick={() => signIn('google')}
              className="ml-4 text-white bg-blue-500 p-2 rounded-md hover:bg-blue-600 uppercase"
            >
              Sign In
            </button>
          )}
        </div>
      </div>
    </section>
  );
};

export default Dashboard;

import React, { useEffect } from 'react';
import { signIn,  useSession } from 'next-auth/react';

const Dashboard = () => {
  const { data: session } = useSession();

  useEffect(() => {
    if (session) {
      // Redirect to student dashboard if session exists
      window.location.href = '/student_dash';
    }
  }, [session]);

 
  return (<>
    {!session && (
    <section className="flex flex-col md:flex-row items-center justify-center text-center h-screen">
      <div className="flex-1 bg-slate-400 w-full h-full">&nbsp;</div>
      <div className="flex-1 p-8">
        <h1 className="text-5xl font-bold uppercase mb-4">Smart Learner</h1>
        <p className="text-lg capitalize mb-8">Powering schools to future of learning.</p>
        <div className="p-10">
            <button
              onClick={() => signIn('google')}
              className="ml-4 text-white bg-blue-500 p-2 rounded-md hover:bg-blue-600 uppercase"
            >
              Sign In
            </button>
         
        </div>
      </div>
    </section>
    )}
    </>
  );
};

export default Dashboard;

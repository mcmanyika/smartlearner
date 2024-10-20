import React, { useEffect } from 'react';
import { signIn, useSession } from 'next-auth/react';
import Hero from '../components/Hero';

const Dashboard = () => {
  const { data: session } = useSession();

  useEffect(() => {
    if (session) {
      // Redirect to student dashboard if session exists
      window.location.href = '/admin/dashboard';
    }
  }, [session]);

  return (
    <>
      {!session && (
        <section className="flex flex-col md:flex-row items-center justify-center text-center h-screen relative">
          <div className="flex-1 w-full h-full">
            <Hero />
          </div>
          <div className="flex-1 p-8 flex flex-col justify-between">
            <div className=''>
              <div className='w-full pt-96'>
                <h1 className="text-5xl font-bold uppercase mb-4">Smart Learner</h1>
                <p className="text-lg capitalize mb-8">Powering schools to future of learning.</p>
              </div>
              <div className='w-full pt-16'>
                {/* Claim Site placed at the bottom */}
                <div className="flex text-xs pt-96">
                  <div className="mt-auto w-36">Claim your school</div>
                  <div className="mt-auto w-36">Get in touch</div>
                  <div className="mt-auto w-36">Privacy policy</div>
                </div>
              </div>
            </div>
          </div>
          {/* Sign In Button Positioned at the Top Right */}
          <button
            onClick={() => signIn('google')}
            className="absolute top-4 right-4 text-white text-sm bg-gray-400 p-2 rounded-full hover:bg-blue-600 uppercase"
          >
            Sign In
          </button>
        </section>
      )}
    </>
  );
};

export default Dashboard;

import React, { useEffect, useState } from 'react';
import { signIn, useSession } from 'next-auth/react';
import Hero from '../components/Hero';
import ContactUs from '../components/libs/ContactUs'
import AddSchool from '../components/libs/AddSchool'

const Dashboard = () => {
  const { data: session } = useSession();
  const [content, setContent] = useState('home'); // Tracks which content to show

  useEffect(() => {
    if (session) {
      // Redirect to student dashboard if session exists
      window.location.href = '/admin/dashboard';
    }
  }, [session]);

  const handleButtonClick = (type) => {
    setContent(type); // Update the state based on which button is clicked
  };
  const schoolsClick = (type) => {
    window.location.href = '/libs/schools';
  };

  return (
    <>
      {!session && (
        <section className="flex flex-col md:flex-row items-center justify-center text-center min-h-screen relative">
          <div className="hidden md:block flex-1 w-full h-full">
            {/* Hide Hero component on mobile and show on medium screens and above */}
            <Hero />
          </div>
          <div id="content" className="flex-1  flex flex-col justify-between">
            <div className='w-full'>
              {/* Conditionally render the home or blank div */}
              {content === 'home' && (
                <div id="home" className="w-full">
                  <h1 className="text-2xl md:text-5xl font-bold uppercase mb-4">Smart Learner</h1>
                  <p className="text-lg capitalize mb-8">Powering schools to future of learning.</p>
                </div>
              )}

              {content === 'claim' && (
                <div id="claim" className="w-full">
                  <AddSchool />
                </div>
              )}

              {/* Display get in touch section if 'getintouch' is clicked */}
              {content === 'getintouch' && (
                <div id="getintouch" className="w-full">
                  <h1 className="text-4xl p-4">Get in touch</h1>
                  <ContactUs />
                </div>
              )}

              {/* Display buy us coffee section if 'coffee' is clicked */}
              {content === 'coffee' && (
                <div id="coffee" className="w-full">
                  <h1 className="text-4xl">Buy us coffee</h1>
                  <p className="text-lg">This is the buy us coffee section.</p>
                </div>
              )}
            </div>
          </div>

          {/* Footer Links */}
          <div className="fixed bottom-0 left-0 w-full bg-transparent p-4">
            <div className="md:flex justify-around text-xs">
              <div className='w-full md:flex-1'></div>
              {/* Menu Icon for Home */}
              <div className='w-full md:flex-1'>
                <div className='flex'>
                <div className=''>
                  <button
                    className="flex items-center justify-center"
                    onClick={() => handleButtonClick('home')}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth="2"
                      stroke="currentColor"
                      className="w-6 h-6"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M4 6h16M4 12h16M4 18h16"
                      />
                    </svg>
                  </button>
              </div>
               <div className='w-36 pt-1'><button onClick={() => handleButtonClick('getintouch')}>Claim your school</button></div>
              <div className='w-36 pt-1'>
                <button onClick={() => schoolsClick('schools')}>Schools</button>
              </div>
              <div className='w-36 pt-1'>
              <button onClick={() => handleButtonClick('getintouch')}>Get in touch</button></div>
              {/* <div className='w-36 pt-1'>
                <button onClick={() => handleButtonClick('claim')}>Add School</button>
              </div> */}
              </div>
              </div>
            </div>
          </div>
        </section>
      )}
    </>
  );
};

export default Dashboard;

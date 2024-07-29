import React from 'react';
import { signIn, signOut } from 'next-auth/react';

const Placeholder = ({ session }) => {
  return (
    <section className="flex items-center justify-center text-center">
      <div className='flex-1 bg-slate-400 h-screen '>&nbsp;</div>
      <div className='flex-1'>
        <h1 className="text-5xl font-bold uppercase">Smart Learner</h1>
        <p className="text-lg capitalize">Powering schools to greater hights.</p>
        <div className='p-10'>
          {session ? (
            <div className="relative">
              <span className="ml-4">
                Hi {session.user.name}
              </span>
              <button onClick={() => signOut()} className="ml-4 text-white bg-red-500 p-2 rounded-md hover:bg-red-600">
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

export default Placeholder;

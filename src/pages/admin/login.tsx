'use client';
import { signIn } from 'next-auth/react';
import { useState } from 'react';
import { FaGoogle, FaSpinner } from 'react-icons/fa';
import Image from 'next/image';
import '../../app/globals.css';
import SmartLayout from '../../app/components/SmartLayout';
export default function Login() {
  const [loading, setLoading] = useState(false);

  const handleSignIn = async () => {
    setLoading(true);
    try {
      await signIn('google');
    } catch (error) {
      console.error('Error signing in:', error);
      setLoading(false);
    }
  };

  return (
    <SmartLayout>
      
    <div className="min-h-screen relative">
     

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen p-4">
        <div className="w-full max-w-md">
          {/* Card */}
          <div className="bg-white rounded-2xl shadow-2xl p-8 transform transition-all hover:scale-105">
            {/* Logo */}
            <div className="flex justify-center mb-8">
              <Image
                src=""
                alt=""
                width={100}
                height={100}
                className="rounded-full shadow-lg"
              />
            </div>

            {/* Header */}
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-gray-800 mb-2">
                Welcome Back
              </h1>
              <p className="text-gray-600">
                Sign in to access your admin dashboard
              </p>
            </div>

            {/* Sign In Button */}
            <button
              onClick={handleSignIn}
              disabled={loading}
              className="w-full bg-blue-600 text-white rounded-lg py-3 px-4 
                         flex items-center justify-center space-x-3
                         hover:bg-blue-700 transform transition-all
                         hover:shadow-lg disabled:opacity-50
                         disabled:cursor-not-allowed"
            >
              {loading ? (
                <FaSpinner className="animate-spin text-xl" />
              ) : (
                <>
                  <FaGoogle className="text-xl" />
                  <span>Sign in with Google</span>
                </>
              )}
            </button>

            {/* Additional Info */}
            <div className="mt-6 text-center text-sm text-gray-600">
              <p>Only authorized personnel can access the admin dashboard</p>
              <div className="mt-4 text-xs">
                <a href="#" className="text-blue-600 hover:underline">
                  Need help?
                </a>
                {' • '}
                <a href="#" className="text-blue-600 hover:underline">
                  Privacy Policy
                </a>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="text-center mt-8 text-white text-sm">
            <p>© 2024 School Management System. All rights reserved.</p>
          </div>
        </div>
      </div>
    </div>

    </SmartLayout>
  );
}

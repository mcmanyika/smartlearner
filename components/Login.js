"use client";

import { auth, googleProvider } from '../utils/firebaseConfig';
import { signInWithPopup } from 'firebase/auth';
import { useRouter } from 'next/navigation';

export default function Login() {
  const router = useRouter();

  const handleGoogleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      // Optional: Save additional user data to your database
      router.push('/dashboard'); // Redirect after successful login
    } catch (error) {
      console.error('Error signing in with Google:', error);
    }
  };

  return (
    <button
      onClick={handleGoogleLogin}
      className="flex items-center justify-center gap-2 px-4 py-2 bg-white text-gray-700 rounded-lg border hover:bg-gray-50 transition-colors"
    >
      <img 
        src="https://www.google.com/favicon.ico" 
        alt="Google" 
        className="w-5 h-5"
      />
      Sign in with Google
    </button>
  );
} 
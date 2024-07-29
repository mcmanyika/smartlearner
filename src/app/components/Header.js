import { FaFacebook, FaInstagram } from 'react-icons/fa';
import Link from 'next/link';
import { signIn, signOut } from 'next-auth/react';

const Header = ({ session }) => {
  return (
    <header className="fixed top-0 z-50 w-full bg-main text-white">
      <div className="container mx-auto flex justify-between items-center p-4">
        <div className="flex items-center">
          <Link href="/">
            <div className="text-white text-xl font-bold">Home</div>
          </Link>
        </div>
        <div className="flex items-center">
          <FaFacebook className="text-2xl mr-2" />
          <FaInstagram className="text-2xl" />
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
              className="ml-4 text-white bg-blue-500 p-2 rounded-md hover:bg-blue-600"
            >
              Sign In
            </button>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;

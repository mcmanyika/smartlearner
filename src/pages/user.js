import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import UserTypeSelector from '../app/components/user/UserType'; // Adjust the path to your UserTypeSelector component
import SmartLayout from '../app/components/SmartLayout';
import withAuth from '../../utils/withAuth';

const User = () => {
  const { data: session } = useSession();
  const [userEmail, setUserEmail] = useState('');

  useEffect(() => {
    if (session && session.user) {
      setUserEmail(session.user.email);
    }
  }, [session]);

  return (
    <SmartLayout>
    <div className="max-w-2xl mx-auto p-4">
      {userEmail && <UserTypeSelector userEmail={userEmail} />}
    </div>
    </SmartLayout>
  );
};

export default withAuth(User);

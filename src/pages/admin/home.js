import { useAuth } from '../../../contexts/AuthContext';
import Login from '../../../components/Login';
export default function YourComponent() {
  const { user } = useAuth();

  return (
    <div>
      {user ? (
        <div>
          <img src={user.photoURL} alt={user.displayName} />
          <p>Welcome, {user.displayName}!</p>
          <p>Email: {user.email}</p>
        </div>
      ) : (
        <p><Login /></p>
      )}
    </div>
  );
}

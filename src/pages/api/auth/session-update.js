import { getSession, updateSession } from 'next-auth/react';
import { getAuth } from 'firebase/auth';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).end(); // Method Not Allowed
    return;
  }

  const session = await getSession({ req });
  if (!session) {
    res.status(401).json({ message: 'Not authenticated' });
    return;
  }

  const { studentId } = req.body;

  try {
    const auth = getAuth();
    const user = auth.currentUser;

    if (user) {
      // Add custom claims to the user in Firebase
      await user.updateProfile({ studentId });

      // Update the session in Next.js
      await updateSession({ studentId });

      res.status(200).json({ message: 'Session updated successfully' });
    } else {
      res.status(401).json({ message: 'User not authenticated' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error updating session', error: error.message });
  }
}

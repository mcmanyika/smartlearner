'use client';

import { useSession } from 'next-auth/react';
import Layout from "./components/Layout";
import Dashboard from '../app/components/Dashboard';

export default function Home() {
  const { data: session } = useSession();

  return (
    <Layout session={session}>
      <Dashboard />
    </Layout>
  );
}

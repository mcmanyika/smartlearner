'use client';

import { useSession } from 'next-auth/react';
import Layout from "./components/Layout";
// import Dashboard from '../app/components/Dash2';
import Dashboard from '../app/components/Dashboard';
import Alumni from '../app/components/libs/Alumni'

export default function Home() {
  const { data: session } = useSession();

  return (
    <Layout session={session}>
      <Dashboard />
    </Layout>
  );
}

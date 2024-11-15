'use client';

import { useSession } from 'next-auth/react';
import Layout from "./components/Layout";
// import Dashboard from '../app/components/Dash2';
import Dashboard from '../app/components/Dashboard';
import Home from '../app/components/Home'

export default function Index() {
  const { data: session } = useSession();

  return (
    <Layout session={session}>
      <Home />
      {/* <Dashboard /> */}
    </Layout>
  );
}

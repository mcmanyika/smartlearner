'use client';

import { useSession } from 'next-auth/react';
import Layout from "./components/Layout";
import Home from '../app/components/Home'

export default function Index() {
  const { data: session } = useSession();

  return (
    <Layout session={session}>
      <Home />
    </Layout>
  );
}

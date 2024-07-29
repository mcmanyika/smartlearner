'use client';

import { useSession } from 'next-auth/react';
import Layout from "./components/Layout";
import Placeholder from '../app/components/Placeholder';

export default function Home() {
  const { data: session } = useSession();

  return (
    <Layout session={session}>
      <Placeholder />
    </Layout>
  );
}

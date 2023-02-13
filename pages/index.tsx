import useSWR from 'swr';
import { useSession } from 'next-auth/react';

export default function Index() {
  const { data: session } = useSession();

  if (!session) return <div>Loading...</div>;

  return <div>Hej {session.user.name}!</div>;
}

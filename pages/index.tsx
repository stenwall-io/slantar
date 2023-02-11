import useSWR from 'swr';
import { useSession } from 'next-auth/react';
import LogOutButton from '@components/logoutbutton/logoutbutton';
import { Session } from 'next-auth';

export default function Index() {
  const { data, error, isLoading } = useSWR('/api/recipes');
  const { data: session } = useSession();

  const recipes = data;

  if (error) return <div>Failed to load</div>;
  if (isLoading) return <div>Loading...</div>;

  return (
    <div>
      <LogOutButton />
      Hej {session.user.name}
    </div>
  );
}

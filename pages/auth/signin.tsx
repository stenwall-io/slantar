import type {
  GetServerSidePropsContext,
  InferGetServerSidePropsType,
} from 'next';
import { getCsrfToken } from 'next-auth/react';

export default function SignIn({
  csrfToken,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  return (
    <form method="post" action="/api/auth/callback/credentials">
      <input name="csrfToken" type="hidden" defaultValue={csrfToken} />
      <label>
        Användarnamn
        <input name="username" type="text" />
      </label>
      <label>
        Lösenord
        <input name="password" type="password" />
      </label>
      <button type="submit">Logga in</button>
    </form>
  );
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
  return {
    props: {
      csrfToken: await getCsrfToken(context),
    },
  };
}

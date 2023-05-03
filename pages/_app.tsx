import Head from 'next/head';
import type { AppProps } from 'next/app';
import Link from 'next/link';
import { SWRConfig } from 'swr';
import { SessionProvider } from 'next-auth/react';
import LogOutButton from '@components/logoutbutton/logoutbutton';
import { fetcher } from 'util/graphQLFetcher';
import { Account } from 'types/gql';
import { GraphQLQuery } from 'hooks/useGraphQL';
import 'styles/globals.css'

const MyApp = ({
  Component,
  pageProps: { session, ...pageProps },
}: AppProps) => {
  const { data:accountsData } = GraphQLQuery('{ accounts{ id name }}');
  // const getLayout = Component.getLayout || ((page: ReactNode) => page);

  // useEffect(() => {
  //   // remove the server-side injected CSS
  //   const jssStyles = document.querySelector('#jss-server-side');
  //   if (jssStyles) {
  //     jssStyles?.parentElement?.removeChild(jssStyles);
  //   }
  // }, []);

  return (
    <>
      <Head>
        <title>Slantar</title>
        <meta
          name="viewport"
          content="minimum-scale=1, initial-scale=1, width=device-width"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <SWRConfig
        value={{
          // refreshInterval: 3000,
          shouldRetryOnError: true,
          fetcher,
        }}
      >
        {/* {getLayout(<Component {...pageProps} />)} */}
        <SessionProvider session={session}>
          <div>
          <Link href="/">hem</Link> <Link href="/account/import">import</Link> <Link href="/month">månad</Link>
          {accountsData && (
            accountsData.accounts.map((a:Account) => (
              <>
              &nbsp;<Link key={a.id} href={{ pathname: '/account/[accountId]', query: { accountId: a.id } }}>{a.name}</Link>
              </> 
            ))
          )

          }
          <LogOutButton />
          </div>
          <Component {...pageProps} />
        </SessionProvider>
      </SWRConfig>
    </>
  );
};

export default MyApp;

// import '../styles/styles.scss';
import { ReactNode, useEffect } from 'react';
import Head from 'next/head';
import type { AppProps } from 'next/app';
import Link from 'next/link';
import { SWRConfig } from 'swr';
import { SessionProvider } from 'next-auth/react';
import { request } from 'graphql-request';
import LogOutButton from '@components/logoutbutton/logoutbutton';
import useSWR from 'swr';

const fetcher = (query: string) => {
  if (process.env.NODE_ENV === 'development') console.log('GRAPHQL QUERY:', query)
  return request('/api/graphql', query)
    .then((res) => {
      if (res.errors) {
        res.errors.forEach((err) => console.log('SERVER ERROR', err.message));
      }
      if (process.env.NODE_ENV === 'development') console.log('GRAPHQL RESPONSE:', res)
      return res;
    })
    .catch((err) => {
      if (err) {
        err.response.errors.forEach((ierr) =>
          console.log('SERVER ERROR:', ierr.message)
        );
      }
    });
};
const MyApp = ({
  Component,
  pageProps: { session, ...pageProps },
}: AppProps) => {
  const { data:accountsData } = useSWR('{ accounts{ id name }}');
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
          <Link href="/">hem</Link> <Link href="/account/import">import</Link>
          {accountsData && (
            accountsData.accounts.map((a, i) => (
               <Link key={i} href={{ pathname: '/account/[accountId]', query: { accountId: a.id } }}>{a.name}</Link>
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

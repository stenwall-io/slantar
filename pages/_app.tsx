// import '../styles/styles.scss';
import { ReactNode, useEffect } from 'react';
import Head from 'next/head';
import type { AppProps } from 'next/app';
import { SWRConfig } from 'swr';
import { SessionProvider } from 'next-auth/react';
import { request } from 'graphql-request'

const fetcher = query => request('/api/graphql', query).then(res => {
  console.log(res);
  if (res.errors) {
    res.errors.forEach((err) => console.log(err.message))
  }
  return res.data
})

const MyApp = ({
  Component,
  pageProps: { session, ...pageProps },
}: AppProps) => {
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
          <Component {...pageProps} />
        </SessionProvider>
      </SWRConfig>
    </>
  );
};

export default MyApp;

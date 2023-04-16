import '@/styles/globals.css'
import type { AppProps } from 'next/app'
import Script from 'next/script'
import Head from 'next/head';

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <title>Blitz - public roadmaps</title>
        <link rel="icon" href="data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>⚡</text></svg>" />
      </Head>
      <Component {...pageProps} />
      <Script async src="https://cdn.splitbee.io/sb.js" />
    </>
  );
}

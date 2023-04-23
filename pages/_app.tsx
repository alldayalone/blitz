import '@/styles/globals.css'
import type { AppProps } from 'next/app'
import Script from 'next/script'
import Head from 'next/head';
import { QueryClient, QueryClientProvider } from 'react-query';
import { RepoProvider } from '@/stores/repo';

const queryClient = new QueryClient()

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <title>Blitz - public roadmaps</title>
        <link rel="icon" href="data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>⚡</text></svg>" />
      </Head>
      <QueryClientProvider client={queryClient}>
        <RepoProvider>
          <Component {...pageProps} />
        </RepoProvider>
      </QueryClientProvider>
      <Script async src="https://cdn.splitbee.io/sb.js" />
    </>
  );
}

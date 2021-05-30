import Head from 'next/head';
import CssBaseline from '@material-ui/core/CssBaseline';
import '../styles/globals.css';

function MyApp({ Component, pageProps }) {
  return (
    <>
      <CssBaseline />
      <Head>
        <title>Structure Tools</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Component {...pageProps} />
    </>
  );
}

export default MyApp;

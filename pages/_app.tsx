import '../styles/globals.scss';
import 'react-toastify/dist/ReactToastify.css';

import type { AppProps } from 'next/app'
import '@rainbow-me/rainbowkit/styles.css';
import {
  getDefaultWallets,
  lightTheme,
  RainbowKitProvider,
} from '@rainbow-me/rainbowkit';
import { chain, configureChains, createClient, WagmiConfig } from 'wagmi';
import { jsonRpcProvider } from 'wagmi/providers/jsonRpc';
import Head from 'next/head';
import { ToastContainer } from 'react-toastify';

import { CollectionProvider } from '../scripts/CollectionContext';

import Favicon from '../assets/images/icon.png';

const { chains, provider } = configureChains(
  [ chain.mainnet ],
  [ jsonRpcProvider({ rpc: () => ({ http: 'https://cloudflare-eth.com' }) }) ],
);

const { connectors } = getDefaultWallets({
  appName: 'Open Devs Crew gallery',
  chains,
});

const wagmiClient = createClient({
  autoConnect: true,
  connectors,
  provider,
});

const rainbowKitCustomTheme = lightTheme({
  accentColor:'#f59e0b',
  accentColorForeground: 'white',
  borderRadius: 'small',
});

function MyApp({ Component, pageProps }: AppProps) {
  return (
  <>
    <Head>
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <meta charSet="utf-8" />

      <meta name="description" content="Discover the whole Open Devs Crew collection and manage your own tokens." />
      <meta property="og:type" content="website"></meta>
      <meta property="og:image" content={`${process.env.NEXT_PUBLIC_BASE_URL}/ogimage.jpg`}></meta>
      <meta property="og:url" content={`${process.env.NEXT_PUBLIC_BASE_URL}/`}></meta>
      <link rel="icon" href={Favicon.src} />
    </Head>

    <WagmiConfig client={wagmiClient}>
      <RainbowKitProvider chains={chains} theme={rainbowKitCustomTheme}>
        <CollectionProvider>
          <Component {...pageProps} />

          <ToastContainer
            position='top-center'
            autoClose={5000}
            closeOnClick={true}
            pauseOnHover={true} />
        </CollectionProvider>
      </RainbowKitProvider>
    </WagmiConfig>
  </>);
}

export default MyApp;


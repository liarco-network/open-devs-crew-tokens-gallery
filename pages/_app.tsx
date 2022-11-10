import '../styles/globals.scss'
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
import { CollectionProvider } from '../scripts/CollectionContext';

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
    </Head>

    <WagmiConfig client={wagmiClient}>
      <RainbowKitProvider chains={chains} theme={rainbowKitCustomTheme}>
        <CollectionProvider>
          <Component {...pageProps} />
        </CollectionProvider>
      </RainbowKitProvider>
    </WagmiConfig>
  </>);
}

export default MyApp;


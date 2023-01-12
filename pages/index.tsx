import styles from '../styles/Home.module.scss'

import type { NextPage } from 'next'
import { useEffect, useState } from 'react';
import { useDebounce } from 'use-debounce';
import { BiWalletAlt } from 'react-icons/bi';
import { useAccount } from 'wagmi';
import Link from 'next/link';

import TokensListComponent from '../components/TokensListComponent'
import CustomConnectButton from '../components/CustomConnectButton';

import OdcLogo from '../assets/images/odc-logo.png';
import Head from 'next/head';

const Home: NextPage = () => {
  const [ collectionQuery, setCollectionQuery ] = useState("");
  const [ isUserConnected, setIsUserConnected ] = useState<boolean>();
  const [ debouncedCollectionQuery ] = useDebounce(collectionQuery, 200);
  const { isConnected } = useAccount();

  useEffect(() => {
    setIsUserConnected(isConnected);
  },[isConnected]);

  return (
    <>
    <Head>
      <title>Gallery - Open Devs Crew</title>
      <meta property="og:title" content="Gallery - Open Devs Crew"></meta>
    </Head>

    <main className={styles.main}>
      <div className={styles.titleBar}>
        <div className={styles.leftSide}>
          <Link href={'/'} passHref>
            <a><img src={OdcLogo.src} alt="Open Devs Crew logo" /></a>
          </Link>
        </div>
        <div className={styles.rightSide}>
          {isUserConnected
          ?
            <Link href={'/wallet'} passHref>
              <a className='button'><BiWalletAlt /> Wallet</a>
            </Link>
          :
            <CustomConnectButton />
          }
        </div>
      </div>
      <input
        placeholder='Search Token ID'
        type={'number'}
        value={collectionQuery}
        onChange={(e) => setCollectionQuery(e.target.value)}
      />

      <TokensListComponent queryParam={debouncedCollectionQuery} />
    </main>
  </>
  );
}

export default Home;

import styles from '../styles/Home.module.scss'

import type { NextPage } from 'next'
import Head from 'next/head'
import { useEffect, useState } from 'react';
import { useDebounce } from 'use-debounce';
import { BiWalletAlt } from 'react-icons/bi';
import { useAccount } from 'wagmi';
import Link from 'next/link';

import TokensListComponent from '../components/TokensListComponent'
import CustomConnectButton from '../components/CustomConnectButton';

import Favicon from '../assets/images/icon.png';
import OdcLogo from '../assets/images/odc-logo.png';

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
        <title>Open Devs Crew Gallery</title>
        <meta name="description" content="Your open source journey through NFTs, web3 and educational content." />

        <meta property="og:title" content="Open Devs Crew Gallery"></meta>
        <meta property="og:type" content="website"></meta>
        <meta property="og:image" content="#"></meta>
        <meta property="og:url" content={`${process.env.NEXT_PUBLIC_BASE_URL}/`}></meta>

        <link rel="icon" href={Favicon.src} />
      </Head>

      <main className={styles.main}>

        <div className={styles.titleBar}>
          <div className={styles.leftSide}>
            <img src={OdcLogo.src} alt="Open Devs Crew logo" />
            <h1>Token Gallery</h1>
          </div>
          <div className={styles.rightSide}>
            <input
              placeholder='Search Token ID'
              type={'number'}
              value={collectionQuery}
              onChange={(e) => setCollectionQuery(e.target.value)}
            />
            {isUserConnected
            ?
              <Link href={'/wallet'}>
                <button><BiWalletAlt /> <span>Wallet</span></button>
              </Link>
            :
              <CustomConnectButton />
            }
          </div>
        </div>

        <TokensListComponent queryParam={debouncedCollectionQuery} />
      </main>
    </>
  )
}

export default Home

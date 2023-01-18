import styles from '../styles/Home.module.scss'

import type { NextPage } from 'next'
import Head from 'next/head';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useDebounce } from 'use-debounce';
import { BiWalletAlt } from 'react-icons/bi';
import { useAccount } from 'wagmi';

import TokensListComponent from '../components/TokensListComponent'
import CustomConnectButton from '../components/CustomConnectButton';

import OdcLogo from '../assets/images/odc-logo.png';
import Github from '../assets/images/icons/github.svg';

const Home: NextPage = () => {
  const [ collectionQuery, setCollectionQuery ] = useState("");
  const [ isUserConnected, setIsUserConnected ] = useState<boolean>();
  const [githubButtonInView, setGithubButtonInView] = useState(false);

  const [ debouncedCollectionQuery ] = useDebounce(collectionQuery, 200);
  const { isConnected } = useAccount();

  const handleGithubScroll = () => {
    setGithubButtonInView(window.scrollY < window.innerHeight)
  };

  useEffect(() => {
    setIsUserConnected(isConnected);
  },[isConnected]);

  useEffect(() => {
    window.addEventListener('scroll', handleGithubScroll);

    handleGithubScroll();

    return () => {
      window.removeEventListener('scroll', handleGithubScroll);
    }
  }, []);

  return (
    <>
    <Head>
      <title>Gallery - Open Devs Crew</title>
      <meta property="og:title" content="Gallery - Open Devs Crew"></meta>
    </Head>

    <main className={styles.main}>
        <a
          id={styles.githubContainer}
          className={githubButtonInView ? styles.githubButtonView : styles.githubButtonHidden}
          href="https://github.com/liarco-network/open-devs-crew-tokens-gallery" target="_blank" rel="noreferrer"
        >
          <span>GitHub</span>
          <Github />
      </a>
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

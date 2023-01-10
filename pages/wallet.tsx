import styles from '../styles/Wallet.module.scss'

import type { NextPage } from 'next'
import Head from 'next/head'
import OdcLogo from '../assets/images/odc-logo.png';
import Favicon from '../assets/images/icon.png';
import { useEffect, useState } from 'react';
import { useNetwork } from 'wagmi';
import CustomConnectButton from '../components/CustomConnectButton';
import MessageBox from '../components/MessageBox';
import WalletDataComponent from '../components/WalletDataComponent';
import Link from 'next/link';
import { BiGridAlt } from 'react-icons/bi';
import { useRouter } from 'next/router';

const Wallet: NextPage = () => {
  const [ chainInfo, setChainInfo ] = useState<{isConnected: boolean, isRight: boolean}>({isConnected: false, isRight: false});
  const router = useRouter();
  const { chain } = useNetwork();

  useEffect(() => {
    setChainInfo({
      isConnected: Boolean(chain),
      isRight: !chain?.unsupported,
    });
    if (!Boolean(chain)) {
      router.push('/');
    }
  }, [chain]);

  return (
    <>
      <Head>
        <title>My Wallet - Open Devs Crew Gallery</title>
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
            <Link href={'/'} passHref>
              <a><img src={OdcLogo.src} alt="Open Devs Crew logo" /></a>
            </Link>
          </div>
          <div className={styles.rightSide}>
            <Link href={'/'} passHref>
              <a className='button'><BiGridAlt /> <span>Gallery</span></a>
            </Link>
            <CustomConnectButton />
          </div>
        </div>

        {chainInfo.isConnected
        ?
          (chainInfo.isRight
          ?
            <WalletDataComponent />
          :
            <MessageBox title={'Wrong network!'} message={'You are connected to the wrong network, please change your settings using the button above.'} />
          )
        :
        <></>
        }
      </main>
    </>
  );
}

export default Wallet;

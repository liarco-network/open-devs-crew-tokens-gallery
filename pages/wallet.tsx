import styles from '../styles/Wallet.module.scss'

import type { NextPage } from 'next'
import { useEffect, useState } from 'react';
import { useNetwork } from 'wagmi';
import Link from 'next/link';
import { BiGridAlt } from 'react-icons/bi';
import { useRouter } from 'next/router';

import WalletExpirationNotice from '../components/WalletExpirationNotice';
import CustomConnectButton from '../components/CustomConnectButton';
import WalletDataComponent from '../components/WalletDataComponent';
import MessageBox from '../components/MessageBox';

import OdcLogo from '../assets/images/odc-logo.png';
import Head from 'next/head';

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

  return (<>
    <Head>
      <title>My Wallet - Open Devs Crew</title>
      <meta property="og:title" content="My Wallet - Open Devs Crew"></meta>
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

      <WalletExpirationNotice />

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

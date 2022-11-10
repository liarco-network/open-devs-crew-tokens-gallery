import styles from '../styles/Home.module.scss'

import type { NextPage } from 'next'
import Head from 'next/head'
import TokensListComponent from '../components/TokensListComponent'
import OdcLogo from '../assets/images/odc-logo.png';
import { useState } from 'react';

const Home: NextPage = () => {
  const [ collectionQuery, setCollectionQuery ] = useState("");

  return (
    <>
      <Head>
        <title>Open Devs Crew Gallery</title>
        <meta name="description" content="Generated by create next app" />

        <meta property="og:title" content="Next Website"></meta>
        <meta property="og:type" content="website"></meta>
        <meta property="og:image" content="#"></meta>
        <meta property="og:url" content={`${process.env.NEXT_PUBLIC_BASE_URL}/`}></meta> 

        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>

        <div className={styles.navbar}>
          <div>
            <img src={OdcLogo.src} alt="" />
            <h1>Token Gallery</h1>
          </div>
          <input placeholder='Search Token ID' value={collectionQuery} onChange={(e) => setCollectionQuery(e.target.value)} />
        </div>

        <TokensListComponent queryParam={collectionQuery} />
      </main>
    </>
  )
}

export default Home

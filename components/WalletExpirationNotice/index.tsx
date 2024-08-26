import styles from './WalletExpirationNotice.module.scss';

import { useCallback, useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import moment from 'moment';

import { useCollectionContext } from '../../scripts/CollectionContext'; 
import { getSafeLatestActivityTimestamp, parseDate } from '../../scripts/utils/Aux'; 
import { toast } from 'react-toastify';
import { useRouter } from 'next/router';

const WALLET_EXPIRATION_SAFETY_WINDOW = 60 * 24 * 60 * 60; // 60 days

const WalletExpirationNotice = () => {
  const [isReady, setIsReady] = useState(false);
  const {
    userWallet,
    addressInactivityTimeFrame,
    refreshLatestWithdrawalTimestampData,
  } = useCollectionContext();
  const router = useRouter();

  const isWalletPage = useMemo(() => router.pathname === '/wallet', [router.pathname]);

  const now = new Date().getTime() / 1000;

  const safeLatestActivityTimestamp = useMemo(() => {
    if (userWallet.latestWithdrawTimestamp && userWallet.tokensData) {
      return getSafeLatestActivityTimestamp(userWallet.latestWithdrawTimestamp, userWallet.tokensData);
    }

    return 0;
  }, [userWallet.latestWithdrawTimestamp, userWallet.tokensData]);

  const expirationTimestamp = useMemo(
    () => addressInactivityTimeFrame !== undefined ? addressInactivityTimeFrame.add(safeLatestActivityTimestamp).toNumber() : 0,
    [safeLatestActivityTimestamp, addressInactivityTimeFrame],
  );

  const refreshLatestWithdrawalTimestamp = useCallback(async () => {
    if (refreshLatestWithdrawalTimestampData.refreshLatestWithdrawalTimestamp === undefined) {
      toast.error('Your wallet is not ready, please try again!');
      
      return;
    }

    await refreshLatestWithdrawalTimestampData.refreshLatestWithdrawalTimestamp();
  }, [refreshLatestWithdrawalTimestampData, refreshLatestWithdrawalTimestampData.refreshLatestWithdrawalTimestamp]);

  useEffect(() => {
    if (refreshLatestWithdrawalTimestampData.refreshLatestWithdrawalTimestampError === null || refreshLatestWithdrawalTimestampData.reset === undefined) {
      return;
    }

    refreshLatestWithdrawalTimestampData.reset();
    toast.error('Failed sending the transaction request, please try again!');
  }, [refreshLatestWithdrawalTimestampData, refreshLatestWithdrawalTimestampData.refreshLatestWithdrawalTimestampError, refreshLatestWithdrawalTimestampData.reset]);

  useEffect(() => {
    if (refreshLatestWithdrawalTimestampData.refreshLatestWithdrawalTimestampSuccess !== true || refreshLatestWithdrawalTimestampData.reset === undefined) {
      return;
    }

    refreshLatestWithdrawalTimestampData.reset();
    toast.success('Your inactivity period has been reset successfully!');
  }, [refreshLatestWithdrawalTimestampData, refreshLatestWithdrawalTimestampData.refreshLatestWithdrawalTimestampSuccess, refreshLatestWithdrawalTimestampData.reset]);

  useEffect(() => {
    setIsReady(userWallet.address !== undefined && addressInactivityTimeFrame !== undefined && refreshLatestWithdrawalTimestampData.refreshLatestWithdrawalTimestamp !== undefined);
  }, [userWallet.address, addressInactivityTimeFrame, refreshLatestWithdrawalTimestampData.refreshLatestWithdrawalTimestamp]);

  return isReady && (expirationTimestamp - WALLET_EXPIRATION_SAFETY_WINDOW < now) ? <div className={styles.wrapper}>
    <div className={styles.title}>Wallet Expiration Notice</div>
    <p>
      This collection implements <strong>a time-based inactivity period for wallets</strong> to ensure the project can
      continue to grow, even if one or more holders become completely inactive. To keep your wallet active, you must perform
      specific activities at least once every two years. This can be done either by sending a free (gas-only) transaction to
      the contract or by withdrawing ETH from a token.<br />
      If you do not complete this step, you won&apos;t lose your NFTs, but you may lose the balance stored in them. You can
      find more detailed information <a href="https://docs.opendevs.io/docs/collections/time-based-inactivity" target="_blank" rel="noreferrer">here</a>.
    </p>
    <p>
      Based on the available on-chain data, your wallet will become inactive on <strong>{parseDate(expirationTimestamp)}</strong>
      {' '}({moment(addressInactivityTimeFrame.add(safeLatestActivityTimestamp).mul(1000).toNumber()).fromNow()}). We
      recommend taking action before this date to avoid any potential losses.
      {!isWalletPage ?
        <> Your <Link href="/wallet">wallet page</Link> offers a convenient UI to do so, or you can click the button below to
        refresh the inactivity period.</>
      :
        <> You can click the button below to refresh the inactivity period.</>
      }
    </p>
    <button
      className={styles.button}
      onClick={() => refreshLatestWithdrawalTimestamp()}
      disabled={refreshLatestWithdrawalTimestampData.refreshLatestWithdrawalTimestampLoading}
    >Refresh inactivity period</button>

    {!isWalletPage ? <>
      <p>
        If you prefer using <strong>Etherscan</strong> you can call <strong>one of the following functions</strong> on the contract:
      </p>
      <ul>
        <li><a href="https://etherscan.io/address/0x5bfbf78d81cd7d255dfa44d9f568375131361775#writeContract#F6" target="_blank" rel="noreferrer">refreshLatestWithdrawalTimestamp()</a>: Call this function with no parameters to reset the inactivity period for another 2 years (starting from now) without affecting your tokens.</li>
        <li><a href="https://etherscan.io/address/0x5bfbf78d81cd7d255dfa44d9f568375131361775#writeContract#F17" target="_blank" rel="noreferrer">withdraw()</a>: Use this function by passing the ID of a token you have held for at least 90 days, along with a list of token IDs from which you want to withdraw the balance (e.g. <code>[13,23,42]</code>).</li>
      </ul>
    </> : null}
  </div> : null;
};

export default WalletExpirationNotice;
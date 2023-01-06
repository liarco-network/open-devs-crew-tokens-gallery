import styles from './UserInfoWidget.module.scss';

import moment from 'moment';
import { useEffect, useMemo, useState } from 'react';
import { BigNumber, ethers } from 'ethers';

import { getLatestTimestamp, parseDate } from '../../scripts/utils/Aux';
import { useCollectionContext } from '../../scripts/CollectionContext';

interface Props {
  openPopupCallback: () => void;
}

const UserInfoWidget = ({openPopupCallback}: Props) => {
  const [ userWalletAddress, setUserWalletAddress ] = useState<string>();
  const {
    userWallet,
    addressInactivityTimeFrame,
  } = useCollectionContext();

  useEffect(() => {
    setUserWalletAddress(userWallet.address);
  }, [userWalletAddress]);

  const latestTimestamp = useMemo(() => {
    if (userWallet.latestWithdrawTimestamp && userWallet.tokensData) {
      return getLatestTimestamp(userWallet.latestWithdrawTimestamp, userWallet.tokensData);
    }

    return 0;
  }, [userWallet.latestWithdrawTimestamp, userWallet.tokensData]);

  const userBalance = useMemo(() => {
    let totalBalance = BigNumber.from(0);

    if (userWallet.tokensData) {
      userWallet.tokensData.forEach((token) => totalBalance = token.tokenBalance.add(totalBalance));
    }

    return parseFloat(ethers.utils.formatEther(totalBalance)).toFixed(4)
  }, [userWallet.tokensData]);

  return (
    <>
      {userWalletAddress && userWallet.tokensData && userWallet.latestWithdrawTimestamp &&
        <>
          <div className={styles.activityExpiration}>
            <h2>Latest activity</h2>
            <span>{parseDate(latestTimestamp)}</span>
            <span className={styles.expiration}>Expires {moment(addressInactivityTimeFrame.add(latestTimestamp).mul(1000).toNumber()).fromNow()}</span>
          </div>

          <div className={styles.userBalance}>
            <h2>Total balance</h2>
            <span>{userBalance} ETH</span>
          </div>

          <div>
            <button
              className={styles.withdrawButton}
              disabled={userWallet.selectedTokens.length === 0 || undefined === userWallet.diamondHolderToken}
              onClick={() => openPopupCallback()}
            >
              Withdraw
            </button>
          </div>
        </>
      }
    </>
  )
}

export default UserInfoWidget;

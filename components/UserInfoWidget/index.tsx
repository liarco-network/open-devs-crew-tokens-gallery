import styles from './UserInfoWidget.module.scss';

import moment from 'moment';
import { useEffect, useMemo, useState } from 'react';
import { GrDiamond } from 'react-icons/gr';
import { BigNumber } from 'ethers';

import { formatEtherValue, getLatestTimestamp, parseDateWithoutTime } from '../../scripts/utils/Aux';
import { useCollectionContext } from '../../scripts/CollectionContext';
import Button from '../Button';

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

  const oldestToken = useMemo(() => {
    let oldestId = '--';
    let oldestTimestamp = 0;

    if (userWallet.tokensData) {
      userWallet.tokensData.map((token) => {
        if (token.ownershipStartTimestamp.toNumber() < oldestTimestamp || oldestTimestamp === 0) {
          oldestTimestamp = token.ownershipStartTimestamp.toNumber();
          oldestId = token.tokenId.toString();
        }
      });
    }
    return {
      id: oldestId,
      timestamp: oldestTimestamp,
      isDiamond: (userWallet.diamondHolderToken && (userWallet.diamondHolderToken.toString() === oldestId)),
    };
  }, [userWallet.tokensData]);

  const userBalance = useMemo(() => {
    let totalBalance = BigNumber.from(0);

    if (userWallet.tokensData) {
      userWallet.tokensData.forEach((token) => totalBalance = token.tokenBalance.add(totalBalance));
    }

    return formatEtherValue(totalBalance);
  }, [userWallet.tokensData]);

  return (
    <>
      {userWalletAddress && userWallet.tokensData && userWallet.latestWithdrawTimestamp &&
        <>
          <div className={styles.widgetData} title={`Expires ${moment(addressInactivityTimeFrame.add(latestTimestamp).mul(1000).toNumber()).fromNow()}`}>
            <h2>{parseDateWithoutTime(latestTimestamp)}</h2>
            <span>latest activity</span>
          </div>

          <div className={styles.widgetData} title={`Your total balance is ${userBalance} ETH`}>
            <h2>{userBalance} ETH</h2>
            <span>total balance</span>
          </div>

          <div className={styles.widgetData} title={`You own ${userWallet.tokensData.length} tokens`}>
            <h2>{userWallet.tokensData.length}</h2>
            <span>tokens</span>
          </div>

          <div className={styles.widgetData} title={`Your oldest token is #${oldestToken.id}${oldestToken.isDiamond ? ` and it is a diamond hand token!`: ``}`}>
            <h2>#{oldestToken.id} {oldestToken.isDiamond && <GrDiamond />}</h2>
            <span>oldest token</span>
          </div>

          <div>
            <Button
              className={styles.withdrawButton}
              disabled={userWallet.selectedTokens.length === 0 || undefined === userWallet.diamondHolderToken}
              onClick={() => openPopupCallback()}
            >
              Withdraw
            </Button>
          </div>
        </>
      }
    </>
  )
}

export default UserInfoWidget;

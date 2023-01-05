import styles from './WithdrawPopup.module.scss';

import { useMemo } from 'react';
import { BigNumber, ethers } from 'ethers';

import { useCollectionContext } from '../../scripts/CollectionContext';

interface Props {
  closePopupCallback: () => void;
}

const WithdrawPopup = ({closePopupCallback}: Props) => {
  const {
    userWallet,
  } = useCollectionContext();

  const selectedTokensWithdrawAmount = useMemo(() => {
    let total = BigNumber.from(0);

    if (userWallet.selectedTokens && userWallet.tokensData) {
      userWallet.tokensData.forEach((token) => {
        if (userWallet.selectedTokens.includes(token.tokenId.toNumber())) {
          total=total.add(token.tokenBalance);
        }
      });
    }

    return total;
  }, [userWallet.selectedTokens, userWallet.tokensData]);

  return (
    <div className={styles.withdrawPopup} onClick={closePopupCallback}>
      <div className={styles.popup} onClick={(e) => e.stopPropagation()}>
        <span>You are about to withdraw <strong>{parseFloat(ethers.utils.formatEther(selectedTokensWithdrawAmount)).toFixed(5)} ETH</strong> from the following tokens: </span>
        <ul>
          {userWallet.selectedTokens.map((token, key) => <li key={key}>{token}</li>)}
        </ul>
        <span className={styles.continueMessage}>Are you sure you want to continue?</span>
        <span className={styles.subMessage}>You will be promped to confirm the choice</span>
        <div className={styles.choice}>
          <button onClick={() => console.log('Withdrawing')}>YES</button>
          <button onClick={closePopupCallback}>NO</button>
        </div>
      </div>
    </div>
  );
}

export default WithdrawPopup;
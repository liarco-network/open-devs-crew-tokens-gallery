import styles from './WithdrawPopup.module.scss';

import { useEffect, useMemo } from 'react';
import { BigNumber, ethers } from 'ethers';

import { useCollectionContext } from '../../scripts/CollectionContext';
import TransactionLinkEtherscan from '../util/TransactionLinkEtherscan';
import TokenThumbnail from '../TokenThumbnail';
import Button from '../Button';

interface Props {
  closePopupCallback: () => void;
}

const WithdrawPopup = ({ closePopupCallback }: Props) => {
  const {
    userWallet,
    withdrawData,
    setAllSelectedTokens,
  } = useCollectionContext();

  const handleClosePopup = () => {
    closePopupCallback();
    withdrawData.reset();
  }

  const selectedTokensWithdrawAmount = useMemo(() => {
    let total = BigNumber.from(0);

    if (userWallet.selectedTokens && userWallet.tokensData) {
      userWallet.tokensData.forEach((token) => {
        if (userWallet.selectedTokens.includes(token.tokenId.toNumber())) {
          total=total.add(token.tokenBalance);
        }
      });
    }

    return parseFloat(ethers.utils.formatEther(total)).toFixed(5);
  }, [userWallet.selectedTokens, userWallet.tokensData]);

  useEffect(() => {
    if (withdrawData.withdrawSuccess) {
      setAllSelectedTokens(false);
    }
  }, [withdrawData.withdrawSuccess]);

  return (
    <div className={styles.withdrawPopup} onClick={() => withdrawData.withdrawLoading ? null : handleClosePopup()}>
      <div className={styles.popup} onClick={(e) => e.stopPropagation()}>
        {(!withdrawData.withdrawLoading && !withdrawData.withdrawSuccess) &&
          <>
            <p>You are about to withdraw <strong>{selectedTokensWithdrawAmount} ETH</strong> from the following {userWallet.selectedTokens.length !== 1 ? `${userWallet.selectedTokens.length} tokens:` : `token:`} </p>
            {userWallet.selectedTokens.length !== 1 ?
              <ul>
                {userWallet.selectedTokens.map((token, key) =>
                  <li key={key}>
                    <TokenThumbnail tokenId={token}/>
                    <span>#{token}</span>
                  </li>
                )}
              </ul>
              :
              <div className={styles.singleToken}>
                <TokenThumbnail tokenId={userWallet.selectedTokens[0]}/>
              </div>
            }
            <p className={styles.continueMessage}>Are you sure you want to continue?</p>
            <p className={styles.subMessage}>You will be promped to confirm the choice</p>
            <div className={styles.choice}>
              <Button onClick={withdrawData.withdraw}>Yes</Button>
              <Button onClick={handleClosePopup}>No</Button>
            </div>
          </>
        }

        {withdrawData.withdrawLoading &&
          <div className={styles.contentContainer}>
            <p className={styles.progress}>Withdraw in progress...</p>
            <p className={styles.subMessage}>Check Wallet</p>
          </div>
        }

        {withdrawData.withdrawSuccess &&
          <div className={styles.contentContainer}>
            <p className={styles.success}>Success!</p>

            {withdrawData.withdrawTransactionHash &&
              <TransactionLinkEtherscan txAddress={withdrawData.withdrawTransactionHash}>
                View TX on Etherscan
              </TransactionLinkEtherscan>
            }

            <div className={styles.choice}>
              <Button onClick={handleClosePopup}>Close</Button>
            </div>
          </div>
        }
      </div>
    </div>
  );
}

export default WithdrawPopup;

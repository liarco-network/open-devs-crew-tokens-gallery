import styles from './TokenPopupCard.module.scss';

import { BigNumber, ethers } from 'ethers';
import OpenSeaLogo from '../../assets/images/icons/opensea.svg';

interface TokenData {
  tokenId: BigNumber;
  ownerAddress: string;
  ownershipStartTimestamp: BigNumber;
  tokenBalance: BigNumber;
  ownerLatestActivityTimestamp: BigNumber;
}

interface Props {
  token: TokenData;
  callback: () => void;
}

const TokenPopupCard = ({token, callback}: Props) => {

  const parseDate = (timestamp: BigNumber) => {
    return timestamp.eq(0) ? 'No activity yet' : new Date(1000 * timestamp.toNumber()).toUTCString();
  }

  return (
    <>
      <div className={styles.backDrop} onClick={callback}></div>
      <div className={styles.popupCard}>
        <button onClick={callback}>X</button>
        <div className={styles.header}>
          <h1>Open Devs Crew #{token.tokenId.toNumber()}</h1>
          <a
            href={`https://opensea.io/assets/ethereum/0x5bfbf78d81cd7d255dfa44d9f568375131361775/${token.tokenId.toNumber()}`}
            target="_blank"
            rel="noreferrer"
          >Watch on OpenSea <OpenSeaLogo /></a>
        </div>

        <div className={styles.contentContainer}>
          <div className={styles.leftSide}>
            <img src={`https://cdn.opendevs.io/tokens/public/thumbnails/${token.tokenId}.jpg`} alt="" />
          </div>

          <div className={styles.rightSide}>
            <div className={styles.tokenData}>
              <p>Owner: <strong>{token.ownerAddress}</strong></p>
              <p>Token balance: <strong>{parseFloat(ethers.utils.formatEther(token.tokenBalance)).toFixed(4)} ETH</strong></p>
              <p>Latest transfer: <strong>{parseDate(token.ownershipStartTimestamp)}</strong></p>
              <p>Latest owner activity: <strong>{parseDate(token.ownerLatestActivityTimestamp)}</strong></p>
            </div>

            <div className={styles.tokenTraits}>
              
            </div>
          </div>
        </div>
      </div>
    </>);
};

export default TokenPopupCard;
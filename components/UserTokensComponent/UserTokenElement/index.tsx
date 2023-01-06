import styles from './UserTokenElement.module.scss';

import { ethers } from 'ethers';
import { GrDiamond } from 'react-icons/gr';
import moment from 'moment';

import { useCollectionContext } from '../../../scripts/CollectionContext';
import { TokenData, parseDate } from '../../../scripts/utils/Aux';

interface Props {
  token: TokenData;
}

const CURRENT_TIMESTAMP = (new Date()).getTime() / 1000;

const UserTokenElement = ({ token }: Props) => {
  const tokenId = token.tokenId.toNumber();

  const {
    userWallet,
    handleSelectedToken,
    diamondHandsTimeFrame,
  } = useCollectionContext();

  const isDiamondHandsHolderToken = (ownershipStartTimestamp: number) => diamondHandsTimeFrame === undefined ? false : ownershipStartTimestamp + diamondHandsTimeFrame < CURRENT_TIMESTAMP;

  return (
    <li className={styles.tokenListElement}>
      <input
        type="checkbox"
        checked={userWallet.selectedTokens.includes(tokenId)}
        onChange={() => handleSelectedToken(tokenId)}
        aria-label={`${userWallet.selectedTokens.includes(tokenId) ? 'Deselect' : 'Select'} token #${tokenId}`}
      />
      <img src={`https://cdn.opendevs.io/tokens/public/thumbnails/${tokenId}.jpg`} alt={`Token ${tokenId} thumbnail`} loading="lazy" />
      <span className={styles.tokenId}>#{tokenId}</span>
      <span className={styles.tokenBalance}>{parseFloat(ethers.utils.formatEther(token.tokenBalance)).toFixed(4)} ETH</span>
      <span className={styles.tokenOwnerSince} title={parseDate(token.ownershipStartTimestamp)}>{isDiamondHandsHolderToken(token.ownershipStartTimestamp.toNumber()) && <GrDiamond />}{moment(token.ownershipStartTimestamp.mul(1000).toNumber()).fromNow()}</span>
    </li>
  );
};

export default UserTokenElement;

import styles from './UserTokenElement.module.scss';

import { ethers } from 'ethers';
import { BiDiamond } from 'react-icons/bi';

import { useCollectionContext } from '../../../scripts/CollectionContext';
import { TokenData, parseDate } from '../../../scripts/utils/Aux';

interface Props {
  token: TokenData;
}

const UserTokenElement = ({ token }: Props) => {
  const tokenId = token.tokenId.toNumber();

  const {
    userWallet,
    handleSelectedToken,
  } = useCollectionContext();

  return (
    <li className={styles.tokenListElement}>
      <input
        type="checkbox"
        checked={userWallet.selectedTokens.includes(tokenId)}
        onChange={() => handleSelectedToken(tokenId)}
        aria-label={`${userWallet.selectedTokens.includes(tokenId) ? 'Deselect' : 'Select'} token #${tokenId}`}
      />
      <img src={`https://cdn.opendevs.io/tokens/public/thumbnails/${tokenId}.jpg`} alt={`Token ${tokenId} thumbnail`} loading="lazy" />
      <span className={styles.tokenId}>{userWallet.diamondHolderToken && userWallet.diamondHolderToken === tokenId && <BiDiamond />}{tokenId}</span>
      <span className={styles.tokenBalance}>{parseFloat(ethers.utils.formatEther(token.tokenBalance)).toFixed(4)} ETH</span>
      <span className={styles.tokenOwnerSince}>{parseDate(token.ownershipStartTimestamp)}</span>
    </li>
  );
};

export default UserTokenElement;

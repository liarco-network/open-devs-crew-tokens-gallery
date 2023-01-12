import styles from './UserTokenElement.module.scss';

import { ethers } from 'ethers';
import { GrDiamond } from 'react-icons/gr';
import { IoIosEye } from 'react-icons/io';
import moment from 'moment';

import { useCollectionContext } from '../../../scripts/CollectionContext';
import { TokenData, parseDate } from '../../../scripts/utils/Aux';
import TokenThumbnail from '../../TokenThumbnail';

interface Props {
  token: TokenData;
  popupCallback: () => void;
}

const CURRENT_TIMESTAMP = (new Date()).getTime() / 1000;

const UserTokenElement = ({ token, popupCallback }: Props) => {
  const tokenId = token.tokenId.toNumber();

  const {
    userWallet,
    handleSelectedToken,
    diamondHandsTimeFrame,
  } = useCollectionContext();

  const tokenCheckboxLabel = `${userWallet.selectedTokens.includes(tokenId) ? 'Deselect' : 'Select'} token #${tokenId}`;

  const isDiamondHandsHolderToken = (ownershipStartTimestamp: number) => diamondHandsTimeFrame === undefined ? false : ownershipStartTimestamp + diamondHandsTimeFrame < CURRENT_TIMESTAMP;

  return (
    <li className={styles.tokenListElement}>
      <input
        type="checkbox"
        checked={userWallet.selectedTokens.includes(tokenId)}
        disabled={token.tokenBalance.eq(0)}
        onChange={() => handleSelectedToken(tokenId)}
        aria-label={token.tokenBalance.eq(0) ? 'This token has nothing to withdraw' : tokenCheckboxLabel}
      />
      <TokenThumbnail tokenId={tokenId} callback={popupCallback} className={styles.hideable} />
      <div className={styles.tokenId} onClick={popupCallback}>#{tokenId}<IoIosEye /></div>
      <div className={styles.tokenBalance}>{parseFloat(ethers.utils.formatEther(token.tokenBalance)).toFixed(4)} ETH</div>
      <div className={styles.tokenOwnerSince} title={parseDate(token.ownershipStartTimestamp)}>{isDiamondHandsHolderToken(token.ownershipStartTimestamp.toNumber()) && <GrDiamond />}{moment(token.ownershipStartTimestamp.mul(1000).toNumber()).fromNow()}</div>
    </li>
  );
};

export default UserTokenElement;

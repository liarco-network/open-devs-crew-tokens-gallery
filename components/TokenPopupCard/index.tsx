import styles from './TokenPopupCard.module.scss';

import { BigNumber, ethers } from 'ethers';
import { useEffect, useState } from 'react';

import { useCollectionContext } from '../../scripts/CollectionContext';
import AddressLinkEtherscan from '../util/AddressLinkEtherscan';

import OpenSeaLogo from '../../assets/images/icons/opensea.svg';
import { parseDate } from '../../scripts/utils/Aux';
import CloseIcon from '../../assets/images/icons/close.svg';
import AddressLinkOpenSea from '../util/AddressLinkOpenSea';
import WalletAddress from '../util/WalletAddress';

interface TokenData {
  tokenId: BigNumber;
  ownerAddress: string;
  ownershipStartTimestamp: BigNumber;
  tokenBalance: BigNumber;
  ownerLatestActivityTimestamp: BigNumber;
}

interface SingleTokenTraitData {
  openRarity: {
    rank: number;
    score: number;
  };
  traits: number[];
}

interface Props {
  token: TokenData;
  callback: () => void;
}

const TIMEOUT_DURATION_MS = 3000;

const TokenPopupCard = ({ token, callback }: Props) => {
  const [ tokenTraits, setTokenTraits ] = useState<SingleTokenTraitData>();
  const [ timeoutRequest, setTimeoutRequest] = useState(false);

  const {
    traitsData,
    tokensTraitData,
  } = useCollectionContext();

  useEffect(() => {
    if (tokensTraitData) {
      setTokenTraits(tokensTraitData[token.tokenId.toHexString()]);
    }
  },[tokensTraitData]);

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    const timeId = setTimeout(() => {
      setTimeoutRequest(true)
    }, TIMEOUT_DURATION_MS);

    return ()=> {
      document.body.style.overflow = 'auto';
      clearTimeout(timeId);
    }
  }, []);

  return (
    <div className={styles.backDrop} onClick={callback}>
      <div className={styles.popupCard} onClick={(e) => e.stopPropagation()}>
        <button title="Close the popup" className={styles.closeButton} onClick={callback}><CloseIcon /></button>

        <div className={styles.header}>
          <div>
            <h1>Open Dev #{token.tokenId.toNumber()}</h1>
            <a
              href={`https://opensea.io/assets/ethereum/0x5bfbf78d81cd7d255dfa44d9f568375131361775/${token.tokenId.toNumber()}`}
              target="_blank"
              rel="noreferrer"
            >
              <OpenSeaLogo />
            </a>
          </div>
        </div>

        <div className={styles.contentContainer}>
          <img src={`https://cdn.opendevs.io/tokens/public/thumbnails/${token.tokenId}.jpg`} alt="" />

          <div className={styles.rightSide}>
            <dl className={styles.tokenInfo}>
              <div>
                <dt>Owner</dt>
                <dd className={styles.owner}><WalletAddress address={token.ownerAddress} /> <AddressLinkEtherscan address={token.ownerAddress} /> <AddressLinkOpenSea address={token.ownerAddress} /></dd>
              </div>
              <div>
                <dt>Token balance</dt>
                <dd>{parseFloat(ethers.utils.formatEther(token.tokenBalance)).toFixed(4)} ETH</dd>
              </div>
              <div>
                <dt>Latest transfer</dt>
                <dd>{parseDate(token.ownershipStartTimestamp)}</dd>
              </div>
              <div>
                <dt>Latest owner activity</dt>
                <dd>{token.ownerLatestActivityTimestamp.eq(0) ? parseDate(token.ownershipStartTimestamp) : parseDate(token.ownerLatestActivityTimestamp)}</dd>
              </div>
              {tokenTraits && <div>
                <dt>OpenRarity Rank</dt>
                <dd>#{tokenTraits.openRarity.rank}</dd>
              </div>}
            </dl>

            <div className={styles.tokenTraits}>
              {(tokenTraits && traitsData)
              ?
                <dl>
                {tokenTraits.traits.map((trait, index) => {
                  return (
                    <div key={index}>
                      <dt>{traitsData[index].name}</dt>
                      <dd>{traitsData[index].values[trait]}</dd>
                    </div>
                  );
                })}
                </dl>
              :
                !timeoutRequest ? <p>LOADING DATA</p> : <p className={styles.notAvailable}>Data is not available for this token yet!</p>
              }
            </div>
          </div>
        </div>
      </div>
    </div>);
};

export default TokenPopupCard;

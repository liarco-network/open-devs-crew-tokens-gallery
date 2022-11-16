import styles from './TokenPopupCard.module.scss';

import { BigNumber, ethers } from 'ethers';
import OpenSeaLogo from '../../assets/images/icons/opensea.svg';
import { useEffect, useState } from 'react';

interface TokenData {
  tokenId: BigNumber;
  ownerAddress: string;
  ownershipStartTimestamp: BigNumber;
  tokenBalance: BigNumber;
  ownerLatestActivityTimestamp: BigNumber;
}

interface TokenTrait {
  trait_type: string;
  value: string;
}

interface Props {
  token: TokenData;
  callback: () => void;
}

const TokenPopupCard = ({token, callback}: Props) => {
  const [ tokenAttributes, setTokenAttributes ] = useState<TokenTrait[]>();

  const parseDate = (timestamp: BigNumber) => {
    if (timestamp.eq(0)) {
      return 'No activity yet';
    }

    const date = new Date(1000 * timestamp.toNumber());

    return `${date.getUTCFullYear()}-${date.getMonth() + 1}-${date.getUTCDate()} ${formatZero(date.getUTCHours())}:${formatZero(date.getUTCMinutes())} UTC`
  }

  const formatZero = (time: number) => {
    return time >= 10 ? time : '0'+time;
  }

  const parseMetadata = async () => {
    try {
      const res = await fetch(`https://cdn.opendevs.io/tokens/public/metadata/${token.tokenId.toString()}.json`)
      setTokenAttributes((await res!.json()).attributes);
    } catch (err) {
      console.log(err);
    }
  }

  useEffect(() => {
    parseMetadata();
  },[]);

  return (
    <div className={styles.backDrop} onClick={callback}>
      <div className={styles.popupCard} onClick={(e) => e.stopPropagation()}>
        <button className={styles.closeButton} onClick={callback}>X</button>

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
          <div className={styles.leftSide}>
            <img src={`https://cdn.opendevs.io/tokens/public/thumbnails/${token.tokenId}.jpg`} alt="" />
          </div>

          <div className={styles.rightSide}>
            <div className={styles.tokenData}>
              <p>Owner: <span>{token.ownerAddress}</span></p>
              <p>Token balance: <span>{parseFloat(ethers.utils.formatEther(token.tokenBalance)).toFixed(4)} ETH</span></p>
              <p>Latest transfer: <span>{parseDate(token.ownershipStartTimestamp)}</span></p>
              <p>Latest owner activity: <span>{parseDate(token.ownerLatestActivityTimestamp)}</span></p>
            </div>

            <div className={styles.tokenTraits}>
                {tokenAttributes 
                ?
                <ul>
                 {
                  tokenAttributes.map((attribute, index) => {
                    return (
                      <li key={index}>
                        <p><strong>{attribute.trait_type}</strong></p>
                        <span>{attribute.value}</span>
                      </li>
                    )
                    })
                  }
                </ul>
                :
                  <p>LOADING DATA</p>
                }
            </div>
          </div>
        </div>
      </div>
    </div>);
};

export default TokenPopupCard;

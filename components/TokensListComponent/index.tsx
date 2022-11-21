import { BigNumber } from 'ethers';
import { useState, useEffect } from 'react';
import { useCollectionContext } from '../../scripts/CollectionContext';
import TokenPopupCard from '../TokenPopupCard';
import styles from './TokensListComponent.module.scss';

interface TokenData {
  tokenId: BigNumber;
  ownerAddress: string;
  ownershipStartTimestamp: BigNumber;
  tokenBalance: BigNumber;
  ownerLatestActivityTimestamp: BigNumber;
}

const TokensListComponent = ({ queryParam }: { queryParam: string }) => {
  const [ collectionTokenData, setCollectionTokenData ] = useState<TokenData[]|undefined>();
  const [ popupTokenData, setPopupTokenData ] = useState<TokenData>();

  const {
    tokensData,
  } = useCollectionContext();
 
  useEffect(() => {
    if (tokensData) {
      setCollectionTokenData(tokensData.filter((token: TokenData) => {
        const tokenId = token.tokenId.toString();

        if (queryParam.length === 0 || tokenId.includes(queryParam)) {
          return token;
        }
      }));
    }
  }, [tokensData, queryParam]);

  return (
    <>
      {collectionTokenData &&
        <ul className={styles.tokenList}>
          {
            collectionTokenData.map((token, index) => {
              const tokenId = token.tokenId.toString();
              return (
                <li
                  key={index}
                  onClick={() => setPopupTokenData(token)}
                >
                  <div>
                    <img src={`https://cdn.opendevs.io/tokens/public/thumbnails/${tokenId}.jpg`} alt={`Token ${tokenId} thumbnail`} loading="lazy" />
                  </div>
                  <span>#{tokenId}</span>
                </li>
              )
            })
          }
        </ul>
      }

      {(collectionTokenData && collectionTokenData.length === 0) && 
        <p className={styles.noResults}>No results</p>
      }

      {(popupTokenData !== undefined) &&
        <TokenPopupCard
          token={popupTokenData}
          callback={() => setPopupTokenData(undefined)}
        />
      }
    </>);
};

export default TokensListComponent;

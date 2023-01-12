import styles from './UserTokensComponent.module.scss';

import { useEffect, useMemo, useState } from 'react';

import { useCollectionContext } from '../../scripts/CollectionContext';
import { TokenData } from '../../scripts/utils/Aux';
import UserTokenElement from './UserTokenElement';
import TokenPopupCard from '../TokenPopupCard';

interface Props {
  queryParam: string;
}

const UserTokensComponent = ({ queryParam }: Props) => {
  const [ queriedTokens, setQueriedTokens ] = useState<TokenData[]>();
  const [ popupTokenData, setPopupTokenData ] = useState<TokenData>();
  const [ isAllSelected, setIsAllSelected ] = useState<boolean>(false);
  const [ hiddenSelectedTokens, setHiddenSelectedTokens ] = useState<boolean>();

  const queriedIds = useMemo(() => {
    if (queriedTokens) {
      return queriedTokens.map(value => value.tokenId.toNumber());
    }
  },[queriedTokens]);

  const {
    userWallet,
    setAllSelectedTokens,
  } = useCollectionContext();

  useEffect(() => {
    if (userWallet.tokensData) {
      setQueriedTokens(userWallet.tokensData.filter((token) => {
        if (queryParam.length === 0 || token.tokenId.toString().includes(queryParam)) {
          return token;
        }
      }));

      return;
    }

    setQueriedTokens(undefined);
  }, [userWallet.tokensData, queryParam]);

  useEffect(() => {
    if (userWallet.tokensData) {
      const selectedTokens = userWallet.tokensData.filter((token) => !token.tokenBalance.eq(0));

      if (selectedTokens.length === 0) {
        setIsAllSelected(false);
        return;
      }

      setIsAllSelected(userWallet.selectedTokens.length === selectedTokens.length);
    }
  }, [userWallet.selectedTokens]);

  useEffect(() => {
    if(queriedIds && userWallet.selectedTokens.length !== 0) {
      const isSelectedVisible = userWallet.selectedTokens.every(val => {
        if (!queriedIds.includes(val)) {
          return false;
        }

        return true;
      });

      setHiddenSelectedTokens(!isSelectedVisible);
    }
  }, [userWallet.selectedTokens, queriedTokens]);

  return (
    <>
    {queriedTokens &&
      <>
        {hiddenSelectedTokens &&
          <span className={styles.filtersNotification}>Some selected tokens are hidden by your search filters!</span>
        }
        <div className={styles.tokenListHeader}>
          <input
            className={styles.selectAll}
            type="checkbox"
            checked={isAllSelected}
            onChange={(e) => setAllSelectedTokens(e.target.checked)}
            disabled={userWallet.tokensData?.filter((token) => !token.tokenBalance.eq(0)).length === 0}
            title={`${isAllSelected ? 'Deselect' : 'Select'} all`}
          />
          <span className={styles.hideable}>Open Dev</span>
          <span>ID</span>
          <span>Balance</span>
          <span>Received</span>
        </div>
        <ul className={styles.userTokensList}>
          {queriedTokens.map((token, key) => {
            return <UserTokenElement key={key} token={token} popupCallback={() => setPopupTokenData(token)} />
          })}

        </ul>
        {(queriedTokens.length === 0 && userWallet.tokensData?.length !== 0 )&&
          <span className={styles.noTokenMatch}>No tokens match the search!</span>
        }
      </>}
      {(popupTokenData !== undefined) &&
        <TokenPopupCard
          token={popupTokenData}
          callback={() => setPopupTokenData(undefined)}
        />
      }
    </>);
};

export default UserTokensComponent;

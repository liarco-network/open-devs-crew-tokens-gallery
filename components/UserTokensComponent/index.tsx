import styles from './UserTokensComponent.module.scss';

import { useEffect, useMemo, useState } from 'react';

import { useCollectionContext } from '../../scripts/CollectionContext';
import { TokenData } from '../../scripts/utils/Aux';
import UserTokenElement from './UserTokenElement';

interface Props {
  queryParam: string;
}

const UserTokensComponent = ({ queryParam }: Props) => {
  const [ queriedTokens, setQueriedTokens ] = useState<TokenData[]>();
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
      setIsAllSelected(userWallet.selectedTokens.length === userWallet.tokensData.length);
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
          <span className={styles.filtersNotification}>Some tokens are hidden by your filters!</span>
        }
        <div className={styles.tokenListHeader}>
          <div className={styles.selectAll}>
            <input
              type="checkbox"
              checked={isAllSelected}
              onChange={(e) => setAllSelectedTokens(e.target.checked)}
              title={`${isAllSelected ? 'Deselect' : 'Select'} all`}
            />
          </div>
          <span>Thumbnail</span>
          <span>ID</span>
          <span>Balance</span>
          <span>Owned since</span>
        </div>
        <ul className={styles.userTokensList}>
          {queriedTokens.map((token, key) => {
            return <UserTokenElement key={key} token={token} />
          })}

        </ul>
        {(queriedTokens.length === 0 && userWallet.tokensData?.length !== 0 )&&
          <span className={styles.noTokenMatch}>No token matches the search!</span>
        }
      </>}
    </>);
};

export default UserTokensComponent;

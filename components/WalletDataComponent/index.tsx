import styles from './WalletDataComponent.module.scss';

import { useState } from 'react';
import { useDebounce } from 'use-debounce';

import UserInfoWidget from '../UserInfoWidget';
import UserTokensComponent from '../UserTokensComponent';
import WithdrawPopup from '../WithdrawPopup';

const WalletDataComponent = () => {
  const [ isUserWithdrawing, setIsUserWithdrawing ] = useState(false);
  const [ collectionQuery, setCollectionQuery ] = useState("");
  const [ debouncedCollectionQuery ] = useDebounce(collectionQuery, 200);

  return (
    <>
      <div className={styles.tokensList}>
        <div className={styles.widgets}>
          <UserInfoWidget openPopupCallback={() => setIsUserWithdrawing(true)} />
          <input
            className={styles.searchBar}
            placeholder='Search Token ID'
            type={'number'}
            value={collectionQuery}
            onChange={(e) => setCollectionQuery(e.target.value)}
            />
        </div>

        <UserTokensComponent
          queryParam={debouncedCollectionQuery}
        />
      </div>

      {isUserWithdrawing &&
        <WithdrawPopup closePopupCallback={() => setIsUserWithdrawing(false)} />
      }
    </>
  )
}

export default WalletDataComponent;

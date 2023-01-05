import styles from './CustomConnectButton.module.scss';

import { BiLogIn, BiUnlink, BiUser } from 'react-icons/bi';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import React from 'react';

const CustomConnectButton = () => {
  return (
    <ConnectButton.Custom>
      {({
        account,
        chain,
        openAccountModal,
        openChainModal,
        openConnectModal,
        authenticationStatus,
        mounted,
      }) => {
        const ready = mounted && authenticationStatus !== 'loading';
        const connected =
          ready &&
          account &&
          chain &&
          (!authenticationStatus ||
            authenticationStatus === 'authenticated');

        return (
          <React.Fragment>
            {(() => {
              if (!connected) {
                return (
                  <button className={styles.connectWalletButton} onClick={openConnectModal} type="button">
                    <BiLogIn /> <span>Connect</span>
                  </button>
                );
              }

              if (chain.unsupported) {
                return (
                  <button className={styles.wrongNetworkButton} onClick={openChainModal} type="button">
                    <BiUnlink /> <span>Wrong network</span>
                  </button>
                );
              }

              return (
                <button className={styles.connectedButton} onClick={openAccountModal} type="button">
                  <BiUser /> <span>{account.displayName}</span>
                </button>
              );
            })()}
          </React.Fragment>
        );
      }}
    </ConnectButton.Custom>
  );
};

export default CustomConnectButton;

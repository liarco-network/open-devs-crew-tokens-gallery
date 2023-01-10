import styles from './CustomConnectButton.module.scss';

import { BiLogIn, BiUnlink, BiUser } from 'react-icons/bi';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import React from 'react';
import Button from '../Button';

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
                  <Button className={styles.connectWalletButton} onClick={openConnectModal}>
                    <BiLogIn /> <span>Connect</span>
                  </Button>
                );
              }

              if (chain.unsupported) {
                return (
                  <Button className={styles.wrongNetworkButton} onClick={openChainModal}>
                    <BiUnlink /> <span>Wrong network</span>
                  </Button>
                );
              }

              return (
                <Button className={styles.connectedButton} onClick={openAccountModal}>
                  <BiUser /> <span>{account.displayName}</span>
                </Button>
              );
            })()}
          </React.Fragment>
        );
      }}
    </ConnectButton.Custom>
  );
};

export default CustomConnectButton;

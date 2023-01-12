import { ReactNode } from 'react';

import AdvancedLink from '../AdvancedLink';

import EtherscanLogo from '../../../assets/images/icons/etherscan.svg';

interface Props {
  txAddress: string;
  children?: ReactNode;
}

const TransactionLinkEtherscan = ({ txAddress, children }: Props) => {
  return <AdvancedLink href={`https://www.etherscan.io/tx/${txAddress}`} target="_blank" title="View on Etherscan">
    {children === undefined ? <EtherscanLogo /> : children}
  </AdvancedLink>;
};

export default TransactionLinkEtherscan;

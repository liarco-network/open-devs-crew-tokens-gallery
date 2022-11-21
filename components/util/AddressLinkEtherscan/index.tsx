import { ReactNode } from 'react';

import AdvancedLink from '../AdvancedLink';

import EtherscanLogo from '../../../assets/images/icons/etherscan.svg';

interface Props {
  address: string;
  children?: ReactNode;
}

const AddressLinkEtherscan = ({ address, children }: Props) => {
  return <AdvancedLink href={`https://www.etherscan.io/address/${address}`} target="_blank" title="View on Etherscan">
    {children === undefined ? <EtherscanLogo /> : children}
  </AdvancedLink>;
};

export default AddressLinkEtherscan;

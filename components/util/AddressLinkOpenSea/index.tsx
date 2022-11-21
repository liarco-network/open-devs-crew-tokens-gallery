import { ReactNode } from 'react';

import AdvancedLink from '../AdvancedLink';

import EtherscanLogo from '../../../assets/images/icons/opensea.svg';

interface Props {
  address: string;
  children?: ReactNode;
}

const AddressLinkOpenSea = ({ address, children }: Props) => {
  return <AdvancedLink href={`https://www.opensea.io/${address}`} target="_blank" title="View on OpenSea">
    {children === undefined ? <EtherscanLogo /> : children}
  </AdvancedLink>;
};

export default AddressLinkOpenSea;

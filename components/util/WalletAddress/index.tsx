import styles from './WalletAddress.module.scss';

import CopyIcon from '../../../assets/images/icons/copy.svg';

interface Props {
  address: string;
}

const WalletAddress = ({ address }: Props) => {
  return <button className={styles.walletAddress} onClick={() => navigator.clipboard.writeText(address)} title="Copy to clipboard"><span>{address}</span> <CopyIcon /></button>;
};

export default WalletAddress;

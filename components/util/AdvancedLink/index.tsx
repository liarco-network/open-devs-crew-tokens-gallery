import styles from './AdvancedLink.module.scss';

import { ReactNode } from 'react';

interface Props {
  href: string;
  target?: '_blank';
  title?: string;
  children: ReactNode;
}

const AdvancedLink = ({ href, target, title, children }: Props) => {
  return <a className={styles.advancedLink} href={href} target={target} rel={target === undefined ? undefined : 'noreferrer'} title={title}>{children}</a>;
};

export default AdvancedLink;

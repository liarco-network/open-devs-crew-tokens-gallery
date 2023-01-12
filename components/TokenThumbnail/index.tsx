import styles from './TokenThumbnail.module.scss';

interface Props {
  tokenId: number|string;
  className?: string;
  callback?: () => void;
}

const TokenThumbnail = ({ tokenId, className, callback }: Props) => {
  const thumbnailClassnames = undefined !== callback ? [styles.thumbnail, styles.hoverable].join(' ') : styles.thumbnail;
  const classNames = className ? [thumbnailClassnames, className].join(' ') : thumbnailClassnames;

  return (
    <img
        className={classNames}
        src={`https://cdn.opendevs.io/tokens/public/thumbnails/${tokenId}.jpg`}
        alt={`Token ${tokenId} thumbnail`}
        loading="lazy"
        onClick={callback}
      />
  )
}

export default TokenThumbnail;

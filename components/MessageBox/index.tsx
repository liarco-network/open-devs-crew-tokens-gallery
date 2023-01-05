import styles from './MessageBox.module.scss';

interface Props {
  title: string;
  message: string;
}

const MessageBox = ({title, message}: Props) => {
  return (
    <div className={styles.messageBox}>
      <h2>{title}</h2>
      <span>{message}</span>
    </div>
  )
}

export default MessageBox;

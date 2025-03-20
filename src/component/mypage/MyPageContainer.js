import styles from './MyPageContainer.module.css';

const MyPageContainer = ({ children }) => {
  return (
    <div className={styles.container}>
      {children}
    </div>
  );
}

export default MyPageContainer;
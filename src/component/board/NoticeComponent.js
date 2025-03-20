import { Outlet } from 'react-router-dom';
import styles from './NoticeComponent.module.css';

const NoticeComponent = () => {
  return (
    <div className={styles.contentWrap}>
      <div className={styles.titleWrap}>
        <h2 className={styles.boardTitle}>공지사항</h2>
        <h3 className={styles.boardSubtitle}>픽앤딜의 새로운 소식들과 유용한 정보들을 한 곳에서 확인하세요.</h3>
      </div>
      <div className={styles.boardContainer}>
        <Outlet />
      </div>
    </div>
  );
}

export default NoticeComponent;
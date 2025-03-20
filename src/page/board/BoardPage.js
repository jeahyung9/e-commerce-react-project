import { Outlet } from 'react-router-dom';
import BoardSideBar from '../../component/board/BoardSideBar';
import styles from './BoardPage.module.css';

const BoardPage = () => {
  return (
    <div className={styles.wrap}>
      <div className={styles.sidebar}>
        <BoardSideBar />
      </div>
      <div className={styles.content}>
        <Outlet />
      </div>
    </div>
  );
}

export default BoardPage;
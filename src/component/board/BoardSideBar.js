import { useLocation, useNavigate } from 'react-router-dom';
import classNames from 'classnames';
import styles from './BoardSideBar.module.css';
import { ArrowForwardIosRounded } from '@mui/icons-material';

const BoardSideBar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  
  return (
    <aside className={styles.sidebarContainer}>
      <h1 className={styles.sidebarTitle}>고객센터</h1>
      <ul className={styles.sidebarBox}>
        <li
          onClick={() => {navigate('/board/notice')}}
          className={classNames(
            styles.sidebarMenu,
            {[styles.selected]: location.pathname.includes('/board/notice')}
          )}
        >
          <span>공지사항</span>
          <ArrowForwardIosRounded />
        </li>
        <hr className={styles.divider} />
        <li
          onClick={() => {navigate('/board/faq')}}
          className={classNames(
            styles.sidebarMenu,
            {[styles.selected]: location.pathname.includes('/board/faq')}
          )}
        >
          <span>자주 묻는 질문</span>
          <ArrowForwardIosRounded />
        </li>
      </ul>
    </aside>
  );
};

export default BoardSideBar;

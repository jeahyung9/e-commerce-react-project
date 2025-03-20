import classNames from 'classnames';
import Header from '../../component/header/BasicHeader';
import SideBar from '../../component/sideBar/BasicSideBar';
import Footer from '../../component/footer/BasicFooter';
import styles from './BasicLayout.module.css';
import { Outlet } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { IconButton } from '@mui/material';
import { VerticalAlignTopRounded } from '@mui/icons-material';

const BasicLayout = () => {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 94) {
        // 스크롤 위치 94px 이상일 때
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll); // 스크롤 이벤트 리스너 추가

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []); // 빈 배열을 넣어 컴포넌트 마운트/언마운트 시에만 실행

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div id="wrap">
      <Header />

      <main
        className={classNames(styles.main, { [styles.scrolled]: isScrolled })}
      >
        <Outlet />
        <aside className={styles.aside}>
          <SideBar />
        </aside>
      </main>

      <footer className={styles.footer}>
        <Footer />
      </footer>
      
      <div className={classNames(
        styles.topBtnWrap,
        { [styles.visible]: isScrolled },
      )}>
        <IconButton onClick={scrollToTop} className={styles.topBtn}>
          <VerticalAlignTopRounded />
        </IconButton>
      </div>
    </div>
  );
};

export default BasicLayout;

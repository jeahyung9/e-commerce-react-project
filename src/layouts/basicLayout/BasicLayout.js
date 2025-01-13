import classNames from 'classnames';
import Header from '../../components/header/BasicHeader';
import SideBar from '../../components/sideBar/BasicSideBar';
import Footer from '../../components/footer/BasicFooter';
import styles from './BasicLayout.css';
import { useEffect, useState } from 'react';
import { Outlet } from 'react-router-dom';

const BasicLayout = () => {
  const cn = classNames.bind(styles);
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

  return (
    <div id="wrap">
      <header className={cn({ scrolled: isScrolled })}>
        <Header />
      </header>

      <main className={cn({ scrolled: isScrolled })}>
        <Outlet />
        <aside>
          <SideBar />
        </aside>
      </main>

      <footer>
        <Footer />
      </footer>
    </div>
  );
};

export default BasicLayout;

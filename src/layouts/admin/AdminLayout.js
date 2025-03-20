import { useEffect, useState } from 'react';
import styles from './AdminLayout.module.css';
import { AdminDashboardPage } from '../../page/admin/AdminDashboardPage';
import { AdminUserManagePage } from '../../page/admin/AdminUserMangePage';
import { AdminProductManagePage } from '../../page/admin/AdminProductManagePage';
import { AdminNoticeListPage } from '../../page/admin/notice/AdminNoticeListPage';
import { AdminFaqListPage } from '../../page/admin/faq/AdminFaqListPage';
import { Button, IconButton } from '@mui/material';
import {
  DashboardRounded,
  ManageAccountsRounded,
  AllInboxRounded,
  NoteAltRounded,
  QuizRounded,
  LogoutRounded,
  MenuOpenRounded,
} from '@mui/icons-material';
import classNames from 'classnames';
import { useLocation, useNavigate } from 'react-router-dom';
import { AdminNoticeDetailPage } from '../../page/admin/notice/AdminNoticeDetailPage';
import { AdminFaqDetailPage } from '../../page/admin/faq/AdminFaqDetailPage';
import AdminFaqAddPage from '../../page/admin/faq/AdminFaqAddPage';
import AdminFaqModifyPage from '../../page/admin/faq/AdminFaqModifyPage';
import useCustomLogin from '../../hooks/useCustomLogin';
import AdminNoticeAddPage from '../../page/admin/notice/AdminNoticeAddPage';
import { AdminNoticeModifyPage } from '../../page/admin/notice/AdminNoticeModifyPage';
import SellerDashBoard from '../../page/seller/SellerDashboard';
import SellerProductManagePage from '../../page/seller/SellerProductManagePage';
import SellerOrderManagePage from '../../page/seller/SellerOrderManagePage';
import SellerOrderListPage from '../../page/seller/SellerOrderListPage';
import SellerProductDetail from '../../page/seller/SellerProductDetail';
import SellerProductAddPage from '../../page/seller/SellerProductAddPage';
import SellerProductModifyPage from '../../page/seller/SellerProductModifyPage';

// 메뉴 항목 데이터 배열
const adminNavigationLinks = [
  {
    name: 'dashboard',
    label: '대시보드',
    page: <AdminDashboardPage />,
    icon: <DashboardRounded />,
  },
  {
    name: 'userManage',
    label: '유저 관리',
    page: <AdminUserManagePage />,
    icon: <ManageAccountsRounded />,
  },
  {
    name: 'productManage',
    label: '상품 관리',
    page: <AdminProductManagePage />,
    icon: <AllInboxRounded />,
  },
  {
    name: 'notice',
    label: '공지사항',
    page: <AdminNoticeListPage />,
    icon: <NoteAltRounded />,
  },
  {
    name: 'faq',
    label: 'FAQ',
    page: <AdminFaqListPage />,
    icon: <QuizRounded />,
  },
];

const sellerNavigationLinks = [
  {
    name: 'sellerDashboard',
    label: '대쉬보드',
    page: <SellerDashBoard />,
    icon: <DashboardRounded />,
  },
  {
    name: 'sellerProductManage',
    label: '상품관리',
    page: <SellerProductManagePage />,
    icon: <AllInboxRounded />,
  },
  {
    name: 'sellerOrderManage',
    label: '주문관리',
    page: <SellerOrderListPage />,
    icon: <NoteAltRounded />,
  },
];

const AdminLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [activeNav, setActiveNav] = useState('dashboard');
  const [slideInNav, setSlideInNav] = useState(false);
  const [currentUser, setCurrentUser] = useState('');
  const [navLinks, setNavLinks] = useState([]);
  const { isLogin, doAdminLogout, doSellerLogout } = useCustomLogin();
  const nno = location.state?.nno;
  const fno = location.state?.fno;
  const addFaq = location.state?.addFaq;
  const addNotice = location.state?.addNotice;
  const modifyFaq = location.state?.modifyFaq;
  const modifyNotice = location.state?.modifyNotice;
  const faqData = location.state?.faq;
  const noticeData = location.state?.notice;
  const pno = location.state?.pno;
  const addProduct = location.state?.addProduct;
  const modifyProduct = location.state?.modifyProduct;
  const productData = location.state?.product;

  const handleClickNav = (navName) => {
    setActiveNav(navName);
    navigate(``);
  };

  const handleClickBurger = () => {
    setSlideInNav(true);
  };

  const handleClickNavBg = () => {
    setSlideInNav(false);
  };

  const handleAdminLogout = () => {
    doAdminLogout();
    alert('관리자 로그아웃');
    navigate('/admin/login');
  };

  const handleSellerLogout = () => {
    doSellerLogout();
    alert('판매자 로그아웃');
    navigate('/seller/login');
  };

  useEffect(() => {
    if (location.pathname.includes(`/admin`)) {
      setCurrentUser('admin');
    } else if (location.pathname.includes(`/seller`)) {
      setCurrentUser('seller');
    } else {
      alert('접근할 수 있는 권한이 없습니다.');
    }
  }, [location.pathname, setCurrentUser]);

  useEffect(() => {
    if (currentUser === 'admin') {
      setNavLinks(adminNavigationLinks);
    } else if (currentUser === 'seller') {
      setNavLinks(sellerNavigationLinks);
    }
  }, [currentUser]);

  return (
    <div className={styles.adminWrap}>
      <div
        className={classNames(styles.adminNavWrap, {
          [styles.slideIn]: slideInNav,
        })}
      >
        <nav className={styles.adminNav}>
          <ul>
            {navLinks.map((navItem) => (
              <>
                <li key={navItem.name}>
                  <Button
                    className={classNames(styles.navButton, {
                      [styles.active]: activeNav === navItem.name,
                    })}
                    onClick={() => handleClickNav(navItem.name)}
                    color={activeNav === navItem.name ? 'white' : 'textGray'}
                  >
                    {navItem.icon}
                    <span className={styles.label}>{navItem.label}</span>
                  </Button>
                </li>
                <div className={styles.navDivide}></div>
              </>
            ))}
            <Button
              className={styles.logout}
              color="red"
              variant="contained"
              disableElevation
              onClick={() => {
                if (currentUser === 'admin') {
                  handleAdminLogout();
                } else if (currentUser === 'seller') {
                  handleSellerLogout();
                }
              }}
            >
              <LogoutRounded />
              <span className={styles.label}>로그아웃</span>
            </Button>
          </ul>
        </nav>
      </div>
      <div
        className={classNames(styles.slideInBg, {
          [styles.slideIn]: slideInNav,
        })}
        onClick={handleClickNavBg}
      ></div>
      <div className={styles.adminPageWrap}>
        <div className={styles.topBar}>
          <div className={styles.burgerNameWrap}>
            <div className={styles.burgerMenuSpace}>
              <IconButton
                className={styles.burgerMenu}
                onClick={handleClickBurger}
                size="large"
              >
                <MenuOpenRounded fontSize="large" />
              </IconButton>
            </div>
            <span className={styles.adminPageName}>
              {/* 현재 페이지 제목 표시 (optional chaining 사용) */}
              {navLinks.find((nav) => nav.name === activeNav)?.label}
            </span>
          </div>
          <Button
            className={styles.toMain}
            color="textBlack"
            variant="contained"
            disableElevation
            href="/"
          >
            메인으로
          </Button>
        </div>
        {/* 현재 페이지 컴포넌트 렌더링 (optional chaining 사용) */}
        <div className={styles.pageWrap}>
          <div className={styles.pageContainer}>
            {currentUser === 'admin' && (
              <>
                {nno ? (
                  <AdminNoticeDetailPage />
                ) : addNotice ? (
                  <AdminNoticeAddPage />
                ) : modifyNotice && noticeData ? (
                  <AdminNoticeModifyPage />
                ) : fno ? (
                  <AdminFaqDetailPage />
                ) : addFaq ? (
                  <AdminFaqAddPage />
                ) : modifyFaq && faqData ? (
                  <AdminFaqModifyPage />
                ) : (
                  navLinks.find((nav) => nav.name === activeNav)?.page
                )}
              </>
            )}

            {currentUser === 'seller' && (
              <>
                {pno ? (
                  <SellerProductDetail />
                ) : addProduct ? (
                  <SellerProductAddPage />
                ) : modifyProduct && productData ? (
                  <SellerProductModifyPage />
                ) : (
                  navLinks.find((nav) => nav.name === activeNav)?.page
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminLayout;

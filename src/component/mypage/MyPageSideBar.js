import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { getMember } from '../../api/MemberApi';
import { useNavigate, useLocation } from 'react-router-dom';
import styles from './MyPageSideBar.module.css';
import { List, ListItem, ListSubheader, ListItemButton, ListItemIcon, ListItemText, Divider } from '@mui/material';
import { ReceiptLongRounded, FavoriteBorderRounded, CreditCardRounded, ReplayRounded,
  ThumbsUpDownRounded, HelpRounded, LocalShippingRounded, ManageAccountsRounded } from '@mui/icons-material';
import useCustomLogin from '../../hooks/useCustomLogin';
import MyPageContainer from './MyPageContainer';
import classNames from 'classnames';

const MyPageSideBar = () => {
  const userData = useSelector((state) => state.LoginSlice);      //Redux 에서 로그인된 사용자 데이터
  const [userName, setUserName] = useState('');                   //사용자 이름 상태 설정
  const [ info, setInfo ] = useState([]);                         //회원정보 저장 할 상태
  const navigate = useNavigate();                                 //페이지 이동 함수
  const location = useLocation();                                 //현재 경로 확인
  const [selectedIndex, setSelectedIndex] = useState(0);
  const { isLogin } = useCustomLogin();

  const pageIndices = {
    "order": 0,
    "wishlist": 1,
    "payment-method": 2,
    "return": 3,
    "review": 4,
    "qa": 5,
    "addr": 6,
    "info" : 7,
    "modify" : 7.
  };

  useEffect(() => {
    if(!isLogin){
      navigate("/");
    }
  }, [isLogin]);

  useEffect(() => {
    console.log(userData);
    // getMember API를 사용하여 userData.email을 기반으로 회원 정보를 가져옴
    if(userData.email){
      getMember(userData.email).then(data => setInfo(data));         //해당 값을 info 상태에 저장
    }
  }, [userData])                                                   //userData 변경 될 때마다 실행

  useEffect(() => {
      console.log(JSON.stringify(info));
    }, [info]);                                                     //info 가 변경 될 때마다 실행

  useEffect(() => {
     // info에 사용자 이름이 존재하면 해당 이름을 userName 상태에 저장
    if (info && info.m_name) {
      setUserName(info.m_name);
    }
  }, [userData]);                                                   //userData가 변경될 때마다 실행됨

  useEffect(() => {
    const path = location.pathname.split("/").pop();
    setSelectedIndex(pageIndices[path] || 0);
  }, [location]);

  const moveToPage = (page, index) => {
    if(!info){
      alert("로그인 후에 이용 가능합니다.");
      navigate("../member/login");
      return;
    }
    
    setSelectedIndex(index);
    navigate("../mypage/" + page, {
      state: {mno: info.mno, index: index},
      replace: selectedIndex === index,
    });
  }

  return (
    <MyPageContainer>
      <div className={styles.greetings}>
        <h1>
          <span>반가워요!&nbsp;&nbsp;</span>
          <span className={styles.name}>{info.m_name}</span>
          <span>&nbsp;님</span>
        </h1>
        <div className={styles.membershipWrap}>
          <div className={styles.membershipCard}>
            <p className={styles.memberTop}>누적 소비금액</p>
            <p className={styles.memberBot}>
              <span className={styles.typo}>{info.totalPay}</span>
              <span>&nbsp;원</span>
            </p>
          </div>
          <div className={styles.verLine} />
          <div className={styles.membershipCard}>
            <p className={styles.memberTop}>멤버십 등급</p>
            <p className={classNames(styles.typo,
              {[styles.bronze]: info?.membership?.[0] === 'USER'},
              {[styles.silver]: info?.membership?.[0] === 'SILVER'},
              {[styles.gold]: info?.membership?.[0] === 'GOLD'},
              {[styles.platinum]: info?.membership?.[0] === 'PLATINUM'},
            )}>
              {info?.membership?.[0]}
            </p>
          </div>
        </div>
      </div>
      <Divider className={styles.divider} />
      <div className={styles.menuSection}>
        <List component="nav">
          <ListItem disablePadding>
            <ListItemButton
              selected={selectedIndex === 0}
              onClick={() => moveToPage("order", 0)}
              sx={selectedIndex === 0 && {color:"var(--color-main)"}}
            >
              <ListItemIcon sx={{color:"inherit"}}>
                <ReceiptLongRounded className={styles.menuIcon} />
              </ListItemIcon>
              <ListItemText primary="주문내역" />
            </ListItemButton>
          </ListItem>
          <ListItem disablePadding>
            <ListItemButton
              selected={selectedIndex === 1}
              onClick={() => moveToPage("wishlist", 1)}
              sx={selectedIndex === 1 && {color:"var(--color-main)"}}
            >
              <ListItemIcon sx={{color:"inherit"}}>
                <FavoriteBorderRounded className={styles.menuIcon} />
              </ListItemIcon>
              <ListItemText primary="찜한 상품" />
            </ListItemButton>
          </ListItem>
          <Divider className={styles.divider} />
          <ListSubheader>쇼핑</ListSubheader>
          <ListItem disablePadding>
            <ListItemButton
              selected={selectedIndex === 2}
              onClick={() => moveToPage("payment-method", 2)}
              sx={selectedIndex === 2 && {color:"var(--color-main)"}}
            >
              <ListItemIcon sx={{color:"inherit"}}>
                <CreditCardRounded className={styles.menuIcon} />
              </ListItemIcon>
              <ListItemText primary="결제수단/페이" />
            </ListItemButton>
          </ListItem>
          <ListItem disablePadding>
            <ListItemButton
              selected={selectedIndex === 3}
              onClick={() => moveToPage("refund", 3)}
              sx={selectedIndex === 3 && {color:"var(--color-main)"}}
            >
              <ListItemIcon sx={{color:"inherit"}}>
                <ReplayRounded className={styles.menuIcon} />
              </ListItemIcon>
              <ListItemText primary="환불 내역" />
            </ListItemButton>
          </ListItem>
          <ListItem disablePadding>
            <ListItemButton
              selected={selectedIndex === 4}
              onClick={() => moveToPage("review", 4)}
              sx={selectedIndex === 4 && {color:"var(--color-main)"}}
            >
              <ListItemIcon sx={{color:"inherit"}}>
                <ThumbsUpDownRounded className={styles.menuIcon} />
              </ListItemIcon>
              <ListItemText primary="상품 후기" />
            </ListItemButton>
          </ListItem>
          <ListItem disablePadding>
            <ListItemButton
              selected={selectedIndex === 5}
              onClick={() => moveToPage("qa", 5)}
              sx={selectedIndex === 5 && {color:"var(--color-main)"}}
            >
              <ListItemIcon sx={{color:"inherit"}}>
                <HelpRounded className={styles.menuIcon} />
              </ListItemIcon>
              <ListItemText primary="상품 문의" />
            </ListItemButton>
          </ListItem>
          <Divider className={styles.divider} />
          <ListSubheader>내 정보 관리</ListSubheader>
          <ListItem disablePadding>
            <ListItemButton
              selected={selectedIndex === 6}
              onClick={() => moveToPage("addr", 6)}
              sx={selectedIndex === 6 && {color:"var(--color-main)"}}
            >
              <ListItemIcon sx={{color:"inherit"}}>
                <LocalShippingRounded className={styles.menuIcon} />
              </ListItemIcon>
              <ListItemText primary="배송지 관리" />
            </ListItemButton>
          </ListItem>
          <ListItem disablePadding>
            <ListItemButton
              selected={selectedIndex === 7}
              onClick={() => moveToPage("info", 7)}
              sx={selectedIndex === 7 && {color:"var(--color-main)"}}
            >
              <ListItemIcon sx={{color:"inherit"}}>
                <ManageAccountsRounded className={styles.menuIcon} />
              </ListItemIcon>
              <ListItemText primary="개인 정보 수정" />
            </ListItemButton>
          </ListItem>
        </List>
      </div>
    </MyPageContainer>
  );
};

export default MyPageSideBar;

import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import classNames from 'classnames';
import { ReactComponent as CaretDown } from '../../assets/icon/caretDown.svg';
import { ReactComponent as Logo } from '../../assets/img/logo.svg';
import { ReactComponent as Cart } from '../../assets/icon/cart.svg';
import { ReactComponent as Wishlist } from '../../assets/icon/heart.svg';
import {
  getCategoriesByDepth,
  getSubCategories,
} from '../../api/categoriesAPI';
import SearchBar from './SearchBar';
import styles from './Header.module.css';
import { Button, Skeleton } from '@mui/material';
import { HomeRounded } from '@mui/icons-material';
import useCustomLogin from '../../hooks/useCustomLogin';
import { getMember } from '../../api/MemberApi';
import { getCartItems } from '../../api/cartAPI';
import { useAppContext } from '../../context/Context';

const BasicHeader = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isCustomerCenterHovering, setIsCustomerCenterHovering] = useState(false);
  const [depth1Categories, setDepth1Categories] = useState([]);
  const [depth2Categories, setDepth2Categories] = useState({});
  const [depth3Categories, setDepth3Categories] = useState({});
  const [loading, setLoading] = useState(true);
  const { isLogin, loginState, doLogout } = useCustomLogin();
  const [ member, setMember ] = useState();
  const [ alertShown, setAlertShown ] = useState(false);
  const [ isMenu, setIsMenu ] = useState(false);
  const { cartCnt, setCartCnt } = useAppContext();
  
  //let isCnt = location.state?.isCnt || false;

  //const [cartCnt, setCartCnt] = useState(0);

  useEffect(() => {
    const expires = localStorage.getItem("expires");

    const checkCookie = () => {
      const date = new Date();

      const time = expires - date.getTime();
      
      if(time <= 0 && expires && !alertShown){
        localStorage.removeItem("expires");
        window.location.reload();
        alert("로그인 시간이 만료되어 로그아웃됩니다.");
        setAlertShown(true);
      }
    };
    
    const interval = setInterval(checkCookie, 500);

    return () => clearInterval(interval);
  }, [isLogin])

  useEffect(() => {
    const email = loginState.email || loginState.m_email;

    if(isLogin){
      //console.log(loginState);
      
      if(email){
        getMember(email).then(data => {
          setMember(data);
        });
      }
    }else{
     // setCartCnt(0);
      setMember();
    }
  }, [isLogin])

  useEffect(() => {
    //console.log(member);
    if(member){
      getCartItems(member?.mno).then(data => {
          setCartCnt(data.length);
      });
    }
  }, [member])

  // useEffect(() => {
  //   if(isCnt){
  //     if(member){
  //       getCartItems(member.mno).then(data => {
  //         setCartCnt(data.length);
  //       });
  //     }
  //   }
  // }, [isCnt])

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

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        //depth1 카테고리 로드
        const depth1Data = await getCategoriesByDepth(1);
        setDepth1Categories(depth1Data);

        // 각 depth1의 하위 카테고리(depth2) 로드
        const depth2Data = {};
        for (const depth1 of depth1Data) {
          const subCategories = await getSubCategories(depth1.ctno);
          depth2Data[depth1.ctno] = subCategories;

          // 각 depth2의 하위 카테고리(depth3) 로드
          const depth3Data = {};
          for (const depth2 of subCategories) {
            const subSubCategories = await getSubCategories(depth2.ctno);
            depth3Data[depth2.ctno] = subSubCategories;
          }
          setDepth3Categories((prev) => ({ ...prev, ...depth3Data }));
        }
        setDepth2Categories(depth2Data);
      } catch (error) {
        console.error('카테고리 로딩 실패:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  const menuData = depth1Categories.map((depth1) => ({
    ctno: depth1.ctno,
    name: depth1.cateName,
    subMenu: depth2Categories[depth1.ctno]?.map((depth2) => ({
      ctno: depth2.ctno,
      name: depth2.cateName,
      subMenu: depth3Categories[depth2.ctno]?.map((depth3) => ({
        ctno: depth3.ctno,
        name: depth3.cateName,
      })),
    })),
  }));

  const handleCategoryClick = (category, depth, parentInfo) => {
    let state = {
      selectedDepth: depth,
      categories: {
        depth1: depth >= 1 ? parentInfo?.depth1 || category : null,
        depth2: depth >= 2 ? parentInfo?.depth2 || category : null,
        depth3: depth === 3 ? category : null,
      },
      mno : member?.mno,
    };
    console.log(state);
    

    navigate('/product/list', { state });
  };

  const handleMenuClick = (sort) => {
    const state = {
      mno : member?.mno,
      menu: true,
      sortBy: sort,
    };

    setIsMenu(true);

    navigate('/product/list', { state });
  }

  const renderMenu = (menuItems) => {
    if (!menuItems) return <div>카테고리 불러오기 실패함</div>;

    return (
      <ul className={styles.cateLnbDepth1}>
        {menuItems.map((depth1) => (
          <li key={depth1.ctno}>
            <Button
              onClick={() => handleCategoryClick(depth1, 1)}
              className={styles.cate1Btn}
            >
              {depth1.name}
            </Button>
            {depth1.subMenu && (
              <ul className={styles.cateLnbDepth2}>
                {depth1.subMenu.map((depth2) => (
                  <li key={depth2.ctno}>
                    <Button
                      onClick={() =>
                        handleCategoryClick(depth2, 2, {
                          depth1,
                        })
                      }
                    >
                      {depth2.name}
                    </Button>
                    {depth2.subMenu && (
                      <ul className={styles.cateLnbDepth3}>
                        {depth2.subMenu.map((depth3) => (
                          <li key={depth3.ctno}>
                            <Button
                              onClick={() =>
                                handleCategoryClick(depth3, 3, {
                                  depth1,
                                  depth2,
                                })
                              }
                            >
                              {depth3.name}
                            </Button>
                          </li>
                        ))}
                      </ul>
                    )}
                  </li>
                ))}
              </ul>
            )}
          </li>
        ))}
      </ul>
    );
  };

  const handleCustomerCenterMouseEnter = () => {
    setIsCustomerCenterHovering(true);
  };

  const handleCustomerCenterMouseLeave = () => {
    setIsCustomerCenterHovering(false);
  };

  const movePageMember = (page) => {
    if(!member){
      alert("로그인 후에 이용 가능합니다.");
      navigate("../member/login");
      return;
    }else{
      navigate("../" + page, {state: {mno: member?.mno}});
    }
  }

  const handleLogout = () => {
    if(member) {
      doLogout();
      alert("로그아웃되었습니다.");
      navigate('/'); // 로그아웃 후 메인 페이지로 이동
    } else {
      alert("이미 로그아웃된 상태입니다.");
    }
  };

  const handleHome = () => {
    navigate("/", {state: {isHome: true}});
  }

  return (
    <header
      className={classNames(styles.header, { [styles.scrolled]: isScrolled })}
    >
      <div className={styles.headerWrap}>
        <div className={styles.headerTop}>
          <ul>
            {
              isLogin ?
              (
                member ?
                <>
                  <li>
                    <button title="마이페이지로 이동" onClick={() => movePageMember("mypage/order")}>
                      <span>{member?.m_name}&nbsp;님</span>
                      <HomeRounded />
                    </button>
                  </li>
                  <div className={styles.verLine}></div>
                  <li>
                    <button onClick={handleLogout}>로그아웃</button>
                  </li>
                </>
                :
                <></>
              ):
              (
                <>
                  <li>
                    <Link to="/member/join">회원가입</Link>
                  </li>
                  <div className={styles.verLine}></div>
                  <li>
                    <Link to="/member/login">로그인</Link>
                  </li>
                </>
              )
            }
            <div className={styles.verLine}></div>
            <li>
              <div
                className={classNames(styles.customerCenter, {
                  [styles.dropDown]: isCustomerCenterHovering,
                })}
                onMouseEnter={handleCustomerCenterMouseEnter}
                onMouseLeave={handleCustomerCenterMouseLeave}
              >
                <span>고객센터</span>
                <CaretDown />
                <ul className={styles.dropMenu}>
                  <li>
                    <Link to='/board/notice'>공지사항</Link>
                  </li>
                  <li>
                    <Link to='/board/faq'>자주 하는 질문</Link>
                  </li>
                  {/* <li>
                    <Link>1:1 문의</Link>
                  </li> */}
                </ul>
              </div>
            </li>
          </ul>
        </div>
        <div className={styles.headerMid}>
          <button className={styles.logo} onClick={handleHome}>
            <Logo />
          </button>
          <div className={styles.searchIconWrap}>
            <SearchBar 
            isMenu = {isMenu}
            setIsMenu = {setIsMenu}
            />
            <div className={styles.headerIcons}>
              <div onClick={() => movePageMember("mypage/wishlist")} className={styles.iconWrap}>
                <Wishlist className={styles.wishList} />
              </div>
              <div onClick={() => movePageMember("cart")} className={styles.iconWrap}>
                <Cart className={styles.cart} />
                {
                  cartCnt > 0 ?
                  <div className={styles.productCnt}>{cartCnt}</div>:
                  <></>
                }
              </div>
            </div>
          </div>
        </div>
        <div className={styles.headerBotWrap}>
          <nav className={styles.headerBot}>
            <div className={styles.category}>
              <div className={styles.categoryBtn}>
                <div className={styles.burgerMenu}>
                  <div></div>
                  <div></div>
                  <div></div>
                </div>
                <span>카테고리</span>
              </div>
              {loading ? (
                <div className={classNames(styles.cateLnbDepth1, styles.skeletonWrap)}>
                  {[...Array(5)].map((_, index) => (
                    <Skeleton
                      key={index}
                      animation="wave"
                      variant="rounded"
                      height={30}
                      className={styles.cateSkeleton}
                    />
                  ))}
                </div>
              ) : (
                renderMenu(menuData)
              )}
            </div>
            <ul className={styles.gnb}>
              <li className={styles.new}>
                <Button
                  className={styles.menuBtn}
                  color="primary"
                  onClick={() => handleMenuClick("pno")}
                >
                  신상품
                </Button>
              </li>
              <li className={styles.best}>
                <Button
                  className={styles.menuBtn}
                  color="primary"
                  onClick={() => handleMenuClick("p_salesVol")}
                >
                  인기상품
                </Button>
              </li>
              <li className={styles.discount}>
                <Button
                  className={styles.menuBtn}
                  color="primary"
                  onClick={() => handleMenuClick("p_salePer")}
                >
                  알뜰쇼핑
                </Button>
              </li>
              <li className={styles.event}>
                <Button
                  className={styles.menuBtn}
                  color="primary"
                  onClick={() => handleMenuClick("p_salePer")}
                >
                  이벤트
                </Button>
              </li>
            </ul>
            <div className={styles.searchBarSpace}></div>
            <button className={styles.dawnDelivery}>새벽 배송</button>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default BasicHeader;

import { Link } from 'react-router';
import { useState } from 'react';
import classNames from 'classnames';
import { ReactComponent as CaretDown } from '../../assets/icon/caretDown.svg';
import { ReactComponent as Logo } from '../../assets/img/logo.svg';
import { ReactComponent as Heart } from '../../assets/icon/heart.svg';
import { ReactComponent as Cart } from '../../assets/icon/cart.svg';
import menuData from './categories';
import SearchBar from './SearchBar';
import './Header.css';

const BasicHeader = () => {
  const [isCustomerCenterHovering, setIsCustomerCenterHovering] =
    useState(false);

  const renderMenu = (menuItems) => {
    if (!menuItems) return null; // children이 없으면 null 반환

    return (
      <ul className="cateLnbDepth1">
        {menuItems.map((menu) => (
          <li key={menu.id}>
            <Link>{menu.name}</Link>
            {menu.children && (
              <ul className="cateLnbDepth2">
                {/* 이미지가 있을 때만 렌더링 */}
                {menu.image && (
                  <Link className="depth2Image">
                    <img src={menu.image} alt={`${menu.name} 관련 이미지`} />
                  </Link>
                )}
                {menu.children.map((subMenu) => (
                  <li key={subMenu.id}>
                    <Link to={`/products?category=${subMenu.id}`}>
                      {subMenu.name}
                    </Link>
                    {subMenu.children && (
                      <ul className="cateLnbDepth3">
                        {subMenu.children.map((subSubMenu) => (
                          <li key={subSubMenu.id}>
                            <Link to={`/products?category=${subSubMenu.id}`}>
                              {subSubMenu.name}
                            </Link>
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

  return (
    <div className="headerWrap">
      <div className="headerTop">
        <ul>
          <li>
            <Link>회원가입</Link>
          </li>
          <div className="verLine"></div>
          <li>
            <Link to="/member/login">로그인</Link>
          </li>
          <div className="verLine"></div>
          <li>
            <div
              className={classNames('customerCenter', {
                dropDown: isCustomerCenterHovering,
              })}
              onMouseEnter={handleCustomerCenterMouseEnter}
              onMouseLeave={handleCustomerCenterMouseLeave}
            >
              <span>고객센터</span>
              <CaretDown />
              <ul className="dropMenu">
                <li>
                  <Link>공지사항</Link>
                </li>
                <li>
                  <Link>자주 하는 질문</Link>
                </li>
                <li>
                  <Link>1:1 문의</Link>
                </li>
              </ul>
            </div>
          </li>
        </ul>
      </div>
      <div className="headerMid">
        <Link to={'/'} className="logo">
          <Logo />
        </Link>
        <div className="headerIcons">
          <Link className="wishList">
            <Heart />
          </Link>
          <Link className="cart">
            <Cart />
          </Link>
        </div>
      </div>
      <SearchBar />
      <div className="headerBotWrap">
        <nav className="headerBot">
          <div className="category">
            <div className="categoryBtn">
              <div className="burgerMenu">
                <div></div>
                <div></div>
                <div></div>
              </div>
              <span>카테고리</span>
            </div>
            {renderMenu(menuData)}
          </div>
          <ul className="gnb">
            <li className="new">
              <Link to={'/products/list'}>신상품</Link>
            </li>
            <li className="best">
              <Link>인기상품</Link>
            </li>
            <li className="discount">
              <Link>알뜰쇼핑</Link>
            </li>
            <li className="event">
              <Link>이벤트</Link>
            </li>
          </ul>
          <div className="searchBarSpace"></div>
          <button className="dawnDelivery">새벽 배송</button>
        </nav>
      </div>
    </div>
  );
};

export default BasicHeader;

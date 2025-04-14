import classNames from 'classnames';
import { Link } from 'react-router';
import { useEffect, useRef, useState } from 'react';
import { ReactComponent as XButton } from '../../assets/icon/xButton.svg';
import { ReactComponent as Search } from '../../assets/icon/search.svg';
import headerStyles from './Header.module.css';
import { useNavigate, useLocation } from 'react-router-dom';

const SearchBar = ({ useHeaderStyles = true , isMenu, setIsMenu}) => {
  const styles = useHeaderStyles ? headerStyles : null;
  const navigate = useNavigate();
  const location = useLocation();
  const searchInputRef = useRef(null);
  const [ keyword, setKeyword ] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const isHome = location.state?.isHome;
  const isCate = location.state?.isCate;

  useEffect(() => {
    if(isHome){
      //console.log(location);
      searchInputRef.current.value = '';
      navigate("/");
    }
  },[isHome])

  useEffect(() => {
    //console.log(isMenu);
    if(isMenu){
      searchInputRef.current.value = '';
      setIsMenu(false);
    }
  }, [isMenu]);

  useEffect(() => {
    //console.log(isCate);
    if(isCate){
      searchInputRef.current.value = '';
    }
  }, [isCate]);

  const handleSearchInput = (e) => {
    setKeyword(e.target.value);
    if (e.target.value.length > 0) {
      setIsSearching(true);
    } else {
      setIsSearching(false);
    }
  };

  const handleSearchInputReset = () => {
    if (searchInputRef.current) {
      searchInputRef.current.value = '';
    }
    setIsSearching(false);
  };

  const handleSearchList = () => {
    //console.log(keyword);
    navigate("/product/list", {state: {keyword: keyword, searching: true}});
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearchList();
    }
  };

  return (
    <div
      className={classNames(styles.searchBar, {
        [styles.searching]: isSearching,
      })}
    >
      <input
        type="text"
        spellCheck={false}
        placeholder="검색어를 입력해주세요"
        className={styles.searchInput}
        ref={searchInputRef}
        onInput={handleSearchInput}
        onKeyDown={handleKeyPress}
      ></input>
      <div className={styles.deleteBtn} onClick={handleSearchInputReset}>
        <XButton />
      </div>
      <button className={styles.searchBtn} onClick={handleSearchList}>
        <Search />
      </button>
    </div>
  );
};

export default SearchBar;

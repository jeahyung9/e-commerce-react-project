import classNames from 'classnames';
import { Link } from 'react-router';
import { useState } from 'react';
import { ReactComponent as XButton } from '../../assets/icon/xButton.svg';
import { ReactComponent as Search } from '../../assets/icon/search.svg';

const SearchBar = () => {
  const [isSearching, setIsSearching] = useState(false);

  const handleSearchInput = (e) => {
    if (e.target.value.length > 0) {
      setIsSearching(true);
    } else {
      setIsSearching(false);
    }
  };

  const handleSearchInputReset = () => {
    const searchInput = document.querySelector('.searchInput');
    if (searchInput) {
      searchInput.value = '';
      setIsSearching(false);
    }
  };
  return (
    <div
      className={classNames('searchBar', {
        searching: isSearching,
      })}
    >
      <input
        type="text"
        spellCheck={false}
        placeholder="검색어를 입력해주세요"
        className="searchInput"
        onInput={handleSearchInput}
      ></input>
      <div className="deleteBtn" onClick={handleSearchInputReset}>
        <XButton />
      </div>
      <Link className="searchBtn">
        <Search />
      </Link>
    </div>
  );
};

export default SearchBar;

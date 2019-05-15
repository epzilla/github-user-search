import React, { useRef } from 'react';
import './SearchBar.css';

const SearchBar = ({ onSearch, loading }) => {
  const inputRef = useRef(null);

  const onSubmit = (e) => {
    e.preventDefault();
    let val = inputRef.current.value;
    if (val) {
      onSearch(val);
    }
  };

  return (
    <form
      className="search-wrapper"
      onSubmit={onSubmit}>
      <input
        type="search"
        aria-label="Search Github Users"
        autoCapitalize="off"
        autoComplete="off"
        autoCorrect="off"
        autoFocus
        className="user-search"
        disabled={loading}
        placeholder="Search Github Users"
        ref={inputRef} />
      <button className="btn search-btn"
        disabled={loading}
        type="submit">
        Search
      </button>
    </form>
  )
};

export default SearchBar;
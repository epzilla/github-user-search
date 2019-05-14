import React, { useReducer } from 'react';
import './App.css';
import axios from 'axios';
import SearchBar from './SearchBar';
import PaginatedUserList from './PaginatedUserList';

const Actions = {
  SetIsLoading: 0,
  SetResults: 1,
  FailedUserFetch: 2,
};

const reducer = (state, { type, payload }) => {
  switch (type) {
    case Actions.SetIsLoading:
      return { ...state, isLoading: payload };
    case Actions.FailedUserFetch:
      return { ...state, error: true, isLoading: false };
    case Actions.SetResults:
      return { ...state, isLoading: false, users: payload.items, total: payload.total_count };
    default:
      return state;
  }
};

const App = () => {
  const [state, dispatch] = useReducer(reducer, {});
  const { users, isLoading, total } = state;

  const onSearch = async (text) => {
    dispatch({ type: Actions.SetIsLoading, payload: true });
    try {
      let res = await axios.get(`https://api.github.com/search/users?q=${text.replace(/\s/g, '+')}`);
      if (res && res.data) {
        dispatch({ type: Actions.SetResults, payload: res.data });
      }
    }
    catch (e) {
      dispatch({ type: Actions.FailedUserFetch });
      console.error(e);
    }
  };

  return (
    <div className="App">
      <SearchBar
        onSearch={onSearch}
        loading={isLoading}
      />
      <div className="search-results">
        { total === 0 && <h3>Sorry! No users found :(</h3> }
        {
          !!total &&
          <PaginatedUserList
            total={total}
            users={users}
          />
        }
      </div>
    </div>
  );
};

export default App;
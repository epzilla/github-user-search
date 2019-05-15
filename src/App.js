import React, { createContext, useReducer } from 'react';
import './App.css';
import axios from 'axios';
import SearchBar from './components/SearchBar';
import PaginatedUserList from './components/PaginatedUserList';

// Action types to be passed to our reducer
export const Actions = {
  SetIsLoading: 0,
  SetResults: 1,
  FailedUserFetch: 2,
  SetPage: 3,
  RateLimitExceeded: 4
};

const reducer = (state, { type, payload }) => {
  switch (type) {
    case Actions.SetIsLoading:
      return { ...state, isLoading: payload };
    case Actions.FailedUserFetch:
      return { ...state, error: true, isLoading: false, failedToLoadMsg: payload };
    case Actions.SetResults:
      return {
        ...state,
        isLoading: false,
        users: payload.items,
        total: payload.total_count,
        pageCount: payload.pageCount,
        currentPage: payload.currentPage
      };
    case Actions.RateLimitExceeded:
      return { ...state, rateLimitExceeded: true };
    default:
      return state;
  }
};

/**
 * Create a context so we can pass our `dispatch` function and our
 * `rateLimitExceeded` flag down to children without
 * having to pass it multiple levels through props
 */
export const AppContext = createContext(null);

// Main component
const App = () => {
  const [state, dispatch] = useReducer(reducer, {});
  const { users, isLoading, total, currentPage, pageCount, failedToLoadMsg, rateLimitExceeded } = state;

  const onSearch = async (text) => {
    dispatch({ type: Actions.SetIsLoading, payload: true });
    try {
      let res = await axios.get(`https://api.github.com/search/users?q=${text.replace(/\s/g, '+')}`);
      if (res && res.data) {
        let { total_count, items } = res.data;
        let pageCount = 1;
        let currentPage = 1;
        if (total_count > items.length) {
          pageCount = Math.ceil(total_count / items.length);
        }
        dispatch({
          type: Actions.SetResults,
          payload: {
            pageCount,
            currentPage,
            total_count,
            items
          }
        });
      }
    }
    catch (e) {
      dispatch({ type: Actions.FailedUserFetch, payload: e.message });
    }
  };

  const goToPage = (payload) => dispatch({ type: Actions.SetPage, payload });

  return (
    <AppContext.Provider value={{ dispatch, rateLimitExceeded }}>
      <div className="App">
        <SearchBar
          onSearch={onSearch}
          loading={isLoading}
        />
        <div className="search-results">
          {total === 0 && <h3>Sorry! No users found :(</h3>}
          {
            !!total &&
            <PaginatedUserList
              total={total}
              users={users}
              currentPage={currentPage}
              pageCount={pageCount}
              goToPage={goToPage}
            />
          }
          {
            failedToLoadMsg &&
            <h3 className="error-msg">{failedToLoadMsg}</h3>
          }
          {
            rateLimitExceeded &&
            <h3 className="error-msg">
              API Rate limit has been exceeded. Only usernames and avatars will be shown for now.
            </h3>
          }
        </div>
      </div>
    </AppContext.Provider>
  );
};

export default App;
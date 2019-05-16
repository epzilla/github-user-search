import React, { createContext, useReducer, useRef } from 'react';
import ReactPaginate from 'react-paginate';
import './App.css';
import { getUsers, USERS_API_LIMIT, PER_PAGE }from './api';
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
  const searchText = useRef('');
  const exceededUsersLimit = total > USERS_API_LIMIT;

  const goToPage = async (page) => {
    dispatch({ type: Actions.SetIsLoading, payload: true });
    try {
      let payload = await getUsers(searchText.current, page);
      dispatch({ type: Actions.SetResults, payload });
    }
    catch (e) {
      dispatch({ type: Actions.FailedUserFetch, payload: e });
    }
  };

  const onSearch = async (text) => {
    // Save the search text so that we can send another request with it if we change pages later
    searchText.current = text.replace(/\s/g, '+');
    goToPage(1);
  };

  const getResultHeadline = () => {
    if (total === 1) {
      return 'Found 1 User';
    }

    if (total <= PER_PAGE) {
      return `Found ${total} Users`;
    }

    if (currentPage === 1) {
      return `Showing First ${PER_PAGE} of ${exceededUsersLimit ? '1000+' : total} Found Users`;
    }

    if (!exceededUsersLimit && currentPage === pageCount) {
      let startNum = total - users.length + 1;
      return `Showing Users ${startNum} - ${total} of ${total} Found Users`;
    }

    return `Showing Users ${((currentPage - 1) * PER_PAGE) + 1} - ${currentPage * PER_PAGE} of ${exceededUsersLimit ? '1000+' : total} Found Users`;
  };

  return (
    <AppContext.Provider value={{ dispatch, rateLimitExceeded }}>
      <div className="App">
        <div className="fixed-top-row">
          <SearchBar
            onSearch={onSearch}
            loading={isLoading}
          />
          {
            total !== undefined &&
            <h3>{ total === 0 ? 'Sorry! No users found :(' : getResultHeadline() }</h3>
          }
        </div>
        {
          !!total &&
          <PaginatedUserList
            total={total > USERS_API_LIMIT ? USERS_API_LIMIT : total}
            exceededUsersLimit={total > USERS_API_LIMIT}
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
        {
          total > PER_PAGE &&
          <ReactPaginate
            activeClassName="current"
            activeLinkClassName="focused"
            containerClassName="paginated-nav"
            pageCount={pageCount}
            pageRangeDisplayed={5}
            onPageChange={({ selected }) => goToPage(selected + 1)}
          />
        }
      </div>
    </AppContext.Provider>
  );
};

export default App;
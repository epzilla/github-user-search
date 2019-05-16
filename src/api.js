import axios from 'axios';

// These are public GitHub API restrictions
export const USERS_API_LIMIT = 1000;
export const PER_PAGE = 30;
const MAX_PAGES = Math.ceil(USERS_API_LIMIT / PER_PAGE);

export const getUsers = async (searchText, currentPage) => {
  let url = `https://api.github.com/search/users?q=${searchText}`;
  if (currentPage && currentPage > 1) {
    url += `&page=${currentPage}`;
  }
  let res = await axios.get(url);
  if (res && res.data) {
    let { total_count, items } = res.data;

    // If the total count is > the limit, set pageCount to the max number of pages,
    // otherwise, calculate it
    let pageCount = 1;
    if (total_count > PER_PAGE) {
      pageCount = total_count > USERS_API_LIMIT ? MAX_PAGES : Math.ceil(total_count / PER_PAGE);
    }

    return {
      pageCount,
      currentPage,
      total_count,
      items
    };
  }
  else {
    return null;
  }
};
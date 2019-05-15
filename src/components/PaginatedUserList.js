import React from 'react';
import './PaginatedUserList.css';
import ReactPaginate from 'react-paginate';
import Avatar from './Avatar';
import UserInfo from './UserInfo';

const PaginatedUserList = ({ total, users, currentPage, pageCount, goToPage }) => {
  return (
    <>
      <h3>Found {total} {total > 1 ? 'Users' : 'User'}</h3>
      <div className="list-wrapper">
        <ul className="user-list">
          {
            users.map(user => (
              <li
                key={user.id}
                className="user-list-item"
              >
                <Avatar
                  url={user.avatar_url + '&size=50'}
                  link={user.html_url}
                  altText={user.login}
                  title={user.login}
                />
                <UserInfo
                  user={user}
                />
              </li>
            ))
          }
        </ul>
        {
          total > users.length &&
          <ReactPaginate
            activeClassName="current"
            activeLinkClassName="focused"
            containerClassName="paginated-nav"
            pageCount={pageCount}
            pageRangeDisplayed={5}
            onPageChange={goToPage}
          />
        }
      </div>
    </>
  )
};

export default PaginatedUserList;
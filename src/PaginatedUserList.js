import React, { useReducer } from 'react';
import Avatar from './Avatar';
import UserInfo from './UserInfo';

const PaginatedUserList = ({ total, users }) => {
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
      </div>
    </>
  )
};

export default PaginatedUserList;
import React from 'react';
import './PaginatedUserList.css';
import Avatar from './Avatar';
import UserInfo from './UserInfo';

const PaginatedUserList = ({ users }) => {
  return (
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
    </div>
  )
};

export default PaginatedUserList;
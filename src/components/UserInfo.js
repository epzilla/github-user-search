import React, { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import './UserInfo.css';
import { Actions, AppContext } from '../App';

const UserInfo = ({ user }) => {
  const [info, setInfo] = useState(null);
  const { dispatch, rateLimitExceeded } = useContext(AppContext);

  /**
   * Get the detailed information from the API about this user
   * Note, because this is a demo app and we aren't using any authentication,
   * after a few page reloads, we'll start getting 403's because we exceed the rate limit.
   * When that happens, we'll stop bothering with making those requests, and
   * fall back to only showing avatars and usernames
   */
  useEffect(() => {
    if (user && !rateLimitExceeded) {
      axios.get(user.url)
        .then(res => setInfo(res.data))
        .catch(e => {
          if (e.response.status === 403) {
            // Let's check the headers to see if we've exceeded the rate limit
            const { headers } = e.response;
            const remaining = parseInt(headers['x-ratelimit-remaining']);
            if (remaining === 0) {
              // Yup! We exceeded the limit
              if (headers['x-ratelimit-reset']) {
                const resetTime = parseInt(headers['x-ratelimit-reset']) * 1000;
                const countdown = resetTime - Date.now();
                console.debug(
                  `%c[RATE_LIMIT] Oops, made too many API calls. We'll have to wait another ${(countdown / 60000).toFixed(1)} minutes before trying again`,
                  'color: magenta; font-size: 16px'
                );
                dispatch({ type: Actions.RateLimitExceeded, payload: true });
              }
            }
          }
        });
    }
  }, [user, rateLimitExceeded, dispatch]);

  return (
    <div className={`user-info ${rateLimitExceeded ? 'show-less' : ''}`}>
      <div className="flex">
        <h4 className="username" title={user.login}>
          <a className="user-link" href={user.html_url} target="_blank">{user.login}</a>
        </h4>
        {
          info &&
          <>
            <h5 className="user-desc" title={info.name}>{info.name}</h5>
          </>
        }
      </div>
      {
        info &&
        <div className="flex">
          {
            info.location &&
            <div className="flex user-location">
              {/* SVG Taken from GitHub's markup */}
              <svg className="octicon octicon-location" viewBox="0 0 12 16" version="1.1"
                width="12" height="16" aria-hidden="true">
                <path fillRule="evenodd"
                  d="M6 0C2.69 0 0 2.5 0 5.5 0 10.02 6 16 6 16s6-5.98 6-10.5C12 2.5 9.31
                    0 6 0zm0 14.55C4.14 12.52 1 8.44 1 5.5 1 3.02 3.25 1 6 1c1.34 0 2.61.48
                    3.56 1.36.92.86 1.44 1.97 1.44 3.14 0 2.94-3.14 7.02-5 9.05zM8 5.5c0
                    1.11-.89 2-2 2-1.11 0-2-.89-2-2 0-1.11.89-2 2-2 1.11 0 2 .89 2 2z"
                ></path>
              </svg>
              <span>{info.location}</span>
            </div>
          }
          {
            info.bio &&
            <div className="flex">
              <span>{info.bio}</span>
            </div>
          }
          {
            info.email &&
            <div className="flex">
              {/* SVG Taken from GitHub's markup */}
              <svg className="octicon octicon-mail" viewBox="0 0 14 16" version="1.1" width="14"
                height="16" aria-hidden="true">
                <path fillRule="evenodd" d="M0 4v8c0 .55.45 1 1 1h12c.55 0
                  1-.45 1-1V4c0-.55-.45-1-1-1H1c-.55 0-1 .45-1 1zm13 0L7 9 1 4h12zM1 5.5l4
                  3-4 3v-6zM2 12l3.5-3L7 10.5 8.5 9l3.5 3H2zm11-.5l-4-3 4-3v6z"></path>
              </svg>
              <span>{info.email}</span>
            </div>
          }
        </div>
      }
    </div>
  )
};

export default UserInfo;
import React, { useState } from 'react';
import './Avatar.css';

const Avatar = ({ url, link, altText }) => {

  const [didLoad, setDidLoad] = useState(false);
  const [loadFailed, setLoadFailed] = useState(false);

  return (
    <a
      className="avatar-wrapper"
      href={link}
      target="_blank">
      <img
        className="avatar"
        src={url}
        alt={altText}
        width={50}
        onLoad={() => setDidLoad(true)}
        onError={() => setLoadFailed(true)}
      />
    </a>
  )
};

export default Avatar;
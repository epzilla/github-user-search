import React, { useState } from 'react';

const Avatar = ({ url, altText }) => {

  const [didLoad, setDidLoad] = useState(false);
  const [loadFailed, setLoadFailed] = useState(false);

  return (
    <img
      className="avatar"
      src={url}
      alt={altText}
      width={50}
      onLoad={() => setDidLoad(true)}
      onError={() => setLoadFailed(true)}
    />
  )
};

export default Avatar;
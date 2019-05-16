import React from 'react';
import './Avatar.css';

const Avatar = ({ url, link, altText }) => (
  <a
    className="avatar-wrapper"
    href={link}
    target="_blank"
    rel="noopener noreferrer">
    <img
      className="avatar"
      src={url}
      alt={altText}
      width={50}
    />
  </a>
);

export default Avatar;
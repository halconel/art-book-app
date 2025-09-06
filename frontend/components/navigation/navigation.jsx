import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import logoSrc from '../../assets/images/favicon.svg';

const Navigation = () => {
  const location = useLocation();
  const [clickedItem, setClickedItem] = useState(null);

  const isActive = path => {
    return location.pathname === path ? 'active' : '';
  };

  const handleClick = path => {
    setClickedItem(path);
    // Reset after animation
    setTimeout(() => setClickedItem(null), 400);
  };

  const getSeparatorIcon = (path, isClicked) => {
    if (isClicked) {
      return (
        <span className="nav-separator animating">
          <svg
            width="12"
            height="12"
            viewBox="0 0 12 12"
            className="separator-icon"
          >
            <path
              d="M2 2L10 10M2 10L10 2"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>
        </span>
      );
    } else if (location.pathname === path) {
      return (
        <span className="nav-separator">
          <svg
            width="12"
            height="12"
            viewBox="0 0 12 12"
            className="separator-icon"
          >
            <path d="M3 3L9 9L3 3L9 3Z" fill="currentColor" />
          </svg>
        </span>
      );
    } else {
      return (
        <span className="nav-separator">
          <svg
            width="12"
            height="12"
            viewBox="0 0 12 12"
            className="separator-icon"
          >
            <path
              d="M2 10L10 2"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>
        </span>
      );
    }
  };

  return (
    <nav className="navigation">
      <div className="nav-container">
        <Link to="/" className="nav-brand">
          <img src={logoSrc} alt="Logo" className="nav-logo" />
        </Link>

        <ul className="nav-menu">
          <li className={`nav-item ${isActive('/')}`}>
            {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
            <Link to="/" className="nav-link" onClick={() => handleClick('/')}>
              {getSeparatorIcon('/', clickedItem === '/')} HOME
            </Link>
          </li>
          <li className={`nav-item ${isActive('/resume')}`}>
            {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
            <Link
              to="/resume"
              className="nav-link"
              onClick={() => handleClick('/resume')}
            >
              {getSeparatorIcon('/resume', clickedItem === '/resume')}{' '}
              CURRICULUM VITAE
            </Link>
          </li>
          <li className={`nav-item ${isActive('/gallery')}`}>
            {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
            <Link
              to="/gallery"
              className="nav-link"
              onClick={() => handleClick('/gallery')}
            >
              {getSeparatorIcon('/gallery', clickedItem === '/gallery')} ART
              GALLERY
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Navigation;

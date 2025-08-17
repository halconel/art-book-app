import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { connect } from 'react-redux';
import logoSrc from '../../assets/images/favicon.svg';
import SlideshowControls from './slideshow_controls';

const Navigation = ({
  totalImages,
  isPlaying,
  lastChangeTime,
  onPrevious,
  onNext,
  onTogglePlay,
}) => {
  const location = useLocation();

  const isActive = path => {
    return location.pathname === path ? 'active' : '';
  };

  const showControls = location.pathname === '/';

  return (
    <nav className="navigation">
      <div className="nav-container">
        <Link to="/" className="nav-brand">
          <img src={logoSrc} alt="Logo" className="nav-logo" />
          <div className="nav-brand-text">
            <span className="artist-name">Atom Sergal</span>
            <span className="project-name">Beyond Home</span>
          </div>
        </Link>

        {showControls && (
          <SlideshowControls
            totalImages={totalImages}
            isPlaying={isPlaying}
            lastChangeTime={lastChangeTime}
            onPrevious={onPrevious}
            onNext={onNext}
            onTogglePlay={onTogglePlay}
          />
        )}

        <ul className="nav-menu">
          <li className={`nav-item ${isActive('/')}`}>
            <Link to="/" className="nav-link">
              Home
            </Link>
          </li>
          <li className={`nav-item ${isActive('/gallery')}`}>
            <Link to="/gallery" className="nav-link">
              Gallery
            </Link>
          </li>
          <li className={`nav-item ${isActive('/about')}`}>
            <Link to="/about" className="nav-link">
              About
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  );
};

const mapStateToProps = state => ({
  totalImages: Object.values(state.images).length,
});

export default connect(mapStateToProps)(Navigation);

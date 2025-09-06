import React from 'react';
import logoSrc from '../../../assets/images/favicon.svg';
import SlideshowControls from '../../navigation/slideshow_controls';

const ArtistBranding = () => {
  return (
    <div className="artist-branding">
      <div className="bottom-top-gradient-shadow" />
      <div className="artist-branding-block">
        <div className="artist-branding__logo">
          <img
            src={logoSrc}
            alt="Atom.Sergal Logo"
            className="artist-branding__logo-icon"
          />
        </div>

        <div className="artist-branding__content">
          <h1 className="artist-branding__name">ATOM.SERGAL</h1>
          <p className="artist-branding__subtitle">Concept sci-fi Artist</p>
          <p className="artist-branding__tagline">Per aspera Ad astra</p>
        </div>
        <div className="slideshow-controls-bottom-right">
          <SlideshowControls />
        </div>
      </div>
    </div>
  );
};

export default ArtistBranding;

import React from 'react';
import MetadataOverlay from './metadata_overlay';
import ArtistBranding from './artist_branding';

const HeroSlideshow = ({ currentImage, nextImage, isTransitioning }) => {
  return (
    <div className="hero-slideshow">
      <div className="slideshow-container">
        <div
          className={`slide ${!isTransitioning ? 'active' : ''}`}
          style={{
            backgroundImage: `url(${currentImage.img_url})`,
            opacity: isTransitioning ? '0' : '1',
          }}
        />
      </div>
      <div>
        {isTransitioning && nextImage && (
          <div
            className="slide slide-next active"
            style={{
              backgroundImage: `url(${nextImage.img_url})`,
              opacity: isTransitioning ? '1' : '0',
            }}
          />
        )}
        <MetadataOverlay image={isTransitioning ? nextImage : currentImage} />
        <ArtistBranding />
      </div>
    </div>
  );
};

export default HeroSlideshow;

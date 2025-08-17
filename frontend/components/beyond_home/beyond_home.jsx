import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { fetchMainPageImages } from '../../actions/image_actions';
import IntroAnimation from './intro_animation';

const BeyondHome = ({
  images,
  fetchMainPageImages: fetchImages,
  currentImageIndex,
}) => {
  useEffect(() => {
    fetchImages();
  }, [fetchImages]);

  if (!images || images.length === 0) {
    return <div className="beyond-home" />;
  }

  const currentImage = images[currentImageIndex];

  return (
    <div className="beyond-home">
      <div className="hero-slideshow">
        <div className="slideshow-container">
          <div
            className="slide"
            style={{
              backgroundImage: `url(${currentImage.img_url})`,
            }}
          />
        </div>
      </div>
    </div>
  );
};

const mapStateToProps = state => ({
  images: Object.values(state.images),
});

const mapDispatchToProps = dispatch => ({
  fetchMainPageImages: () => dispatch(fetchMainPageImages()),
});

export default connect(mapStateToProps, mapDispatchToProps)(BeyondHome);

import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { fetchMainPageImages } from '../../actions/image_actions';
import IntroAnimation from './intro_animation';

const BeyondHome = ({
  images,
  fetchMainPageImages: fetchImages,
  currentImageIndex,
}) => {
  const [showIntroAnimation, setShowIntroAnimation] = useState(true);
  const [animationStage, setAnimationStage] = useState(0); // 0: logo visible, 1: fade out, 2: scale up, 3: remove

  useEffect(() => {
    fetchImages();
  }, [fetchImages]);

  // Intro animation sequence
  useEffect(() => {
    if (!showIntroAnimation) return;
    if (!images || images.length === 0) return; // Ждем загрузки изображений

    const animationTimeline = [
      { stage: 1, delay: 2000 }, // After 2s, start fade out
      { stage: 2, delay: 3000 }, // After 3s, start scale up and create cutout
      { stage: 3, delay: 5000 }, // After 5s, remove logo
    ];

    const timers = animationTimeline.map(({ stage, delay }) =>
      setTimeout(() => {
        setAnimationStage(stage);
        if (stage === 3) {
          setTimeout(() => {
            setShowIntroAnimation(false);
          }, 1000);
        }
      }, delay)
    );

    return () => timers.forEach(timer => clearTimeout(timer));
  }, [showIntroAnimation, images]);

  if (!images || images.length === 0) {
    return (
      <div className="beyond-home">
        {showIntroAnimation && (
          <IntroAnimation animationStage={animationStage} />
        )}
        <div className="hero-slideshow">
          <div className="slideshow-container">
            <div className="no-images-message">
              <h2>Beyond Home</h2>
              <p>No images available for slideshow</p>
            </div>
          </div>
        </div>
      </div>
    );
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
              '--crop-x':
                currentImage.crop_css_properties?.['--crop-x'] || '50%',
              '--crop-y':
                currentImage.crop_css_properties?.['--crop-y'] || '50%',
              '--crop-width':
                currentImage.crop_css_properties?.['--crop-width'] || '30%',
              '--crop-height':
                currentImage.crop_css_properties?.['--crop-height'] || '30%',
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

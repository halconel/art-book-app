import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { fetchMainPageImages } from '../../actions/image_actions';
import { preloadNextImages } from '../../actions/slideshow_actions';
import HeroSlideshow from './hero/hero_slideshow';
import AboutSection from './about/about_section';
import Footer from './about/footer';

const Home = ({
  images,
  fetchMainPageImages: fetchImages,
  currentImageIndex,
  preloadNextImages: preloadImages,
}) => {
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [nextSlideIndex, setNextSlideIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [preloadInitialized, setPreloadInitialized] = useState(false);

  useEffect(() => {
    fetchImages();
  }, []); // Remove fetchImages from dependencies - only run once on mount

  // Initialize preloading when images are loaded
  useEffect(() => {
    if (images && images.length > 0 && !preloadInitialized) {
      preloadImages();
      setPreloadInitialized(true);
    }
  }, [images?.length, preloadInitialized]); // Only depend on length, not the array itself

  useEffect(() => {
    if (
      currentImageIndex !== currentSlideIndex &&
      images &&
      images.length > 0
    ) {
      setIsTransitioning(true);
      setNextSlideIndex(currentImageIndex);

      setTimeout(() => {
        setCurrentSlideIndex(currentImageIndex);
        setIsTransitioning(false);
      }, 150); // Half of the fade duration
    }
  }, [currentImageIndex, currentSlideIndex, images]);

  if (!images || images.length === 0) {
    return <div className="home" />;
  }

  const currentImage = images[currentSlideIndex];
  const nextImage = images[nextSlideIndex];

  return (
    <div className="home">
      <HeroSlideshow
        currentImage={currentImage}
        nextImage={nextImage}
        isTransitioning={isTransitioning}
      />

      <AboutSection />

      <Footer />
    </div>
  );
};

const mapStateToProps = state => ({
  images: Object.values(state.images),
  currentImageIndex: state.slideshow.currentImageIndex,
});

const mapDispatchToProps = dispatch => ({
  fetchMainPageImages: () => dispatch(fetchMainPageImages()),
  preloadNextImages: () => dispatch(preloadNextImages()),
});

export default connect(mapStateToProps, mapDispatchToProps)(Home);

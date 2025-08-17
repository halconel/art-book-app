import React, { useState, useEffect } from 'react';
import { Route, Routes, Navigate } from 'react-router-dom';
import { connect } from 'react-redux';

import BeyondHomeContainer from './beyond_home/beyond_home_container';
import GalleryContainer from './gallery/gallery_container';
import AboutContainer from './about/about_container';
import Navigation from './navigation/navigation';

const App = ({ images }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [lastChangeTime, setLastChangeTime] = useState(Date.now());

  const handlePrevious = () => {
    if (images && images.length > 0) {
      setCurrentImageIndex(prevIndex =>
        prevIndex === 0 ? images.length - 1 : prevIndex - 1
      );
      setLastChangeTime(Date.now());
    }
  };

  const handleNext = () => {
    if (images && images.length > 0) {
      setCurrentImageIndex(prevIndex => (prevIndex + 1) % images.length);
      setLastChangeTime(Date.now());
    }
  };

  const handleTogglePlay = () => {
    setIsPlaying(!isPlaying);
  };

  // Reset index when images change
  useEffect(() => {
    setCurrentImageIndex(0);
    setLastChangeTime(Date.now());
  }, [images]);

  // Auto-advance slideshow
  useEffect(() => {
    if (!isPlaying || !images || images.length === 0) return;

    const interval = setInterval(() => {
      setCurrentImageIndex(prevIndex => (prevIndex + 1) % images.length);
      setLastChangeTime(Date.now());
    }, 5000); // Change image every 5 seconds

    return () => clearInterval(interval);
  }, [isPlaying, images]);

  return (
    <div className="beyond-home-app">
      <Navigation
        totalImages={images ? images.length : 0}
        isPlaying={isPlaying}
        lastChangeTime={lastChangeTime}
        onPrevious={handlePrevious}
        onNext={handleNext}
        onTogglePlay={handleTogglePlay}
      />

      <main className="main-content">
        <Routes>
          <Route
            path="/"
            element={
              <BeyondHomeContainer
                currentImageIndex={currentImageIndex}
                isPlaying={isPlaying}
                onPrevious={handlePrevious}
                onNext={handleNext}
                onTogglePlay={handleTogglePlay}
              />
            }
          />
          <Route path="/gallery" element={<GalleryContainer />} />
          <Route path="/about" element={<AboutContainer />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
    </div>
  );
};

const mapStateToProps = state => ({
  images: Object.values(state.images),
});

export default connect(mapStateToProps)(App);

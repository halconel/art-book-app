import React from 'react';
import { Route, Routes, Navigate } from 'react-router-dom';

import HomeContainer from './home/home_container';
import GalleryContainer from './gallery/gallery_container';
import AboutContainer from './about/about_container';
import Navigation from './navigation/navigation';
import SlideshowTimer from './slideshow_timer';

const App = () => {
  return (
    <div className="home-app">
      <Navigation />
      <SlideshowTimer />

      <main className="main-content">
        <Routes>
          <Route path="/" element={<HomeContainer />} />
          <Route path="/resume" element={<AboutContainer />} />
          <Route path="/gallery" element={<GalleryContainer />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
    </div>
  );
};

export default App;

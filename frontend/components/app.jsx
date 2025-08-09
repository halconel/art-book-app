import React from 'react';
import { Provider } from 'react-redux';
import { Route, HashRouter, Link, Routes, Navigate } from 'react-router-dom';
import { ConnectedProtectedRoute, ConnectedAuthRoute } from '../util/route_util';

import SessionFormContainer from './session_form/session_form_container';
import GreetingContainer from './greeting/greeting_container';
import SplashContainer from './splash/splash_container';
import ProjectIndexContainer from './projects/project_index_container';
import UserProfileContainer from './user_profile/user_profile_container';
import Footer from './footer/footer';

const App = () => (
  <div>
    <header>
      <Link to="/home" className="header-link"><h1>ArtBook</h1></Link>
      <SessionFormContainer />
    </header>

    <main className="main">
      <Routes>
        <Route path="/" element={
          <ConnectedAuthRoute>
            <SplashContainer />
          </ConnectedAuthRoute>
        } />
        <Route path="/home" element={
          <ConnectedProtectedRoute>
            <ProjectIndexContainer />
          </ConnectedProtectedRoute>
        } />
        <Route path="/users/:id" element={
          <ConnectedProtectedRoute>
            <UserProfileContainer />
          </ConnectedProtectedRoute>
        } />
      </Routes>
    </main>

    <Footer />
  </div>
);

export default App;

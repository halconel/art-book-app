import React from 'react';
import { createRoot } from 'react-dom/client';
import Root from './components/root';
import configureStore from './store/store';
import { fetchImages } from './util/images_api_util';
import initializeAnalytics from './analytics';

document.addEventListener('DOMContentLoaded', () => {
  let store;
  if (window.currentUser) {
    const preloadedState = { session: { currentUser: window.currentUser, errors: [] } };
    store = configureStore(preloadedState);
    initializeAnalytics(store);
    
    delete window.currentUser;
  } else {
    store = configureStore();
  }

  const container = document.getElementById('root');
  const root = createRoot(container);
  root.render(<Root store={store} />);
});

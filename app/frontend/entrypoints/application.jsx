import React from 'react';
import { createRoot } from 'react-dom/client';
import Root from '../../../frontend/components/root';
import configureStore from '../../../frontend/store/store';

// Импорт всех стилей приложения
import '../../../frontend/styles/app.scss';

document.addEventListener('DOMContentLoaded', () => {
  let store;
  if (window.currentUser) {
    const preloadedState = {
      session: { currentUser: window.currentUser, errors: [] },
    };
    store = configureStore(preloadedState);
    delete window.currentUser;
  } else {
    store = configureStore();
  }

  const container = document.getElementById('root');
  if (container) {
    const root = createRoot(container);
    root.render(<Root store={store} />);
  }
});
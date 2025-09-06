import React from 'react';
import { createRoot } from 'react-dom/client';
import Root from './components/root';
import configureStore from './store/store';

// Импорт всех стилей приложения
import './styles/app.scss';


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
  const root = createRoot(container);
  root.render(<Root store={store} />);
});

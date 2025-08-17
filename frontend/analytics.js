/* global analytics */

const initializeAnalytics = store => {
  const { currentUser } = store.getState().session;
  if (currentUser) {
    const userProperties = {
      username: currentUser.username,
    };

    analytics.identify(currentUser.id, userProperties);
  }
};

export default initializeAnalytics;

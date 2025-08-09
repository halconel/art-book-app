import React from 'react';
import { connect } from 'react-redux';
import { Navigate, useLocation } from 'react-router-dom';

// Protected Route Component
const ProtectedRoute = ({ children, loggedIn }) => {
  if (loggedIn) {
    return children;
  } else {
    return <Navigate to="/" replace />;
  }
};

// Auth Route Component (for login/signup pages)
const AuthRoute = ({ children, loggedIn }) => {
  if (!loggedIn) {
    return children;
  } else {
    return <Navigate to="/home" replace />;
  }
};

const mapStateToProps = state => (
  {loggedIn: Boolean(state.session.currentUser)}
);

// Export connected components
export const ConnectedProtectedRoute = connect(mapStateToProps, null)(ProtectedRoute);
export const ConnectedAuthRoute = connect(mapStateToProps, null)(AuthRoute);

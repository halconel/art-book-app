import React from 'react';
import { Route, Routes, Navigate } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { CssBaseline } from '@mui/material';

import HomeContainer from './home/home_container';
import GalleryContainer from './gallery/gallery_container';
import AboutContainer from './about/about_container';
import Navigation from './navigation/navigation';
import SlideshowTimer from './slideshow_timer';

import { AuthProvider } from '../contexts/AuthContext';
import LoginForm from './auth/LoginForm';
import ProtectedRoute from './auth/ProtectedRoute';
import AdminLayout from './layouts/AdminLayout';
import ClientLayout from './layouts/ClientLayout';
import AdminDashboard from './admin/AdminDashboard';
import ClientDashboard from './client/ClientDashboard';

const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
  },
});

const App = () => {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
        <Routes>
          {/* Public Gallery Routes */}
          <Route
            path="/"
            element={
              <div className="home-app">
                <Navigation />
                <SlideshowTimer />
                <main className="main-content">
                  <HomeContainer />
                </main>
              </div>
            }
          />
          <Route
            path="/resume"
            element={
              <div className="home-app">
                <Navigation />
                <SlideshowTimer />
                <main className="main-content">
                  <AboutContainer />
                </main>
              </div>
            }
          />
          <Route
            path="/gallery"
            element={
              <div className="home-app">
                <Navigation />
                <SlideshowTimer />
                <main className="main-content">
                  <GalleryContainer />
                </main>
              </div>
            }
          />

          {/* Authentication */}
          <Route path="/login" element={<LoginForm />} />

          {/* Admin Routes */}
          <Route
            path="/admin"
            element={
              <ProtectedRoute requireRole="admin">
                <AdminLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<AdminDashboard />} />
            <Route
              path="clients"
              element={<div>Admin Clients (Coming Soon)</div>}
            />
            <Route
              path="orders"
              element={<div>Admin Orders (Coming Soon)</div>}
            />
            <Route
              path="projects"
              element={<div>Admin Projects (Coming Soon)</div>}
            />
            <Route
              path="images"
              element={<div>Admin Images (Coming Soon)</div>}
            />
            <Route
              path="calendar"
              element={<div>Admin Calendar (Coming Soon)</div>}
            />
            <Route
              path="notifications"
              element={<div>Admin Notifications (Coming Soon)</div>}
            />
          </Route>

          {/* Client Routes */}
          <Route
            path="/client"
            element={
              <ProtectedRoute requireRole="client">
                <ClientLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<ClientDashboard />} />
            <Route
              path="orders"
              element={<div>Client Orders (Coming Soon)</div>}
            />
            <Route
              path="calendar"
              element={<div>Client Calendar (Coming Soon)</div>}
            />
            <Route
              path="notifications"
              element={<div>Client Notifications (Coming Soon)</div>}
            />
            <Route
              path="refunds"
              element={<div>Client Refunds (Coming Soon)</div>}
            />
          </Route>

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthProvider>
    </ThemeProvider>
  );
};

export default App;

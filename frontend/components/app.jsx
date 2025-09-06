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
import { NotificationProvider } from '../contexts/NotificationContext';
import { ConfirmationProvider } from '../contexts/ConfirmationContext';
import LoginForm from './auth/LoginForm';
import ProtectedRoute from './auth/ProtectedRoute';
import AdminLayout from './layouts/AdminLayout';
import ClientLayout from './layouts/ClientLayout';
import AdminDashboard from './admin/AdminDashboard';
import ClientDashboard from './client/ClientDashboard';
import ClientManagement from './admin/ClientManagement';
import OrdersKanban from './admin/OrdersKanban';
import WorkloadCalendar from './admin/WorkloadCalendar';
import ProjectManagement from './admin/ProjectManagement';
import OrderDetail from './client/OrderDetail';
import ArtistWorkloadCalendar from './client/ArtistWorkloadCalendar';
import Notifications from './client/Notifications';
import ClientProfile from './client/ClientProfile';
import ImageManagement from './admin/ImageManagement';
import ResumeEditor from './admin/ResumeEditor';
import AdminLogs from './admin/AdminLogs';
import PublicGallery from './public/PublicGallery';
import ArtistInfo from './public/ArtistInfo';

const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
    background: {
      default: '#121212',
      paper: '#1e1e1e',
    },
  },
  breakpoints: {
    values: {
      xs: 0,
      sm: 600,
      md: 900,
      lg: 1200,
      xl: 1536,
    },
  },
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.15)',
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          textTransform: 'none',
          fontWeight: 600,
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 12,
        },
      },
    },
    MuiDrawer: {
      styleOverrides: {
        paper: {
          borderRadius: '0 12px 12px 0',
        },
      },
    },
  },
  typography: {
    h4: {
      fontWeight: 700,
    },
    h5: {
      fontWeight: 600,
    },
    h6: {
      fontWeight: 600,
    },
  },
});

const App = () => {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
        <NotificationProvider>
          <ConfirmationProvider>
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

              {/* Public Pages */}
              <Route path="/public-gallery" element={<PublicGallery />} />
              <Route path="/artist" element={<ArtistInfo />} />

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
                <Route path="clients" element={<ClientManagement />} />
                <Route path="orders" element={<OrdersKanban />} />
                <Route path="projects" element={<ProjectManagement />} />
                <Route path="images" element={<ImageManagement />} />
                <Route path="resume" element={<ResumeEditor />} />
                <Route path="calendar" element={<WorkloadCalendar />} />
                <Route path="logs" element={<AdminLogs />} />
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
                <Route path="orders/:orderId" element={<OrderDetail />} />
                <Route path="workload" element={<ArtistWorkloadCalendar />} />
                <Route path="notifications" element={<Notifications />} />
                <Route path="profile" element={<ClientProfile />} />
              </Route>

              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </ConfirmationProvider>
        </NotificationProvider>
      </AuthProvider>
    </ThemeProvider>
  );
};

export default App;

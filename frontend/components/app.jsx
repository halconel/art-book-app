import React, { Suspense } from 'react';
import { Route, Routes, Navigate } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { CssBaseline, CircularProgress, Box } from '@mui/material';

import HomeContainer from './home/home_container.jsx';
import AboutContainer from './about/about_container';
import Navigation from './navigation/navigation';
import SlideshowTimer from './slideshow_timer';

import { AuthProvider } from '../contexts/AuthContext';
import { NotificationProvider } from '../contexts/NotificationContext';
import { ConfirmationProvider } from '../contexts/ConfirmationContext';
import LoginForm from './auth/LoginForm';
import ProtectedRoute from './auth/ProtectedRoute';

// Lazy loaded components
const AdminLayout = React.lazy(() => import('./layouts/AdminLayout'));
const ClientLayout = React.lazy(() => import('./layouts/ClientLayout'));
const AdminDashboard = React.lazy(() => import('./admin/AdminDashboard'));
const ClientDashboard = React.lazy(() => import('./client/ClientDashboard'));
const ClientManagement = React.lazy(() => import('./admin/ClientManagement'));
const OrdersKanban = React.lazy(() => import('./admin/OrdersKanban'));
const WorkloadCalendar = React.lazy(() => import('./admin/WorkloadCalendar'));
const ProjectManagement = React.lazy(() => import('./admin/ProjectManagement'));
const OrderDetail = React.lazy(() => import('./client/OrderDetail'));
const ArtistWorkloadCalendar = React.lazy(() =>
  import('./client/ArtistWorkloadCalendar')
);
const Notifications = React.lazy(() => import('./client/Notifications'));
const ClientProfile = React.lazy(() => import('./client/ClientProfile'));
const ImageManagement = React.lazy(() => import('./admin/ImageManagement'));
const ResumeEditor = React.lazy(() => import('./admin/ResumeEditor'));
const AdminLogs = React.lazy(() => import('./admin/AdminLogs'));
const PublicGallery = React.lazy(() => import('./public/PublicGallery'));
const ArtistInfo = React.lazy(() => import('./public/ArtistInfo'));

// Loading component
const LoadingSpinner = () => (
  <Box
    display="flex"
    justifyContent="center"
    alignItems="center"
    minHeight="50vh"
  >
    <CircularProgress />
  </Box>
);

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
                      <Suspense fallback={<LoadingSpinner />}>
                        <PublicGallery />
                      </Suspense>
                    </main>
                  </div>
                }
              />

              {/* Public Pages */}
              <Route
                path="/public-gallery"
                element={
                  <Suspense fallback={<LoadingSpinner />}>
                    <PublicGallery />
                  </Suspense>
                }
              />
              <Route
                path="/artist"
                element={
                  <Suspense fallback={<LoadingSpinner />}>
                    <ArtistInfo />
                  </Suspense>
                }
              />

              {/* Authentication */}
              <Route path="/login" element={<LoginForm />} />

              {/* Admin Routes */}
              <Route
                path="/admin"
                element={
                  <ProtectedRoute requireRole="admin">
                    <Suspense fallback={<LoadingSpinner />}>
                      <AdminLayout />
                    </Suspense>
                  </ProtectedRoute>
                }
              >
                <Route
                  index
                  element={
                    <Suspense fallback={<LoadingSpinner />}>
                      <AdminDashboard />
                    </Suspense>
                  }
                />
                <Route
                  path="clients"
                  element={
                    <Suspense fallback={<LoadingSpinner />}>
                      <ClientManagement />
                    </Suspense>
                  }
                />
                <Route
                  path="orders"
                  element={
                    <Suspense fallback={<LoadingSpinner />}>
                      <OrdersKanban />
                    </Suspense>
                  }
                />
                <Route
                  path="projects"
                  element={
                    <Suspense fallback={<LoadingSpinner />}>
                      <ProjectManagement />
                    </Suspense>
                  }
                />
                <Route
                  path="images"
                  element={
                    <Suspense fallback={<LoadingSpinner />}>
                      <ImageManagement />
                    </Suspense>
                  }
                />
                <Route
                  path="resume"
                  element={
                    <Suspense fallback={<LoadingSpinner />}>
                      <ResumeEditor />
                    </Suspense>
                  }
                />
                <Route
                  path="calendar"
                  element={
                    <Suspense fallback={<LoadingSpinner />}>
                      <WorkloadCalendar />
                    </Suspense>
                  }
                />
                <Route
                  path="logs"
                  element={
                    <Suspense fallback={<LoadingSpinner />}>
                      <AdminLogs />
                    </Suspense>
                  }
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
                    <Suspense fallback={<LoadingSpinner />}>
                      <ClientLayout />
                    </Suspense>
                  </ProtectedRoute>
                }
              >
                <Route
                  index
                  element={
                    <Suspense fallback={<LoadingSpinner />}>
                      <ClientDashboard />
                    </Suspense>
                  }
                />
                <Route
                  path="orders/:orderId"
                  element={
                    <Suspense fallback={<LoadingSpinner />}>
                      <OrderDetail />
                    </Suspense>
                  }
                />
                <Route
                  path="workload"
                  element={
                    <Suspense fallback={<LoadingSpinner />}>
                      <ArtistWorkloadCalendar />
                    </Suspense>
                  }
                />
                <Route
                  path="notifications"
                  element={
                    <Suspense fallback={<LoadingSpinner />}>
                      <Notifications />
                    </Suspense>
                  }
                />
                <Route
                  path="profile"
                  element={
                    <Suspense fallback={<LoadingSpinner />}>
                      <ClientProfile />
                    </Suspense>
                  }
                />
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

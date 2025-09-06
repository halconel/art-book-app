import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useMemo,
} from 'react';
import { Snackbar, Alert, AlertTitle, IconButton, Box } from '@mui/material';
import { Close } from '@mui/icons-material';

const NotificationContext = createContext();

export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotification must be used within NotificationProvider');
  }
  return context;
};

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);

  const removeNotification = useCallback(id => {
    setNotifications(prev =>
      prev.filter(notification => notification.id !== id)
    );
  }, []);

  const addNotification = useCallback(
    notification => {
      const id = Date.now() + Math.random();
      const newNotification = {
        id,
        severity: 'info',
        autoHideDuration: 5000,
        ...notification,
      };

      setNotifications(prev => [...prev, newNotification]);

      // Auto remove after duration
      if (newNotification.autoHideDuration) {
        setTimeout(() => {
          removeNotification(id);
        }, newNotification.autoHideDuration);
      }

      return id;
    },
    [removeNotification]
  );

  const clearAllNotifications = useCallback(() => {
    setNotifications([]);
  }, []);

  // Convenience methods
  const showSuccess = useCallback(
    (message, options = {}) => {
      return addNotification({
        severity: 'success',
        message,
        ...options,
      });
    },
    [addNotification]
  );

  const showError = useCallback(
    (message, options = {}) => {
      return addNotification({
        severity: 'error',
        message,
        autoHideDuration: 7000, // Errors stay longer
        ...options,
      });
    },
    [addNotification]
  );

  const showWarning = useCallback(
    (message, options = {}) => {
      return addNotification({
        severity: 'warning',
        message,
        ...options,
      });
    },
    [addNotification]
  );

  const showInfo = useCallback(
    (message, options = {}) => {
      return addNotification({
        severity: 'info',
        message,
        ...options,
      });
    },
    [addNotification]
  );

  const value = useMemo(
    () => ({
      addNotification,
      removeNotification,
      clearAllNotifications,
      showSuccess,
      showError,
      showWarning,
      showInfo,
    }),
    [
      addNotification,
      removeNotification,
      clearAllNotifications,
      showSuccess,
      showError,
      showWarning,
      showInfo,
    ]
  );

  return (
    <NotificationContext.Provider value={value}>
      {children}

      {/* Render notifications */}
      <Box
        sx={{
          position: 'fixed',
          top: 16,
          right: 16,
          zIndex: 9999,
          display: 'flex',
          flexDirection: 'column',
          gap: 1,
          maxWidth: '400px',
          width: '100%',
        }}
      >
        {notifications.map(notification => (
          <Snackbar
            key={notification.id}
            open
            anchorOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
            sx={{
              position: 'relative',
              transform: 'none !important',
              left: 'auto !important',
              right: 'auto !important',
              top: 'auto !important',
              bottom: 'auto !important',
            }}
          >
            <Alert
              severity={notification.severity}
              variant="filled"
              onClose={() => removeNotification(notification.id)}
              action={
                <IconButton
                  aria-label="close"
                  color="inherit"
                  size="small"
                  onClick={() => removeNotification(notification.id)}
                >
                  <Close fontSize="inherit" />
                </IconButton>
              }
              sx={{
                width: '100%',
                '& .MuiAlert-message': {
                  width: '100%',
                },
              }}
            >
              {notification.title && (
                <AlertTitle>{notification.title}</AlertTitle>
              )}
              {notification.message}

              {notification.action && (
                <Box sx={{ mt: 1 }}>{notification.action}</Box>
              )}
            </Alert>
          </Snackbar>
        ))}
      </Box>
    </NotificationContext.Provider>
  );
};

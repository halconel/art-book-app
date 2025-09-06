import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useMemo,
} from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
} from '@mui/material';
import {
  Warning,
  Error,
  Info,
  CheckCircle,
  DeleteForever,
} from '@mui/icons-material';

const ConfirmationContext = createContext();

export const useConfirmation = () => {
  const context = useContext(ConfirmationContext);
  if (!context) {
    throw new Error('useConfirmation must be used within ConfirmationProvider');
  }
  return context;
};

export const ConfirmationProvider = ({ children }) => {
  const [dialog, setDialog] = useState(null);

  const confirm = useCallback(options => {
    return new Promise(resolve => {
      const handleClose = result => {
        setDialog(null);
        resolve(result);
      };

      setDialog({
        title: 'Confirm Action',
        message: 'Are you sure you want to proceed?',
        confirmText: 'Confirm',
        cancelText: 'Cancel',
        severity: 'warning',
        ...options,
        onClose: handleClose,
      });
    });
  }, []);

  const confirmDelete = useCallback(
    (itemName, options = {}) => {
      return confirm({
        title: 'Delete Confirmation',
        message: `Are you sure you want to delete "${itemName}"? This action cannot be undone.`,
        confirmText: 'Delete',
        cancelText: 'Keep',
        severity: 'error',
        icon: <DeleteForever />,
        ...options,
      });
    },
    [confirm]
  );

  const confirmSave = useCallback(
    (options = {}) => {
      return confirm({
        title: 'Save Changes',
        message: 'Do you want to save your changes?',
        confirmText: 'Save',
        cancelText: 'Discard',
        severity: 'info',
        icon: <CheckCircle />,
        ...options,
      });
    },
    [confirm]
  );

  const confirmDiscard = useCallback(
    (options = {}) => {
      return confirm({
        title: 'Discard Changes',
        message:
          'You have unsaved changes. Are you sure you want to discard them?',
        confirmText: 'Discard',
        cancelText: 'Keep Editing',
        severity: 'warning',
        icon: <Warning />,
        ...options,
      });
    },
    [confirm]
  );

  const getDialogIcon = severity => {
    switch (severity) {
      case 'error':
        return <Error color="error" sx={{ fontSize: 48 }} />;
      case 'warning':
        return <Warning color="warning" sx={{ fontSize: 48 }} />;
      case 'info':
        return <Info color="info" sx={{ fontSize: 48 }} />;
      case 'success':
        return <CheckCircle color="success" sx={{ fontSize: 48 }} />;
      default:
        return <Info color="info" sx={{ fontSize: 48 }} />;
    }
  };

  const getSeverityColor = severity => {
    switch (severity) {
      case 'error':
        return 'error';
      case 'warning':
        return 'warning';
      case 'info':
        return 'info';
      case 'success':
        return 'success';
      default:
        return 'primary';
    }
  };

  const value = useMemo(
    () => ({
      confirm,
      confirmDelete,
      confirmSave,
      confirmDiscard,
    }),
    [confirm, confirmDelete, confirmSave, confirmDiscard]
  );

  return (
    <ConfirmationContext.Provider value={value}>
      {children}

      {dialog && (
        <Dialog
          open
          onClose={() => dialog.onClose(false)}
          maxWidth="sm"
          fullWidth
          PaperProps={{
            sx: {
              borderRadius: 2,
              boxShadow: theme => theme.shadows[10],
            },
          }}
        >
          <DialogTitle sx={{ pb: 1 }}>
            <Box display="flex" alignItems="center" gap={2}>
              {dialog.icon || getDialogIcon(dialog.severity)}
              <Typography variant="h6" component="div">
                {dialog.title}
              </Typography>
            </Box>
          </DialogTitle>

          <DialogContent sx={{ py: 2 }}>
            <Typography variant="body1" color="text.secondary">
              {dialog.message}
            </Typography>

            {dialog.details && (
              <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
                {dialog.details}
              </Typography>
            )}
          </DialogContent>

          <DialogActions sx={{ px: 3, pb: 3 }}>
            <Button
              onClick={() => dialog.onClose(false)}
              color="inherit"
              variant="outlined"
            >
              {dialog.cancelText}
            </Button>

            <Button
              onClick={() => dialog.onClose(true)}
              color={getSeverityColor(dialog.severity)}
              variant="contained"
              autoFocus
            >
              {dialog.confirmText}
            </Button>
          </DialogActions>
        </Dialog>
      )}
    </ConfirmationContext.Provider>
  );
};

import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  IconButton,
  Badge,
  Chip,
  Button,
  Paper,
  Grid,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  CircularProgress,
  Alert,
  Divider,
  Menu,
  MenuItem,
} from '@mui/material';
import {
  Notifications as NotificationsIcon,
  CheckCircle,
  Schedule,
  Assignment,
  RequestPage,
  Info,
  Warning,
  Error,
  MarkAsUnread,
  Delete,
  MoreVert,
  FilterList,
  Refresh,
} from '@mui/icons-material';
import { formatDistance } from 'date-fns';
import api from '../../services/authService';

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedNotification, setSelectedNotification] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [filterAnchorEl, setFilterAnchorEl] = useState(null);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const response = await api.get('/client/notifications');
      setNotifications(response.data.notifications || []);
      setError('');
    } catch (err) {
      setError('Failed to fetch notifications');
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAsRead = async notificationId => {
    try {
      await api.patch(`/client/notifications/${notificationId}`, {
        notification: { read: true },
      });
      setNotifications(prev =>
        prev.map(notif =>
          notif.id === notificationId ? { ...notif, read: true } : notif
        )
      );
    } catch (err) {
      setError('Failed to mark notification as read');
    }
  };

  const handleMarkAsUnread = async notificationId => {
    try {
      await api.patch(`/client/notifications/${notificationId}`, {
        notification: { read: false },
      });
      setNotifications(prev =>
        prev.map(notif =>
          notif.id === notificationId ? { ...notif, read: false } : notif
        )
      );
    } catch (err) {
      setError('Failed to mark notification as unread');
    }
  };

  const handleDeleteNotification = async notificationId => {
    try {
      await api.delete(`/client/notifications/${notificationId}`);
      setNotifications(prev =>
        prev.filter(notif => notif.id !== notificationId)
      );
    } catch (err) {
      setError('Failed to delete notification');
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await api.patch('/client/notifications/bulk-update', {
        action: 'mark_all_read',
      });
      setNotifications(prev => prev.map(notif => ({ ...notif, read: true })));
    } catch (err) {
      setError('Failed to mark all as read');
    }
  };

  const handleNotificationClick = notification => {
    if (!notification.read) {
      handleMarkAsRead(notification.id);
    }
    setSelectedNotification(notification);
    setOpenDialog(true);
  };

  const handleMenuClick = (event, notification) => {
    event.stopPropagation();
    setAnchorEl(event.currentTarget);
    setSelectedNotification(notification);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedNotification(null);
  };

  const getNotificationIcon = type => {
    switch (type) {
      case 'order_created':
        return <Assignment color="primary" />;
      case 'order_completed':
        return <CheckCircle color="success" />;
      case 'cycle_pack_completed':
        return <Schedule color="info" />;
      case 'refund_processed':
        return <RequestPage color="warning" />;
      case 'system':
        return <Info color="info" />;
      case 'warning':
        return <Warning color="warning" />;
      case 'error':
        return <Error color="error" />;
      default:
        return <NotificationsIcon color="action" />;
    }
  };

  const getNotificationColor = (type, read) => {
    if (read) return 'default';

    switch (type) {
      case 'order_created':
        return 'primary';
      case 'order_completed':
        return 'success';
      case 'cycle_pack_completed':
        return 'info';
      case 'refund_processed':
        return 'warning';
      case 'error':
        return 'error';
      default:
        return 'default';
    }
  };

  const getFilteredNotifications = () => {
    switch (filter) {
      case 'unread':
        return notifications.filter(n => !n.read);
      case 'read':
        return notifications.filter(n => n.read);
      case 'orders':
        return notifications.filter(n => n.notification_type.includes('order'));
      case 'refunds':
        return notifications.filter(n =>
          n.notification_type.includes('refund')
        );
      default:
        return notifications;
    }
  };

  const unreadCount = notifications.filter(n => !n.read).length;
  const filteredNotifications = getFilteredNotifications();

  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="400px"
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={3}
      >
        <Box display="flex" alignItems="center" gap={2}>
          <Typography variant="h4">Notifications</Typography>
          {unreadCount > 0 && (
            <Badge badgeContent={unreadCount} color="error">
              <NotificationsIcon />
            </Badge>
          )}
        </Box>

        <Box display="flex" gap={1}>
          <Button
            startIcon={<FilterList />}
            onClick={e => setFilterAnchorEl(e.currentTarget)}
          >
            Filter: {filter}
          </Button>
          <Button startIcon={<Refresh />} onClick={fetchNotifications}>
            Refresh
          </Button>
        </Box>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {/* Quick Actions */}
      <Paper sx={{ p: 2, mb: 2 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} sm={6}>
            <Typography variant="body2" color="text.secondary">
              {filteredNotifications.length} notifications ({unreadCount}{' '}
              unread)
            </Typography>
          </Grid>
          <Grid
            item
            xs={12}
            sm={6}
            sx={{ textAlign: { xs: 'left', sm: 'right' } }}
          >
            <Button
              size="small"
              onClick={handleMarkAllAsRead}
              disabled={unreadCount === 0}
            >
              Mark All as Read
            </Button>
          </Grid>
        </Grid>
      </Paper>

      {/* Notifications List */}
      {filteredNotifications.length > 0 ? (
        <Card>
          <List>
            {filteredNotifications.map((notification, index) => (
              <React.Fragment key={notification.id}>
                <ListItem
                  button
                  onClick={() => handleNotificationClick(notification)}
                  sx={{
                    backgroundColor: notification.read
                      ? 'transparent'
                      : 'action.hover',
                    '&:hover': {
                      backgroundColor: 'action.selected',
                    },
                  }}
                >
                  <ListItemIcon>
                    {getNotificationIcon(notification.notification_type)}
                  </ListItemIcon>

                  <ListItemText
                    primary={
                      <Box
                        display="flex"
                        alignItems="center"
                        justifyContent="space-between"
                      >
                        <Typography
                          variant="subtitle1"
                          sx={{
                            fontWeight: notification.read ? 'normal' : 'bold',
                          }}
                        >
                          {notification.title}
                        </Typography>
                        <Box display="flex" alignItems="center" gap={1}>
                          <Chip
                            label={notification.notification_type.replace(
                              '_',
                              ' '
                            )}
                            size="small"
                            color={getNotificationColor(
                              notification.notification_type,
                              notification.read
                            )}
                            variant="outlined"
                          />
                          {!notification.read && (
                            <Box
                              sx={{
                                width: 8,
                                height: 8,
                                borderRadius: '50%',
                                backgroundColor: 'primary.main',
                              }}
                            />
                          )}
                        </Box>
                      </Box>
                    }
                    secondary={
                      <Box>
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          sx={{ mb: 0.5 }}
                        >
                          {notification.message}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {formatDistance(
                            new Date(notification.created_at),
                            new Date(),
                            { addSuffix: true }
                          )}
                        </Typography>
                      </Box>
                    }
                  />

                  <IconButton
                    edge="end"
                    onClick={e => handleMenuClick(e, notification)}
                  >
                    <MoreVert />
                  </IconButton>
                </ListItem>

                {index < filteredNotifications.length - 1 && <Divider />}
              </React.Fragment>
            ))}
          </List>
        </Card>
      ) : (
        <Paper sx={{ p: 4, textAlign: 'center' }}>
          <NotificationsIcon
            sx={{ fontSize: 60, color: 'text.secondary', mb: 2 }}
          />
          <Typography variant="h6" color="text.secondary" gutterBottom>
            No notifications
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {filter === 'all'
              ? "You don't have any notifications yet"
              : `No ${filter} notifications found`}
          </Typography>
        </Paper>
      )}

      {/* Notification Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        {selectedNotification && !selectedNotification.read && (
          <MenuItem
            onClick={() => {
              handleMarkAsRead(selectedNotification.id);
              handleMenuClose();
            }}
          >
            <CheckCircle sx={{ mr: 1 }} />
            Mark as Read
          </MenuItem>
        )}

        {selectedNotification && selectedNotification.read && (
          <MenuItem
            onClick={() => {
              handleMarkAsUnread(selectedNotification.id);
              handleMenuClose();
            }}
          >
            <MarkAsUnread sx={{ mr: 1 }} />
            Mark as Unread
          </MenuItem>
        )}

        <MenuItem
          onClick={() => {
            handleDeleteNotification(selectedNotification.id);
            handleMenuClose();
          }}
        >
          <Delete sx={{ mr: 1 }} />
          Delete
        </MenuItem>
      </Menu>

      {/* Filter Menu */}
      <Menu
        anchorEl={filterAnchorEl}
        open={Boolean(filterAnchorEl)}
        onClose={() => setFilterAnchorEl(null)}
      >
        <MenuItem
          onClick={() => {
            setFilter('all');
            setFilterAnchorEl(null);
          }}
        >
          All Notifications
        </MenuItem>
        <MenuItem
          onClick={() => {
            setFilter('unread');
            setFilterAnchorEl(null);
          }}
        >
          Unread Only
        </MenuItem>
        <MenuItem
          onClick={() => {
            setFilter('read');
            setFilterAnchorEl(null);
          }}
        >
          Read Only
        </MenuItem>
        <MenuItem
          onClick={() => {
            setFilter('orders');
            setFilterAnchorEl(null);
          }}
        >
          Order Updates
        </MenuItem>
        <MenuItem
          onClick={() => {
            setFilter('refunds');
            setFilterAnchorEl(null);
          }}
        >
          Refund Updates
        </MenuItem>
      </Menu>

      {/* Notification Detail Dialog */}
      <Dialog
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        maxWidth="sm"
        fullWidth
      >
        {selectedNotification && (
          <>
            <DialogTitle>
              <Box display="flex" alignItems="center" gap={2}>
                {getNotificationIcon(selectedNotification.notification_type)}
                {selectedNotification.title}
              </Box>
            </DialogTitle>
            <DialogContent>
              <Typography variant="body1" sx={{ mb: 2 }}>
                {selectedNotification.message}
              </Typography>

              <Box sx={{ backgroundColor: 'grey.50', p: 2, borderRadius: 1 }}>
                <Typography variant="caption" color="text.secondary">
                  Type:{' '}
                  {selectedNotification.notification_type.replace('_', ' ')}
                </Typography>
                <br />
                <Typography variant="caption" color="text.secondary">
                  Received:{' '}
                  {new Date(selectedNotification.created_at).toLocaleString()}
                </Typography>

                {selectedNotification.metadata && (
                  <Box sx={{ mt: 1 }}>
                    <Typography variant="caption" color="text.secondary">
                      Additional Info:
                    </Typography>
                    <pre style={{ fontSize: '0.75rem', margin: '4px 0' }}>
                      {JSON.stringify(selectedNotification.metadata, null, 2)}
                    </pre>
                  </Box>
                )}
              </Box>
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setOpenDialog(false)}>Close</Button>
              {!selectedNotification.read && (
                <Button
                  onClick={() => {
                    handleMarkAsRead(selectedNotification.id);
                    setOpenDialog(false);
                  }}
                  variant="contained"
                >
                  Mark as Read
                </Button>
              )}
            </DialogActions>
          </>
        )}
      </Dialog>
    </Box>
  );
};

export default Notifications;

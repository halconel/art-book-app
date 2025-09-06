import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  TextField,
  Button,
  Switch,
  FormControlLabel,
  Divider,
  Alert,
  Avatar,
  Paper,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  CircularProgress,
} from '@mui/material';
import {
  Person,
  Email,
  Notifications,
  Security,
  Save,
  Edit,
  CheckCircle,
  Warning,
  History,
  Assignment,
} from '@mui/icons-material';
import { useAuth } from '../../contexts/AuthContext';
import api from '../../services/authService';

const ClientProfile = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState({
    contact_info: '',
    email_notifications: true,
    order_updates: true,
    cycle_notifications: true,
    refund_notifications: true,
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [stats, setStats] = useState({
    total_orders: 0,
    active_orders: 0,
    completed_orders: 0,
    total_cycles: 0,
  });
  const [recentActivity, setRecentActivity] = useState([]);
  const [openChangePassword, setOpenChangePassword] = useState(false);
  const [passwordData, setPasswordData] = useState({
    current_password: '',
    new_password: '',
    confirm_password: '',
  });

  useEffect(() => {
    fetchProfileData();
    fetchStats();
    fetchRecentActivity();
  }, []);

  const fetchProfileData = async () => {
    try {
      setLoading(true);
      const response = await api.get('/client/profile');
      setProfile(prev => ({
        ...prev,
        ...response.data.profile,
      }));
      setError('');
    } catch (err) {
      setError('Failed to fetch profile data');
      // eslint-disable-next-line no-console
      console.error('Failed to fetch profile:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await api.get('/client/stats');
      setStats(response.data.stats || {});
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error('Failed to fetch stats:', err);
    }
  };

  const fetchRecentActivity = async () => {
    try {
      const response = await api.get('/client/recent-activity?limit=5');
      setRecentActivity(response.data.activities || []);
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error('Failed to fetch recent activity:', err);
    }
  };

  const handleSaveProfile = async () => {
    try {
      setSaving(true);
      await api.patch('/client/profile', { profile });
      setSuccess('Profile updated successfully');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError('Failed to update profile');
      // eslint-disable-next-line no-console
      console.error('Failed to update profile:', err);
    } finally {
      setSaving(false);
    }
  };

  const handleChangePassword = async () => {
    if (passwordData.new_password !== passwordData.confirm_password) {
      setError('New passwords do not match');
      return;
    }

    try {
      await api.patch('/client/change-password', {
        current_password: passwordData.current_password,
        new_password: passwordData.new_password,
      });
      setOpenChangePassword(false);
      setPasswordData({
        current_password: '',
        new_password: '',
        confirm_password: '',
      });
      setSuccess('Password changed successfully');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError('Failed to change password');
      // eslint-disable-next-line no-console
      console.error('Failed to change password:', err);
    }
  };

  const getActivityIcon = type => {
    switch (type) {
      case 'order_created':
        return <Assignment color="primary" />;
      case 'order_updated':
        return <Edit color="info" />;
      case 'refund_requested':
        return <Warning color="warning" />;
      default:
        return <History color="action" />;
    }
  };

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
      <Typography variant="h4" gutterBottom>
        My Profile & Settings
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError('')}>
          {error}
        </Alert>
      )}

      {success && (
        <Alert severity="success" sx={{ mb: 2 }} onClose={() => setSuccess('')}>
          {success}
        </Alert>
      )}

      <Grid container spacing={3}>
        {/* Profile Overview */}
        <Grid item xs={12} md={4}>
          <Card sx={{ mb: 3 }}>
            <CardContent sx={{ textAlign: 'center' }}>
              <Avatar
                sx={{
                  width: 80,
                  height: 80,
                  margin: '0 auto 16px auto',
                  fontSize: '2rem',
                }}
              >
                {user?.email?.charAt(0).toUpperCase()}
              </Avatar>

              <Typography variant="h6" gutterBottom>
                {user?.email}
              </Typography>

              <Box
                display="flex"
                justifyContent="center"
                alignItems="center"
                gap={1}
                mb={2}
              >
                {user?.email_verified_at ? (
                  <Chip
                    icon={<CheckCircle />}
                    label="Verified"
                    color="success"
                    size="small"
                  />
                ) : (
                  <Chip
                    icon={<Warning />}
                    label="Unverified"
                    color="warning"
                    size="small"
                  />
                )}
              </Box>

              <Typography variant="body2" color="text.secondary">
                Client since {new Date(user?.created_at).toLocaleDateString()}
              </Typography>
            </CardContent>
          </Card>

          {/* Account Stats */}
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Account Statistics
              </Typography>

              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <Box textAlign="center">
                    <Typography variant="h4" color="primary">
                      {stats.total_orders}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Total Orders
                    </Typography>
                  </Box>
                </Grid>

                <Grid item xs={6}>
                  <Box textAlign="center">
                    <Typography variant="h4" color="success.main">
                      {stats.completed_orders}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Completed
                    </Typography>
                  </Box>
                </Grid>

                <Grid item xs={6}>
                  <Box textAlign="center">
                    <Typography variant="h4" color="info.main">
                      {stats.active_orders}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Active
                    </Typography>
                  </Box>
                </Grid>

                <Grid item xs={6}>
                  <Box textAlign="center">
                    <Typography variant="h4" color="warning.main">
                      {stats.total_cycles}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Total Cycles
                    </Typography>
                  </Box>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        {/* Profile Settings */}
        <Grid item xs={12} md={8}>
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Box display="flex" alignItems="center" mb={2}>
                <Person sx={{ mr: 1 }} />
                <Typography variant="h6">Profile Information</Typography>
              </Box>

              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Email Address"
                    value={user?.email || ''}
                    disabled
                    helperText="Email cannot be changed. Contact support if needed."
                  />
                </Grid>

                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Contact Information"
                    multiline
                    rows={4}
                    value={profile.contact_info || ''}
                    onChange={e =>
                      setProfile(prev => ({
                        ...prev,
                        contact_info: e.target.value,
                      }))
                    }
                    placeholder="Add your contact details, preferences, or any notes for the artist..."
                    helperText="This information will be visible to the artist when managing your orders."
                  />
                </Grid>
              </Grid>
            </CardContent>
          </Card>

          {/* Notification Settings */}
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Box display="flex" alignItems="center" mb={2}>
                <Notifications sx={{ mr: 1 }} />
                <Typography variant="h6">Notification Preferences</Typography>
              </Box>

              <Box>
                <FormControlLabel
                  control={
                    <Switch
                      checked={profile.email_notifications}
                      onChange={e =>
                        setProfile(prev => ({
                          ...prev,
                          email_notifications: e.target.checked,
                        }))
                      }
                    />
                  }
                  label="Email Notifications"
                />
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ ml: 4, mb: 2 }}
                >
                  Receive email notifications for important updates
                </Typography>

                <FormControlLabel
                  control={
                    <Switch
                      checked={profile.order_updates}
                      onChange={e =>
                        setProfile(prev => ({
                          ...prev,
                          order_updates: e.target.checked,
                        }))
                      }
                    />
                  }
                  label="Order Updates"
                />
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ ml: 4, mb: 2 }}
                >
                  Get notified when your order status changes
                </Typography>

                <FormControlLabel
                  control={
                    <Switch
                      checked={profile.cycle_notifications}
                      onChange={e =>
                        setProfile(prev => ({
                          ...prev,
                          cycle_notifications: e.target.checked,
                        }))
                      }
                    />
                  }
                  label="Cycle Pack Notifications"
                />
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ ml: 4, mb: 2 }}
                >
                  Receive updates when work cycles are completed
                </Typography>

                <FormControlLabel
                  control={
                    <Switch
                      checked={profile.refund_notifications}
                      onChange={e =>
                        setProfile(prev => ({
                          ...prev,
                          refund_notifications: e.target.checked,
                        }))
                      }
                    />
                  }
                  label="Refund Notifications"
                />
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ ml: 4 }}
                >
                  Get notified about refund request status changes
                </Typography>
              </Box>
            </CardContent>
          </Card>

          {/* Security Settings */}
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Box
                display="flex"
                alignItems="center"
                justifyContent="space-between"
                mb={2}
              >
                <Box display="flex" alignItems="center">
                  <Security sx={{ mr: 1 }} />
                  <Typography variant="h6">Security Settings</Typography>
                </Box>
                <Button
                  variant="outlined"
                  onClick={() => setOpenChangePassword(true)}
                >
                  Change Password
                </Button>
              </Box>

              <Typography variant="body2" color="text.secondary">
                Keep your account secure by using a strong password and updating
                it regularly.
              </Typography>
            </CardContent>
          </Card>

          {/* Save Button */}
          <Box display="flex" justifyContent="end" gap={2}>
            <Button
              variant="contained"
              startIcon={<Save />}
              onClick={handleSaveProfile}
              disabled={saving}
            >
              {saving ? 'Saving...' : 'Save Changes'}
            </Button>
          </Box>
        </Grid>

        {/* Recent Activity */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Recent Activity
              </Typography>

              {recentActivity.length > 0 ? (
                <List>
                  {recentActivity.map((activity, index) => (
                    <ListItem
                      key={index}
                      divider={index < recentActivity.length - 1}
                    >
                      <ListItemIcon>
                        {getActivityIcon(activity.type)}
                      </ListItemIcon>
                      <ListItemText
                        primary={activity.description}
                        secondary={new Date(
                          activity.created_at
                        ).toLocaleString()}
                      />
                    </ListItem>
                  ))}
                </List>
              ) : (
                <Typography color="text.secondary" align="center" py={2}>
                  No recent activity
                </Typography>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Change Password Dialog */}
      <Dialog
        open={openChangePassword}
        onClose={() => setOpenChangePassword(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Change Password</DialogTitle>
        <DialogContent>
          <TextField
            margin="dense"
            label="Current Password"
            type="password"
            fullWidth
            value={passwordData.current_password}
            onChange={e =>
              setPasswordData(prev => ({
                ...prev,
                current_password: e.target.value,
              }))
            }
          />
          <TextField
            margin="dense"
            label="New Password"
            type="password"
            fullWidth
            value={passwordData.new_password}
            onChange={e =>
              setPasswordData(prev => ({
                ...prev,
                new_password: e.target.value,
              }))
            }
          />
          <TextField
            margin="dense"
            label="Confirm New Password"
            type="password"
            fullWidth
            value={passwordData.confirm_password}
            onChange={e =>
              setPasswordData(prev => ({
                ...prev,
                confirm_password: e.target.value,
              }))
            }
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenChangePassword(false)}>Cancel</Button>
          <Button onClick={handleChangePassword} variant="contained">
            Change Password
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ClientProfile;

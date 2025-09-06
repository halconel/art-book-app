import React, { useState, useEffect } from 'react';
import {
  Grid,
  Card,
  CardContent,
  Typography,
  Box,
  Paper,
  List,
  ListItem,
  ListItemText,
  Chip,
  CircularProgress,
} from '@mui/material';
import { People, Work, Image, TrendingUp } from '@mui/icons-material';
import api from '../../services/authService';

const StatCard = ({ title, value, icon, color = 'primary' }) => (
  <Card>
    <CardContent>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <Box>
          <Typography color="textSecondary" gutterBottom>
            {title}
          </Typography>
          <Typography variant="h4" component="div">
            {value}
          </Typography>
        </Box>
        <Box sx={{ color: `${color}.main` }}>{icon}</Box>
      </Box>
    </CardContent>
  </Card>
);

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    clients: 0,
    orders: 0,
    images: 0,
    projects: 0,
  });
  const [recentOrders, setRecentOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // Fetch dashboard statistics
        const [clientsRes, ordersRes, imagesRes, projectsRes] =
          await Promise.all([
            api.get('/admin/users?role=client&page=1&per_page=1'),
            api.get('/admin/orders?page=1&per_page=1'),
            api.get('/admin/images?page=1&per_page=1'),
            api.get('/admin/projects?page=1&per_page=1'),
          ]);

        setStats({
          clients: clientsRes.data.total_count || 0,
          orders: ordersRes.data.total_count || 0,
          images: imagesRes.data.total_count || 0,
          projects: projectsRes.data.total_count || 0,
        });

        // Fetch recent orders
        const recentOrdersRes = await api.get(
          '/admin/orders?page=1&per_page=5&sort=created_at&order=desc'
        );
        setRecentOrders(recentOrdersRes.data.orders || []);
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error('Failed to fetch dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

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

  const getStatusColor = status => {
    switch (status) {
      case 'pending':
        return 'warning';
      case 'in_progress':
        return 'info';
      case 'completed':
        return 'success';
      case 'cancelled':
        return 'error';
      default:
        return 'default';
    }
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Admin Dashboard
      </Typography>

      <Grid container spacing={3} mb={4}>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Total Clients"
            value={stats.clients}
            icon={<People fontSize="large" />}
            color="primary"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Active Orders"
            value={stats.orders}
            icon={<Work fontSize="large" />}
            color="success"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Gallery Images"
            value={stats.images}
            icon={<Image fontSize="large" />}
            color="warning"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Projects"
            value={stats.projects}
            icon={<TrendingUp fontSize="large" />}
            color="info"
          />
        </Grid>
      </Grid>

      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Recent Orders
            </Typography>
            <List>
              {recentOrders.length > 0 ? (
                recentOrders.map(order => (
                  <ListItem key={order.id} divider>
                    <ListItemText
                      primary={order.title}
                      secondary={`Client: ${
                        order.client?.email
                      } • Created: ${new Date(
                        order.created_at
                      ).toLocaleDateString()}`}
                    />
                    <Chip
                      label={order.status}
                      color={getStatusColor(order.status)}
                      size="small"
                    />
                  </ListItem>
                ))
              ) : (
                <Typography color="textSecondary" align="center" py={2}>
                  No recent orders
                </Typography>
              )}
            </List>
          </Paper>
        </Grid>

        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Quick Actions
            </Typography>
            <List>
              <ListItem button>
                <ListItemText primary="Add New Client" />
              </ListItem>
              <ListItem button>
                <ListItemText primary="Create Order" />
              </ListItem>
              <ListItem button>
                <ListItemText primary="Upload Images" />
              </ListItem>
              <ListItem button>
                <ListItemText primary="Manage Projects" />
              </ListItem>
            </List>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default AdminDashboard;

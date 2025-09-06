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
import { useNotification } from '../../contexts/NotificationContext';
import api from '../../services/authService';
import StatisticsCharts from '../shared/StatisticsCharts';

const StatCard = ({ title, value, icon, color = 'primary' }) => (
  <Card sx={{ height: '100%' }}>
    <CardContent sx={{ p: { xs: 2, md: 3 } }}>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          minHeight: { xs: 60, md: 80 },
        }}
      >
        <Box sx={{ minWidth: 0, flexGrow: 1, mr: 1 }}>
          <Typography
            color="textSecondary"
            gutterBottom
            variant={{ xs: 'body2', md: 'body1' }}
            sx={{
              fontSize: { xs: '0.75rem', sm: '0.875rem' },
              lineHeight: 1.2,
            }}
          >
            {title}
          </Typography>
          <Typography
            variant={{ xs: 'h5', md: 'h4' }}
            component="div"
            sx={{
              fontSize: { xs: '1.5rem', sm: '2rem', md: '2.125rem' },
              fontWeight: 700,
            }}
          >
            {value}
          </Typography>
        </Box>
        <Box
          sx={{
            color: `${color}.main`,
            '& .MuiSvgIcon-root': {
              fontSize: { xs: '2rem', md: '3rem' },
            },
          }}
        >
          {icon}
        </Box>
      </Box>
    </CardContent>
  </Card>
);

const AdminDashboard = () => {
  const { showError, showSuccess } = useNotification();
  const [stats, setStats] = useState({
    clients: 0,
    orders: 0,
    images: 0,
    projects: 0,
  });
  const [recentOrders, setRecentOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [chartData, setChartData] = useState({});

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

        // Generate sample chart data based on real stats
        setChartData({
          cycleProgress: [
            {
              month: 'Jan',
              cycles: Math.floor(stats.orders * 0.8),
              target: stats.orders,
            },
            {
              month: 'Feb',
              cycles: Math.floor(stats.orders * 0.9),
              target: stats.orders,
            },
            {
              month: 'Mar',
              cycles: Math.floor(stats.orders * 0.7),
              target: stats.orders,
            },
            {
              month: 'Apr',
              cycles: Math.floor(stats.orders * 1.1),
              target: stats.orders,
            },
            {
              month: 'May',
              cycles: Math.floor(stats.orders * 1.2),
              target: stats.orders,
            },
            { month: 'Jun', cycles: stats.orders, target: stats.orders },
          ],
          orderStatus: [
            {
              name: 'Completed',
              value: Math.floor(stats.orders * 0.6),
              color: '#4caf50',
            },
            {
              name: 'In Progress',
              value: Math.floor(stats.orders * 0.3),
              color: '#2196f3',
            },
            {
              name: 'Pending',
              value: Math.floor(stats.orders * 0.08),
              color: '#ff9800',
            },
            {
              name: 'Cancelled',
              value: Math.floor(stats.orders * 0.02),
              color: '#f44336',
            },
          ],
        });

        showSuccess('Dashboard data loaded successfully');
      } catch (error) {
        showError('Failed to fetch dashboard data. Please try again.');
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
    <Box sx={{ px: { xs: 0, sm: 1 } }}>
      <Typography
        variant="h4"
        gutterBottom
        sx={{
          fontSize: { xs: '1.75rem', sm: '2.125rem' },
          fontWeight: 700,
          mb: { xs: 2, md: 3 },
        }}
      >
        Admin Dashboard
      </Typography>

      <Grid container spacing={{ xs: 2, md: 3 }} mb={4}>
        <Grid item xs={6} sm={6} md={3}>
          <StatCard
            title="Total Clients"
            value={stats.clients}
            icon={<People fontSize="large" />}
            color="primary"
          />
        </Grid>
        <Grid item xs={6} sm={6} md={3}>
          <StatCard
            title="Active Orders"
            value={stats.orders}
            icon={<Work fontSize="large" />}
            color="success"
          />
        </Grid>
        <Grid item xs={6} sm={6} md={3}>
          <StatCard
            title="Gallery Images"
            value={stats.images}
            icon={<Image fontSize="large" />}
            color="warning"
          />
        </Grid>
        <Grid item xs={6} sm={6} md={3}>
          <StatCard
            title="Projects"
            value={stats.projects}
            icon={<TrendingUp fontSize="large" />}
            color="info"
          />
        </Grid>
      </Grid>

      <Grid container spacing={3} mb={4}>
        <Grid item xs={12}>
          <StatisticsCharts
            data={chartData}
            title="Admin Analytics Overview"
            showAll={false}
          />
        </Grid>
      </Grid>

      <Grid container spacing={{ xs: 2, md: 3 }}>
        <Grid item xs={12} lg={8}>
          <Paper sx={{ p: { xs: 2, md: 3 } }}>
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

        <Grid item xs={12} lg={4}>
          <Paper sx={{ p: { xs: 2, md: 3 } }}>
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

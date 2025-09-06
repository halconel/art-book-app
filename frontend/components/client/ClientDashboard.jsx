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
  LinearProgress,
} from '@mui/material';
import {
  Assignment,
  Schedule,
  CheckCircle,
  Pending,
} from '@mui/icons-material';
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

const ClientDashboard = () => {
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    inProgress: 0,
    completed: 0,
  });
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const response = await api.get('/client/orders');
        const orderList = response.data.orders || [];

        setOrders(orderList);

        // Calculate stats
        const orderStats = {
          total: orderList.length,
          pending: orderList.filter(o => o.status === 'pending').length,
          inProgress: orderList.filter(o => o.status === 'in_progress').length,
          completed: orderList.filter(o => o.status === 'completed').length,
        };
        setStats(orderStats);
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

  const getProgressPercentage = order => {
    if (!order.estimated_cycles) return 0;
    const completed = order.total_cycles_completed || 0;
    return Math.min((completed / order.estimated_cycles) * 100, 100);
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        My Orders Dashboard
      </Typography>

      <Grid container spacing={3} mb={4}>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Total Orders"
            value={stats.total}
            icon={<Assignment fontSize="large" />}
            color="primary"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Pending"
            value={stats.pending}
            icon={<Pending fontSize="large" />}
            color="warning"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="In Progress"
            value={stats.inProgress}
            icon={<Schedule fontSize="large" />}
            color="info"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Completed"
            value={stats.completed}
            icon={<CheckCircle fontSize="large" />}
            color="success"
          />
        </Grid>
      </Grid>

      <Paper sx={{ p: 2 }}>
        <Typography variant="h6" gutterBottom>
          My Orders
        </Typography>
        <List>
          {orders.length > 0 ? (
            orders.map(order => (
              <ListItem key={order.id} divider>
                <ListItemText
                  primary={
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <Typography variant="h6">{order.title}</Typography>
                      <Chip
                        label={order.status}
                        color={getStatusColor(order.status)}
                        size="small"
                      />
                    </Box>
                  }
                  secondary={
                    <Box>
                      <Typography variant="body2" color="textSecondary">
                        {order.description}
                      </Typography>
                      <Typography variant="body2" color="textSecondary">
                        Created:{' '}
                        {new Date(order.created_at).toLocaleDateString()}
                        {order.deadline &&
                          ` • Deadline: ${new Date(
                            order.deadline
                          ).toLocaleDateString()}`}
                      </Typography>
                      {order.estimated_cycles && (
                        <Box sx={{ mt: 1 }}>
                          <Typography variant="body2" color="textSecondary">
                            Progress: {order.total_cycles_completed || 0} /{' '}
                            {order.estimated_cycles} cycles
                          </Typography>
                          <LinearProgress
                            variant="determinate"
                            value={getProgressPercentage(order)}
                            sx={{ mt: 0.5, height: 6, borderRadius: 3 }}
                          />
                        </Box>
                      )}
                    </Box>
                  }
                />
              </ListItem>
            ))
          ) : (
            <Typography color="textSecondary" align="center" py={4}>
              No orders yet
            </Typography>
          )}
        </List>
      </Paper>
    </Box>
  );
};

export default ClientDashboard;

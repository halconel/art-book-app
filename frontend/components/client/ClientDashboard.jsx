import React, { useState, useEffect } from 'react';
import {
  Grid,
  Card,
  CardContent,
  CardActions,
  Typography,
  Box,
  Paper,
  Button,
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
import { useNavigate } from 'react-router-dom';
import { useNotification } from '../../contexts/NotificationContext';
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
  const navigate = useNavigate();
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

      <Grid container spacing={3}>
        {orders.length > 0 ? (
          orders.map(order => (
            <Grid item xs={12} md={6} key={order.id}>
              <Card sx={{ height: '100%' }}>
                <CardContent>
                  <Box
                    sx={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'flex-start',
                      mb: 2,
                    }}
                  >
                    <Typography variant="h6" component="div">
                      {order.title}
                    </Typography>
                    <Chip
                      label={order.status}
                      color={getStatusColor(order.status)}
                      size="small"
                    />
                  </Box>

                  {order.description && (
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{ mb: 2 }}
                    >
                      {order.description.length > 100
                        ? `${order.description.substring(0, 100)}...`
                        : order.description}
                    </Typography>
                  )}

                  <Box sx={{ mb: 2 }}>
                    <Typography variant="caption" color="text.secondary">
                      Created: {new Date(order.created_at).toLocaleDateString()}
                    </Typography>
                    {order.deadline && (
                      <Typography
                        variant="caption"
                        color="text.secondary"
                        sx={{ ml: 2 }}
                      >
                        Deadline:{' '}
                        {new Date(order.deadline).toLocaleDateString()}
                      </Typography>
                    )}
                  </Box>

                  {order.estimated_cycles && (
                    <Box sx={{ mb: 2 }}>
                      <Box
                        sx={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          mb: 1,
                        }}
                      >
                        <Typography variant="body2" color="text.secondary">
                          Progress
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {order.total_cycles_completed || 0} /{' '}
                          {order.estimated_cycles} cycles
                        </Typography>
                      </Box>
                      <LinearProgress
                        variant="determinate"
                        value={getProgressPercentage(order)}
                        sx={{ height: 8, borderRadius: 4 }}
                      />
                    </Box>
                  )}

                  {order.cycle_packs && order.cycle_packs.length > 0 && (
                    <Box sx={{ mb: 2 }}>
                      <Typography
                        variant="caption"
                        color="text.secondary"
                        gutterBottom
                      >
                        Cycle Packs:
                      </Typography>
                      <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                        {order.cycle_packs.map(pack => (
                          <Chip
                            key={pack.id}
                            label={`Pack ${pack.pack_number}`}
                            variant="outlined"
                            size="small"
                            color={
                              pack.status === 'completed'
                                ? 'success'
                                : pack.status === 'in_progress'
                                ? 'info'
                                : 'default'
                            }
                          />
                        ))}
                      </Box>
                    </Box>
                  )}
                </CardContent>
                <CardActions>
                  <Button
                    size="small"
                    onClick={() => navigate(`/client/orders/${order.id}`)}
                  >
                    View Details
                  </Button>
                  {order.status !== 'completed' &&
                    order.status !== 'cancelled' && (
                      <Button size="small" color="secondary">
                        Request Update
                      </Button>
                    )}
                </CardActions>
              </Card>
            </Grid>
          ))
        ) : (
          <Grid item xs={12}>
            <Paper sx={{ p: 4, textAlign: 'center' }}>
              <Typography color="textSecondary" variant="h6">
                No orders yet
              </Typography>
              <Typography color="textSecondary" variant="body2" sx={{ mt: 1 }}>
                Contact the artist to create your first order
              </Typography>
            </Paper>
          </Grid>
        )}
      </Grid>
    </Box>
  );
};

export default ClientDashboard;

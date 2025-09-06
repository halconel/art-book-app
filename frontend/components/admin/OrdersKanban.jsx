import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  Card,
  CardContent,
  CardActions,
  Button,
  Chip,
  Grid,
  Avatar,
  LinearProgress,
  IconButton,
  Menu,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  CircularProgress,
  Alert,
} from '@mui/material';
import {
  MoreVert,
  Add,
  Person,
  Schedule,
  PlayArrow,
  CheckCircle,
  Cancel,
  Edit,
} from '@mui/icons-material';
import api from '../../services/authService';
import OrderCard from './OrderCard';

const OrdersKanban = () => {
  const [orders, setOrders] = useState({
    pending: [],
    in_progress: [],
    completed: [],
    cancelled: [],
  });
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    client_id: '',
    estimated_cycles: '',
    priority: 'medium',
    deadline: '',
  });

  const statusConfig = {
    pending: { title: 'Pending', color: '#f57c00', icon: <Schedule /> },
    in_progress: {
      title: 'In Progress',
      color: '#1976d2',
      icon: <PlayArrow />,
    },
    completed: { title: 'Completed', color: '#388e3c', icon: <CheckCircle /> },
    cancelled: { title: 'Cancelled', color: '#d32f2f', icon: <Cancel /> },
  };

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [ordersResponse, clientsResponse] = await Promise.all([
        api.get('/admin/orders'),
        api.get('/admin/users?role=client'),
      ]);

      const ordersList = ordersResponse.data.orders || [];
      const groupedOrders = ordersList.reduce(
        (acc, order) => {
          const status = order.status || 'pending';
          if (!acc[status]) acc[status] = [];
          acc[status].push(order);
          return acc;
        },
        { pending: [], in_progress: [], completed: [], cancelled: [] }
      );

      setOrders(groupedOrders);
      setClients(clientsResponse.data.users || []);
      setError('');
    } catch (err) {
      setError('Failed to fetch orders');
      // eslint-disable-next-line no-console
      console.error('Failed to fetch orders:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleMenuClick = (event, order) => {
    setAnchorEl(event.currentTarget);
    setSelectedOrder(order);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedOrder(null);
  };

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      await api.put(`/admin/orders/${orderId}`, {
        order: { status: newStatus },
      });
      fetchData();
    } catch (err) {
      setError('Failed to update order status');
      // eslint-disable-next-line no-console
      console.error('Failed to update order status:', err);
    }
    handleMenuClose();
  };

  const handleOpenDialog = (order = null) => {
    setSelectedOrder(order);
    setFormData(
      order
        ? {
            title: order.title,
            description: order.description || '',
            client_id: order.client_id,
            estimated_cycles: order.estimated_cycles || '',
            priority: order.priority || 'medium',
            deadline: order.deadline ? order.deadline.split('T')[0] : '',
          }
        : {
            title: '',
            description: '',
            client_id: '',
            estimated_cycles: '',
            priority: 'medium',
            deadline: '',
          }
    );
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedOrder(null);
    setFormData({
      title: '',
      description: '',
      client_id: '',
      estimated_cycles: '',
      priority: 'medium',
      deadline: '',
    });
  };

  const handleSubmit = async () => {
    try {
      const orderData = {
        ...formData,
        estimated_cycles: formData.estimated_cycles
          ? parseInt(formData.estimated_cycles, 10)
          : null,
      };

      if (selectedOrder) {
        await api.put(`/admin/orders/${selectedOrder.id}`, {
          order: orderData,
        });
      } else {
        await api.post('/admin/orders', { order: orderData });
      }

      handleCloseDialog();
      fetchData();
    } catch (err) {
      setError('Failed to save order');
      // eslint-disable-next-line no-console
      console.error('Failed to save order:', err);
    }
  };

  const getProgressPercentage = order => {
    if (!order.estimated_cycles || !order.total_cycles_completed) return 0;
    return Math.min(
      (order.total_cycles_completed / order.estimated_cycles) * 100,
      100
    );
  };

  const getPriorityColor = priority => {
    switch (priority) {
      case 'high':
        return 'error';
      case 'medium':
        return 'warning';
      case 'low':
        return 'success';
      default:
        return 'default';
    }
  };

  const OrderCard = ({ order }) => (
    <Card sx={{ mb: 2, border: '1px solid', borderColor: 'divider' }}>
      <CardContent sx={{ pb: 1 }}>
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="flex-start"
          mb={1}
        >
          <Typography variant="h6" sx={{ fontSize: '1rem', fontWeight: 500 }}>
            {order.title}
          </Typography>
          <IconButton size="small" onClick={e => handleMenuClick(e, order)}>
            <MoreVert />
          </IconButton>
        </Box>

        {order.description && (
          <Typography variant="body2" color="textSecondary" sx={{ mb: 2 }}>
            {order.description.length > 100
              ? `${order.description.substring(0, 100)}...`
              : order.description}
          </Typography>
        )}

        <Box display="flex" alignItems="center" gap={1} mb={2}>
          <Avatar sx={{ width: 24, height: 24, fontSize: '0.75rem' }}>
            <Person />
          </Avatar>
          <Typography variant="body2">
            {order.client?.email || 'No client'}
          </Typography>
        </Box>

        {order.estimated_cycles && (
          <Box mb={2}>
            <Box display="flex" justifyContent="space-between" mb={0.5}>
              <Typography variant="body2" color="textSecondary">
                Progress
              </Typography>
              <Typography variant="body2" color="textSecondary">
                {order.total_cycles_completed || 0} / {order.estimated_cycles}{' '}
                cycles
              </Typography>
            </Box>
            <LinearProgress
              variant="determinate"
              value={getProgressPercentage(order)}
              sx={{ height: 6, borderRadius: 3 }}
            />
          </Box>
        )}

        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Chip
            label={order.priority}
            size="small"
            color={getPriorityColor(order.priority)}
          />
          {order.deadline && (
            <Typography variant="caption" color="textSecondary">
              Due: {new Date(order.deadline).toLocaleDateString()}
            </Typography>
          )}
        </Box>
      </CardContent>

      <CardActions sx={{ pt: 0, px: 2, pb: 2 }}>
        <Button size="small" onClick={() => handleOpenDialog(order)}>
          <Edit sx={{ mr: 0.5, fontSize: 16 }} />
          Edit
        </Button>
      </CardActions>
    </Card>
  );

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
        <Typography variant="h4" gutterBottom>
          Orders Kanban Board
        </Typography>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={() => handleOpenDialog()}
        >
          Create Order
        </Button>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Grid container spacing={3}>
        {Object.entries(statusConfig).map(([status, config]) => (
          <Grid item xs={12} sm={6} lg={3} key={status}>
            <Paper sx={{ p: 2, minHeight: '600px' }}>
              <Box display="flex" alignItems="center" mb={2}>
                <Box sx={{ color: config.color, mr: 1 }}>{config.icon}</Box>
                <Typography variant="h6">{config.title}</Typography>
                <Chip
                  label={orders[status]?.length || 0}
                  size="small"
                  sx={{ ml: 1 }}
                />
              </Box>

              <Box>
                {orders[status]?.map(order => (
                  <OrderCard key={order.id} order={order} />
                ))}

                {orders[status]?.length === 0 && (
                  <Typography
                    color="textSecondary"
                    align="center"
                    sx={{ mt: 4 }}
                  >
                    No {status.replace('_', ' ')} orders
                  </Typography>
                )}
              </Box>
            </Paper>
          </Grid>
        ))}
      </Grid>

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        {Object.entries(statusConfig).map(([status, config]) => (
          <MenuItem
            key={status}
            onClick={() => handleStatusChange(selectedOrder?.id, status)}
            disabled={selectedOrder?.status === status}
          >
            <Box display="flex" alignItems="center" gap={1}>
              <Box sx={{ color: config.color }}>{config.icon}</Box>
              Move to {config.title}
            </Box>
          </MenuItem>
        ))}
      </Menu>

      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          {selectedOrder ? 'Edit Order' : 'Create New Order'}
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Order Title"
                value={formData.title}
                onChange={e =>
                  setFormData(prev => ({ ...prev, title: e.target.value }))
                }
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Description"
                multiline
                rows={3}
                value={formData.description}
                onChange={e =>
                  setFormData(prev => ({
                    ...prev,
                    description: e.target.value,
                  }))
                }
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Client</InputLabel>
                <Select
                  value={formData.client_id}
                  label="Client"
                  onChange={e =>
                    setFormData(prev => ({
                      ...prev,
                      client_id: e.target.value,
                    }))
                  }
                >
                  {clients.map(client => (
                    <MenuItem key={client.id} value={client.id}>
                      {client.email}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Estimated Cycles"
                type="number"
                value={formData.estimated_cycles}
                onChange={e =>
                  setFormData(prev => ({
                    ...prev,
                    estimated_cycles: e.target.value,
                  }))
                }
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Priority</InputLabel>
                <Select
                  value={formData.priority}
                  label="Priority"
                  onChange={e =>
                    setFormData(prev => ({ ...prev, priority: e.target.value }))
                  }
                >
                  <MenuItem value="low">Low</MenuItem>
                  <MenuItem value="medium">Medium</MenuItem>
                  <MenuItem value="high">High</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Deadline"
                type="date"
                InputLabelProps={{ shrink: true }}
                value={formData.deadline}
                onChange={e =>
                  setFormData(prev => ({ ...prev, deadline: e.target.value }))
                }
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button onClick={handleSubmit} variant="contained">
            {selectedOrder ? 'Update' : 'Create'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default OrdersKanban;

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  Chip,
  LinearProgress,
  Paper,
  Stepper,
  Step,
  StepLabel,
  StepContent,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  CircularProgress,
  Alert,
  Divider,
} from '@mui/material';
import {
  Timeline,
  TimelineItem,
  TimelineSeparator,
  TimelineConnector,
  TimelineContent,
  TimelineDot,
} from '@mui/lab';
import {
  ArrowBack,
  Schedule,
  CheckCircle,
  PlayArrow,
  Cancel,
  Person,
  CalendarToday,
  Flag,
  Assignment,
  RequestPage,
  Message,
} from '@mui/icons-material';
import api from '../../services/authService';

const OrderDetail = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [openRefundDialog, setOpenRefundDialog] = useState(false);
  const [refundReason, setRefundReason] = useState('');

  useEffect(() => {
    fetchOrderDetail();
  }, [orderId]);

  const fetchOrderDetail = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/client/orders/${orderId}`);
      setOrder(response.data);
      setError('');
    } catch (err) {
      setError('Failed to fetch order details');
      // eslint-disable-next-line no-console
      console.error('Failed to fetch order:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleRefundRequest = async () => {
    try {
      await api.post('/client/refund-requests', {
        refund_request: {
          order_id: orderId,
          reason: refundReason,
        },
      });
      setOpenRefundDialog(false);
      setRefundReason('');
      // Refresh order data to show refund request
      fetchOrderDetail();
    } catch (err) {
      setError('Failed to submit refund request');
      // eslint-disable-next-line no-console
      console.error('Failed to submit refund request:', err);
    }
  };

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

  const getStatusIcon = status => {
    switch (status) {
      case 'pending':
        return <Schedule />;
      case 'in_progress':
        return <PlayArrow />;
      case 'completed':
        return <CheckCircle />;
      case 'cancelled':
        return <Cancel />;
      default:
        return <Schedule />;
    }
  };

  const getProgressPercentage = order => {
    if (!order.estimated_cycles) return 0;
    const completed = order.total_cycles_completed || 0;
    return Math.min((completed / order.estimated_cycles) * 100, 100);
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

  const getStepStatus = pack => {
    switch (pack.status) {
      case 'completed':
        return 'completed';
      case 'in_progress':
        return 'active';
      default:
        return 'inactive';
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

  if (!order) {
    return (
      <Box textAlign="center" py={4}>
        <Typography variant="h6" color="textSecondary">
          Order not found
        </Typography>
        <Button
          startIcon={<ArrowBack />}
          onClick={() => navigate('/client')}
          sx={{ mt: 2 }}
        >
          Back to Dashboard
        </Button>
      </Box>
    );
  }

  return (
    <Box>
      <Box display="flex" alignItems="center" mb={3}>
        <Button
          startIcon={<ArrowBack />}
          onClick={() => navigate('/client')}
          sx={{ mr: 2 }}
        >
          Back
        </Button>
        <Typography variant="h4" component="h1">
          {order.title}
        </Typography>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Grid container spacing={3}>
        {/* Order Overview */}
        <Grid item xs={12} md={8}>
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Box
                display="flex"
                justifyContent="space-between"
                alignItems="flex-start"
                mb={2}
              >
                <Typography variant="h5" component="h2">
                  Order Overview
                </Typography>
                <Box display="flex" gap={1}>
                  <Chip
                    icon={getStatusIcon(order.status)}
                    label={order.status}
                    color={getStatusColor(order.status)}
                  />
                  <Chip
                    icon={<Flag />}
                    label={order.priority}
                    color={getPriorityColor(order.priority)}
                    variant="outlined"
                  />
                </Box>
              </Box>

              {order.description && (
                <Typography
                  variant="body1"
                  color="text.secondary"
                  sx={{ mb: 2 }}
                >
                  {order.description}
                </Typography>
              )}

              <Grid container spacing={2} sx={{ mb: 2 }}>
                <Grid item xs={12} sm={6}>
                  <Box display="flex" alignItems="center" gap={1}>
                    <CalendarToday color="action" />
                    <Typography variant="body2">
                      Created: {new Date(order.created_at).toLocaleDateString()}
                    </Typography>
                  </Box>
                </Grid>
                {order.deadline && (
                  <Grid item xs={12} sm={6}>
                    <Box display="flex" alignItems="center" gap={1}>
                      <Schedule color="action" />
                      <Typography variant="body2">
                        Deadline:{' '}
                        {new Date(order.deadline).toLocaleDateString()}
                      </Typography>
                    </Box>
                  </Grid>
                )}
              </Grid>

              {order.estimated_cycles && (
                <Box>
                  <Typography variant="h6" gutterBottom>
                    Progress Tracking
                  </Typography>
                  <Box display="flex" justifyContent="space-between" mb={1}>
                    <Typography variant="body2" color="text.secondary">
                      Cycles Completed
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {order.total_cycles_completed || 0} /{' '}
                      {order.estimated_cycles}
                    </Typography>
                  </Box>
                  <LinearProgress
                    variant="determinate"
                    value={getProgressPercentage(order)}
                    sx={{ height: 12, borderRadius: 6, mb: 2 }}
                  />
                  <Typography variant="body2" color="text.secondary">
                    {Math.round(getProgressPercentage(order))}% Complete
                  </Typography>
                </Box>
              )}
            </CardContent>
          </Card>

          {/* Cycle Packs Timeline */}
          {order.cycle_packs && order.cycle_packs.length > 0 && (
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Work Cycle Packs
                </Typography>
                <Stepper orientation="vertical" activeStep={-1}>
                  {order.cycle_packs.map((pack, index) => (
                    <Step key={pack.id} completed={pack.status === 'completed'}>
                      <StepLabel
                        StepIconComponent={() => (
                          <Box
                            sx={{
                              width: 24,
                              height: 24,
                              borderRadius: '50%',
                              backgroundColor:
                                pack.status === 'completed'
                                  ? 'success.main'
                                  : pack.status === 'in_progress'
                                  ? 'info.main'
                                  : 'grey.300',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              color: 'white',
                            }}
                          >
                            {pack.pack_number}
                          </Box>
                        )}
                      >
                        <Typography variant="subtitle1">
                          Pack #{pack.pack_number}
                        </Typography>
                      </StepLabel>
                      <StepContent>
                        <Box sx={{ ml: 3 }}>
                          <Typography variant="body2" color="text.secondary">
                            {pack.cycles_in_pack} cycles planned
                          </Typography>
                          {pack.started_at && (
                            <Typography variant="body2" color="text.secondary">
                              Started:{' '}
                              {new Date(pack.started_at).toLocaleDateString()}
                            </Typography>
                          )}
                          {pack.completed_at && (
                            <Typography variant="body2" color="text.secondary">
                              Completed:{' '}
                              {new Date(pack.completed_at).toLocaleDateString()}
                            </Typography>
                          )}
                          {pack.notes && (
                            <Typography
                              variant="body2"
                              sx={{
                                mt: 1,
                                p: 1,
                                bgcolor: 'grey.50',
                                borderRadius: 1,
                              }}
                            >
                              {pack.notes}
                            </Typography>
                          )}
                        </Box>
                      </StepContent>
                    </Step>
                  ))}
                </Stepper>
              </CardContent>
            </Card>
          )}
        </Grid>

        {/* Sidebar Actions */}
        <Grid item xs={12} md={4}>
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Actions
              </Typography>

              <Box display="flex" flexDirection="column" gap={2}>
                <Button
                  variant="outlined"
                  startIcon={<Message />}
                  fullWidth
                  disabled={order.status === 'completed'}
                >
                  Contact Artist
                </Button>

                <Button
                  variant="outlined"
                  startIcon={<RequestPage />}
                  fullWidth
                  onClick={() => setOpenRefundDialog(true)}
                  disabled={
                    order.status === 'completed' || order.status === 'cancelled'
                  }
                >
                  Request Refund
                </Button>
              </Box>
            </CardContent>
          </Card>

          {/* Order Stats */}
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Order Statistics
              </Typography>

              <Box display="flex" flexDirection="column" gap={2}>
                <Box display="flex" justifyContent="space-between">
                  <Typography variant="body2" color="text.secondary">
                    Status:
                  </Typography>
                  <Typography variant="body2">{order.status}</Typography>
                </Box>

                <Box display="flex" justifyContent="space-between">
                  <Typography variant="body2" color="text.secondary">
                    Priority:
                  </Typography>
                  <Typography variant="body2">{order.priority}</Typography>
                </Box>

                {order.estimated_cycles && (
                  <Box display="flex" justifyContent="space-between">
                    <Typography variant="body2" color="text.secondary">
                      Estimated Duration:
                    </Typography>
                    <Typography variant="body2">
                      {order.estimated_cycles} cycles
                    </Typography>
                  </Box>
                )}

                <Divider />

                <Box display="flex" justifyContent="space-between">
                  <Typography variant="body2" color="text.secondary">
                    Cycle Packs:
                  </Typography>
                  <Typography variant="body2">
                    {order.cycle_packs?.length || 0}
                  </Typography>
                </Box>

                <Box display="flex" justifyContent="space-between">
                  <Typography variant="body2" color="text.secondary">
                    Progress:
                  </Typography>
                  <Typography variant="body2">
                    {Math.round(getProgressPercentage(order))}%
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Refund Request Dialog */}
      <Dialog
        open={openRefundDialog}
        onClose={() => setOpenRefundDialog(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Request Refund</DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Please provide a reason for your refund request. This will be
            reviewed by the artist.
          </Typography>
          <TextField
            autoFocus
            margin="dense"
            label="Refund Reason"
            fullWidth
            multiline
            rows={4}
            variant="outlined"
            value={refundReason}
            onChange={e => setRefundReason(e.target.value)}
            placeholder="Please explain why you are requesting a refund..."
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenRefundDialog(false)}>Cancel</Button>
          <Button
            onClick={handleRefundRequest}
            variant="contained"
            disabled={!refundReason.trim()}
          >
            Submit Request
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default OrderDetail;

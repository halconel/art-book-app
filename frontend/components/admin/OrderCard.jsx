import React from 'react';
import {
  Card,
  CardContent,
  CardActions,
  Button,
  Typography,
  Box,
  Avatar,
  LinearProgress,
  IconButton,
  Chip
} from '@mui/material';
import {
  MoreVert,
  Person,
  Edit
} from '@mui/icons-material';

const OrderCard = ({ order, onMenuClick, onEdit, getProgressPercentage, getPriorityColor }) => (
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
        <IconButton size="small" onClick={e => onMenuClick(e, order)}>
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
              {order.total_cycles_completed || 0} / {order.estimated_cycles} cycles
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
      <Button size="small" onClick={() => onEdit(order)}>
        <Edit sx={{ mr: 0.5, fontSize: 16 }} />
        Edit
      </Button>
    </CardActions>
  </Card>
);

export default OrderCard;
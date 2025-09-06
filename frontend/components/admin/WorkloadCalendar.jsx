import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  Grid,
  Card,
  CardContent,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  Tooltip,
  CircularProgress,
  Alert,
  IconButton,
} from '@mui/material';
import {
  ChevronLeft,
  ChevronRight,
  Add,
  Edit,
  TrendingUp,
  Work,
  Person,
} from '@mui/icons-material';
import {
  format,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  isSameMonth,
  addMonths,
  subMonths,
} from 'date-fns';
import api from '../../services/authService';

const WorkloadCalendar = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [workloadData, setWorkloadData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [formData, setFormData] = useState({
    cycles_completed: 0,
    is_personal_project: false,
    intensity_level: 3,
    notes: '',
  });

  useEffect(() => {
    fetchWorkloadData();
  }, [currentDate]);

  const fetchWorkloadData = async () => {
    try {
      setLoading(true);
      const startDate = format(startOfMonth(currentDate), 'yyyy-MM-dd');
      const endDate = format(endOfMonth(currentDate), 'yyyy-MM-dd');

      const response = await api.get('/admin/workload-calendar', {
        params: { start_date: startDate, end_date: endDate },
      });

      setWorkloadData(response.data.calendar || []);
      setError('');
    } catch (err) {
      setError('Failed to fetch workload data');
      // eslint-disable-next-line no-console
      console.error('Failed to fetch workload data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handlePrevMonth = () => {
    setCurrentDate(prev => subMonths(prev, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(prev => addMonths(prev, 1));
  };

  const handleDateClick = date => {
    const existing = workloadData.find(
      item =>
        format(new Date(item.date), 'yyyy-MM-dd') === format(date, 'yyyy-MM-dd')
    );

    setSelectedDate(date);
    setFormData(
      existing || {
        cycles_completed: 0,
        is_personal_project: false,
        intensity_level: 3,
        notes: '',
      }
    );
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedDate(null);
    setFormData({
      cycles_completed: 0,
      is_personal_project: false,
      intensity_level: 3,
      notes: '',
    });
  };

  const handleSubmit = async () => {
    try {
      const dateStr = format(selectedDate, 'yyyy-MM-dd');
      await api.post('/admin/workload-calendar', {
        workload_calendar: {
          date: dateStr,
          ...formData,
        },
      });

      handleCloseDialog();
      fetchWorkloadData();
    } catch (err) {
      setError('Failed to save workload data');
      // eslint-disable-next-line no-console
      console.error('Failed to save workload data:', err);
    }
  };

  const getWorkloadForDate = date => {
    return workloadData.find(
      item =>
        format(new Date(item.date), 'yyyy-MM-dd') === format(date, 'yyyy-MM-dd')
    );
  };

  const getIntensityColor = level => {
    const colors = {
      1: '#e8f5e8',
      2: '#c8e6c9',
      3: '#81c784',
      4: '#4caf50',
      5: '#2e7d32',
    };
    return colors[level] || '#f5f5f5';
  };

  const getCycleColor = cycles => {
    if (cycles === 0) return '#f5f5f5';
    if (cycles <= 2) return '#fff3e0';
    if (cycles <= 5) return '#ffcc02';
    if (cycles <= 8) return '#ff9800';
    return '#f57c00';
  };

  const monthDays = eachDayOfInterval({
    start: startOfMonth(currentDate),
    end: endOfMonth(currentDate),
  });

  const totalCycles = workloadData.reduce(
    (sum, item) => sum + (item.cycles_completed || 0),
    0
  );
  const workingDays = workloadData.filter(
    item => item.cycles_completed > 0
  ).length;
  const personalProjectDays = workloadData.filter(
    item => item.is_personal_project
  ).length;

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
        Workload Calendar
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {/* Statistics Cards */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={4}>
          <Card>
            <CardContent>
              <Box
                display="flex"
                alignItems="center"
                justifyContent="space-between"
              >
                <Box>
                  <Typography color="textSecondary" gutterBottom>
                    Total Cycles
                  </Typography>
                  <Typography variant="h4">{totalCycles}</Typography>
                </Box>
                <TrendingUp color="primary" fontSize="large" />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={4}>
          <Card>
            <CardContent>
              <Box
                display="flex"
                alignItems="center"
                justifyContent="space-between"
              >
                <Box>
                  <Typography color="textSecondary" gutterBottom>
                    Working Days
                  </Typography>
                  <Typography variant="h4">{workingDays}</Typography>
                </Box>
                <Work color="success" fontSize="large" />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={4}>
          <Card>
            <CardContent>
              <Box
                display="flex"
                alignItems="center"
                justifyContent="space-between"
              >
                <Box>
                  <Typography color="textSecondary" gutterBottom>
                    Personal Projects
                  </Typography>
                  <Typography variant="h4">{personalProjectDays}</Typography>
                </Box>
                <Person color="info" fontSize="large" />
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Calendar Header */}
      <Paper sx={{ p: 2, mb: 2 }}>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <IconButton onClick={handlePrevMonth}>
            <ChevronLeft />
          </IconButton>

          <Typography variant="h5">
            {format(currentDate, 'MMMM yyyy')}
          </Typography>

          <IconButton onClick={handleNextMonth}>
            <ChevronRight />
          </IconButton>
        </Box>
      </Paper>

      {/* Calendar Grid */}
      <Paper sx={{ p: 2 }}>
        <Grid container spacing={1}>
          {/* Day headers */}
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
            <Grid item xs key={day} sx={{ textAlign: 'center' }}>
              <Typography
                variant="subtitle2"
                color="textSecondary"
                sx={{ p: 1 }}
              >
                {day}
              </Typography>
            </Grid>
          ))}

          {/* Calendar days */}
          {monthDays.map(day => {
            const workload = getWorkloadForDate(day);
            const dayNumber = format(day, 'd');
            const isCurrentMonth = isSameMonth(day, currentDate);

            return (
              <Grid item xs key={day.toISOString()} sx={{ minHeight: '120px' }}>
                <Card
                  sx={{
                    height: '100%',
                    cursor: 'pointer',
                    backgroundColor: workload
                      ? getCycleColor(workload.cycles_completed)
                      : '#fafafa',
                    opacity: isCurrentMonth ? 1 : 0.3,
                    '&:hover': {
                      backgroundColor: workload
                        ? getCycleColor(workload.cycles_completed)
                        : '#e0e0e0',
                      transform: 'scale(1.02)',
                    },
                    transition: 'all 0.2s',
                  }}
                  onClick={() => handleDateClick(day)}
                >
                  <CardContent sx={{ p: 1, minHeight: '100px' }}>
                    <Typography
                      variant="body2"
                      sx={{ fontWeight: 'bold', mb: 1 }}
                    >
                      {dayNumber}
                    </Typography>

                    {workload && (
                      <Box>
                        {workload.cycles_completed > 0 && (
                          <Tooltip
                            title={`${workload.cycles_completed} cycles completed`}
                          >
                            <Chip
                              label={workload.cycles_completed}
                              size="small"
                              sx={{ mb: 0.5, fontSize: '0.7rem' }}
                            />
                          </Tooltip>
                        )}

                        {workload.is_personal_project && (
                          <Tooltip title="Personal project day">
                            <Chip
                              label="Personal"
                              size="small"
                              color="info"
                              sx={{ fontSize: '0.6rem' }}
                            />
                          </Tooltip>
                        )}

                        {workload.notes && (
                          <Typography
                            variant="caption"
                            sx={{
                              display: 'block',
                              mt: 0.5,
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                              whiteSpace: 'nowrap',
                            }}
                          >
                            {workload.notes}
                          </Typography>
                        )}
                      </Box>
                    )}
                  </CardContent>
                </Card>
              </Grid>
            );
          })}
        </Grid>
      </Paper>

      {/* Add/Edit Dialog */}
      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          {selectedDate &&
            `Workload for ${format(selectedDate, 'MMMM d, yyyy')}`}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2 }}>
            <TextField
              fullWidth
              label="Cycles Completed"
              type="number"
              value={formData.cycles_completed}
              onChange={e =>
                setFormData(prev => ({
                  ...prev,
                  cycles_completed: parseInt(e.target.value, 10) || 0,
                }))
              }
              sx={{ mb: 2 }}
            />

            <FormControl fullWidth sx={{ mb: 2 }}>
              <InputLabel>Project Type</InputLabel>
              <Select
                value={formData.is_personal_project}
                label="Project Type"
                onChange={e =>
                  setFormData(prev => ({
                    ...prev,
                    is_personal_project: e.target.value,
                  }))
                }
              >
                <MenuItem value={false}>Client Work</MenuItem>
                <MenuItem value>Personal Project</MenuItem>
              </Select>
            </FormControl>

            <FormControl fullWidth sx={{ mb: 2 }}>
              <InputLabel>Intensity Level</InputLabel>
              <Select
                value={formData.intensity_level}
                label="Intensity Level"
                onChange={e =>
                  setFormData(prev => ({
                    ...prev,
                    intensity_level: e.target.value,
                  }))
                }
              >
                <MenuItem value={1}>1 - Very Light</MenuItem>
                <MenuItem value={2}>2 - Light</MenuItem>
                <MenuItem value={3}>3 - Medium</MenuItem>
                <MenuItem value={4}>4 - High</MenuItem>
                <MenuItem value={5}>5 - Very High</MenuItem>
              </Select>
            </FormControl>

            <TextField
              fullWidth
              label="Notes"
              multiline
              rows={3}
              value={formData.notes}
              onChange={e =>
                setFormData(prev => ({ ...prev, notes: e.target.value }))
              }
              placeholder="Additional notes about this day's work..."
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button onClick={handleSubmit} variant="contained">
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default WorkloadCalendar;

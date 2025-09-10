import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  Grid,
  Card,
  CardContent,
  IconButton,
  Tooltip,
  CircularProgress,
  Alert,
  Chip,
} from '@mui/material';
import {
  ChevronLeft,
  ChevronRight,
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

const ArtistWorkloadCalendar = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [workloadData, setWorkloadData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchWorkloadData();
  }, [currentDate]);

  const fetchWorkloadData = async () => {
    try {
      setLoading(true);
      const startDate = format(startOfMonth(currentDate), 'yyyy-MM-dd');
      const endDate = format(endOfMonth(currentDate), 'yyyy-MM-dd');

      const response = await api.get('/client/workload', {
        params: { start_date: startDate, end_date: endDate },
      });

      setWorkloadData(response.data.calendar || []);
      setError('');
    } catch (err) {
      setError('Failed to fetch artist workload data');
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

  const getWorkloadForDate = date => {
    return workloadData.find(
      item =>
        format(new Date(item.date), 'yyyy-MM-dd') === format(date, 'yyyy-MM-dd')
    );
  };

  const getCycleColor = (cycles, isPersonal = false) => {
    if (cycles === 0) return '#f5f5f5';

    // Different color schemes for personal vs client work
    if (isPersonal) {
      if (cycles <= 2) return '#e3f2fd'; // Light blue
      if (cycles <= 5) return '#2196f3'; // Blue
      if (cycles <= 8) return '#1976d2'; // Darker blue
      return '#0d47a1'; // Deep blue
    } else {
      if (cycles <= 2) return '#fff3e0'; // Light orange
      if (cycles <= 5) return '#ffcc02'; // Yellow
      if (cycles <= 8) return '#ff9800'; // Orange
      return '#f57c00'; // Deep orange
    }
  };

  const getIntensityDescription = level => {
    switch (level) {
      case 1:
        return 'Very Light';
      case 2:
        return 'Light';
      case 3:
        return 'Medium';
      case 4:
        return 'High';
      case 5:
        return 'Very High';
      default:
        return 'Unknown';
    }
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
  const avgCyclesPerDay =
    workingDays > 0 ? (totalCycles / workingDays).toFixed(1) : 0;

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
        Artist Workload Calendar
      </Typography>

      <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
        Track the artist's daily work activity and see when they're working on
        your projects.
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {/* Statistics Cards */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={3}>
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

        <Grid item xs={12} sm={6} md={3}>
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

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box
                display="flex"
                alignItems="center"
                justifyContent="space-between"
              >
                <Box>
                  <Typography color="textSecondary" gutterBottom>
                    Personal Days
                  </Typography>
                  <Typography variant="h4">{personalProjectDays}</Typography>
                </Box>
                <Person color="info" fontSize="large" />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box
                display="flex"
                alignItems="center"
                justifyContent="space-between"
              >
                <Box>
                  <Typography color="textSecondary" gutterBottom>
                    Avg Cycles/Day
                  </Typography>
                  <Typography variant="h4">{avgCyclesPerDay}</Typography>
                </Box>
                <TrendingUp color="warning" fontSize="large" />
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Legend */}
      <Paper sx={{ p: 2, mb: 2 }}>
        <Typography variant="h6" gutterBottom>
          Legend
        </Typography>
        <Grid container spacing={2} alignItems="center">
          <Grid item>
            <Box display="flex" alignItems="center" gap={1}>
              <Box
                sx={{
                  width: 20,
                  height: 20,
                  backgroundColor: '#ff9800',
                  borderRadius: 1,
                }}
              />
              <Typography variant="body2">Client Work</Typography>
            </Box>
          </Grid>
          <Grid item>
            <Box display="flex" alignItems="center" gap={1}>
              <Box
                sx={{
                  width: 20,
                  height: 20,
                  backgroundColor: '#2196f3',
                  borderRadius: 1,
                }}
              />
              <Typography variant="body2">Personal Projects</Typography>
            </Box>
          </Grid>
          <Grid item>
            <Box display="flex" alignItems="center" gap={1}>
              <Box
                sx={{
                  width: 20,
                  height: 20,
                  backgroundColor: '#f5f5f5',
                  border: '1px solid #ddd',
                  borderRadius: 1,
                }}
              />
              <Typography variant="body2">No Activity</Typography>
            </Box>
          </Grid>
        </Grid>
      </Paper>

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
            const today = new Date();
            const isToday =
              format(day, 'yyyy-MM-dd') === format(today, 'yyyy-MM-dd');

            return (
              <Grid item xs key={day.toISOString()} sx={{ minHeight: '120px' }}>
                <Tooltip
                  title={
                    workload ? (
                      <Box>
                        <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                          {format(day, 'MMM d, yyyy')}
                        </Typography>
                        <Typography variant="body2">
                          {workload.cycles_completed} cycles completed
                        </Typography>
                        <Typography variant="body2">
                          Type:{' '}
                          {workload.is_personal_project
                            ? 'Personal Project'
                            : 'Client Work'}
                        </Typography>
                        <Typography variant="body2">
                          Intensity:{' '}
                          {getIntensityDescription(workload.intensity_level)}
                        </Typography>
                        {workload.notes && (
                          <Typography variant="body2" sx={{ mt: 1 }}>
                            Notes: {workload.notes}
                          </Typography>
                        )}
                      </Box>
                    ) : (
                      `${format(day, 'MMM d, yyyy')} - No activity`
                    )
                  }
                  arrow
                  placement="top"
                >
                  <Card
                    sx={{
                      height: '100%',
                      backgroundColor: workload
                        ? getCycleColor(
                            workload.cycles_completed,
                            workload.is_personal_project
                          )
                        : '#fafafa',
                      opacity: isCurrentMonth ? 1 : 0.3,
                      border: isToday ? 2 : 0,
                      borderColor: isToday ? 'primary.main' : 'transparent',
                      cursor: 'default',
                      transition: 'all 0.2s',
                      '&:hover': {
                        transform: 'scale(1.05)',
                        zIndex: 1,
                      },
                    }}
                  >
                    <CardContent sx={{ p: 1, minHeight: '100px' }}>
                      <Typography
                        variant="body2"
                        sx={{
                          fontWeight: 'bold',
                          mb: 1,
                          color: isToday ? 'primary.main' : 'inherit',
                        }}
                      >
                        {dayNumber}
                      </Typography>

                      {workload && (
                        <Box>
                          {workload.cycles_completed > 0 && (
                            <Chip
                              label={workload.cycles_completed}
                              size="small"
                              sx={{
                                mb: 0.5,
                                fontSize: '0.7rem',
                                backgroundColor: 'rgba(255,255,255,0.8)',
                              }}
                            />
                          )}

                          {workload.is_personal_project && (
                            <Chip
                              label="Personal"
                              size="small"
                              color="info"
                              variant="outlined"
                              sx={{
                                fontSize: '0.6rem',
                                backgroundColor: 'rgba(255,255,255,0.8)',
                              }}
                            />
                          )}
                        </Box>
                      )}
                    </CardContent>
                  </Card>
                </Tooltip>
              </Grid>
            );
          })}
        </Grid>
      </Paper>

      {/* Activity Summary */}
      <Paper sx={{ p: 2, mt: 2 }}>
        <Typography variant="h6" gutterBottom>
          Activity Summary for {format(currentDate, 'MMMM yyyy')}
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <Typography variant="body2" color="text.secondary">
              • {workingDays} days with activity out of {monthDays.length} days
            </Typography>
            <Typography variant="body2" color="text.secondary">
              • {totalCycles} total work cycles completed
            </Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography variant="body2" color="text.secondary">
              • {personalProjectDays} days on personal projects
            </Typography>
            <Typography variant="body2" color="text.secondary">
              • {workingDays - personalProjectDays} days on client work
            </Typography>
          </Grid>
        </Grid>
      </Paper>
    </Box>
  );
};

export default ArtistWorkloadCalendar;

import React from 'react';
import {
  Box,
  Paper,
  Typography,
  Grid,
  Card,
  CardContent,
  useTheme,
} from '@mui/material';
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  RadialBarChart,
  RadialBar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

const CustomTooltip = ({ active, payload, label, formatter = null }) => {
  if (active && payload && payload.length) {
    return (
      <Paper sx={{ p: 1.5, minWidth: 120 }}>
        <Typography variant="body2" sx={{ mb: 0.5 }}>
          {label}
        </Typography>
        {payload.map((entry, index) => (
          <Typography
            key={index}
            variant="body2"
            sx={{ color: entry.color, fontSize: '0.875rem' }}
          >
            {entry.name}: {formatter ? formatter(entry.value) : entry.value}
          </Typography>
        ))}
      </Paper>
    );
  }
  return null;
};

const StatisticsCharts = ({
  data = {},
  title = 'Statistics Overview',
  showAll = false,
}) => {
  const theme = useTheme();

  // Default data structure
  const defaultData = {
    cycleProgress: [
      { month: 'Jan', cycles: 42, target: 60 },
      { month: 'Feb', cycles: 58, target: 60 },
      { month: 'Mar', cycles: 45, target: 60 },
      { month: 'Apr', cycles: 67, target: 60 },
      { month: 'May', cycles: 73, target: 60 },
      { month: 'Jun', cycles: 55, target: 60 },
    ],
    orderStatus: [
      { name: 'Completed', value: 45, color: theme.palette.success.main },
      { name: 'In Progress', value: 23, color: theme.palette.info.main },
      { name: 'Pending', value: 12, color: theme.palette.warning.main },
      { name: 'Cancelled', value: 5, color: theme.palette.error.main },
    ],
    dailyActivity: [
      { day: 'Mon', cycles: 12, hours: 8.5 },
      { day: 'Tue', cycles: 15, hours: 9.2 },
      { day: 'Wed', cycles: 8, hours: 6.1 },
      { day: 'Thu', cycles: 18, hours: 10.8 },
      { day: 'Fri', cycles: 14, hours: 8.9 },
      { day: 'Sat', cycles: 9, hours: 5.5 },
      { day: 'Sun', cycles: 6, hours: 3.2 },
    ],
    clientProgress: [
      { client: 'Client A', progress: 85 },
      { client: 'Client B', progress: 62 },
      { client: 'Client C', progress: 94 },
      { client: 'Client D', progress: 38 },
      { client: 'Client E', progress: 77 },
    ],
    monthlyRevenue: [
      { month: 'Jan', revenue: 4200, orders: 8 },
      { month: 'Feb', revenue: 3800, orders: 6 },
      { month: 'Mar', revenue: 5500, orders: 11 },
      { month: 'Apr', revenue: 6200, orders: 12 },
      { month: 'May', revenue: 4900, orders: 9 },
      { month: 'Jun', revenue: 7100, orders: 14 },
    ],
    ...data,
  };

  const formatCurrency = value => `$${value.toLocaleString()}`;
  const formatPercent = value => `${value}%`;

  return (
    <Box>
      <Typography
        variant="h5"
        gutterBottom
        sx={{
          mb: { xs: 2, md: 3 },
          fontSize: { xs: '1.25rem', sm: '1.5rem' },
          fontWeight: 600,
        }}
      >
        {title}
      </Typography>

      <Grid container spacing={{ xs: 2, md: 3 }}>
        {/* Cycle Progress Chart */}
        <Grid item xs={12} md={showAll ? 6 : 12}>
          <Card>
            <CardContent sx={{ p: { xs: 2, md: 3 } }}>
              <Typography
                variant="h6"
                gutterBottom
                sx={{
                  fontSize: { xs: '1rem', md: '1.25rem' },
                  fontWeight: 600,
                }}
              >
                Monthly Cycle Progress
              </Typography>
              <ResponsiveContainer width="100%" height={{ xs: 250, md: 300 }}>
                <LineChart data={defaultData.cycleProgress}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="cycles"
                    stroke={theme.palette.primary.main}
                    strokeWidth={3}
                    dot={{ fill: theme.palette.primary.main, r: 6 }}
                    activeDot={{ r: 8 }}
                  />
                  <Line
                    type="monotone"
                    dataKey="target"
                    stroke={theme.palette.secondary.main}
                    strokeDasharray="5 5"
                    strokeWidth={2}
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>

        {/* Order Status Pie Chart */}
        <Grid item xs={12} md={showAll ? 6 : 6}>
          <Card>
            <CardContent sx={{ p: { xs: 2, md: 3 } }}>
              <Typography
                variant="h6"
                gutterBottom
                sx={{
                  fontSize: { xs: '1rem', md: '1.25rem' },
                  fontWeight: 600,
                }}
              >
                Order Status Distribution
              </Typography>
              <ResponsiveContainer width="100%" height={{ xs: 250, md: 300 }}>
                <PieChart>
                  <Pie
                    data={defaultData.orderStatus}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={2}
                    dataKey="value"
                    label={({ name, percent }) =>
                      `${name} ${(percent * 100).toFixed(0)}%`
                    }
                  >
                    {defaultData.orderStatus.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>

        {/* Daily Activity */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Weekly Activity Overview
              </Typography>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={defaultData.dailyActivity}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="day" />
                  <YAxis />
                  <Tooltip content={<CustomTooltip />} />
                  <Area
                    type="monotone"
                    dataKey="cycles"
                    stackId="1"
                    stroke={theme.palette.primary.main}
                    fill={theme.palette.primary.main}
                    fillOpacity={0.6}
                  />
                  <Area
                    type="monotone"
                    dataKey="hours"
                    stackId="2"
                    stroke={theme.palette.secondary.main}
                    fill={theme.palette.secondary.main}
                    fillOpacity={0.6}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>

        {/* Client Progress */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Client Project Progress
              </Typography>
              <ResponsiveContainer width="100%" height={300}>
                <RadialBarChart
                  cx="50%"
                  cy="50%"
                  innerRadius="10%"
                  outerRadius="90%"
                  barSize={20}
                  data={defaultData.clientProgress}
                >
                  <RadialBar
                    minAngle={15}
                    label={{ position: 'insideStart', fill: '#fff' }}
                    background
                    clockWise
                    dataKey="progress"
                    fill={theme.palette.success.main}
                  />
                  <Tooltip
                    content={<CustomTooltip formatter={formatPercent} />}
                  />
                </RadialBarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>

        {showAll && (
          <>
            {/* Monthly Revenue */}
            <Grid item xs={12} md={6}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Monthly Revenue & Orders
                  </Typography>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={defaultData.monthlyRevenue}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip
                        content={<CustomTooltip formatter={formatCurrency} />}
                      />
                      <Legend />
                      <Bar
                        dataKey="revenue"
                        fill={theme.palette.primary.main}
                        radius={[4, 4, 0, 0]}
                      />
                      <Bar
                        dataKey="orders"
                        fill={theme.palette.secondary.main}
                        radius={[4, 4, 0, 0]}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </Grid>

            {/* Performance Metrics */}
            <Grid item xs={12} md={6}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Performance Metrics
                  </Typography>
                  <Box
                    sx={{
                      height: 300,
                      display: 'flex',
                      flexDirection: 'column',
                      gap: 2,
                      pt: 2,
                    }}
                  >
                    {[
                      {
                        label: 'Productivity Score',
                        value: 87,
                        color: theme.palette.success.main,
                      },
                      {
                        label: 'Client Satisfaction',
                        value: 94,
                        color: theme.palette.info.main,
                      },
                      {
                        label: 'Project Completion',
                        value: 78,
                        color: theme.palette.warning.main,
                      },
                      {
                        label: 'Quality Rating',
                        value: 92,
                        color: theme.palette.primary.main,
                      },
                    ].map((metric, index) => (
                      <Box key={index} sx={{ flex: 1 }}>
                        <Box
                          display="flex"
                          justifyContent="space-between"
                          alignItems="center"
                          mb={0.5}
                        >
                          <Typography variant="body2">
                            {metric.label}
                          </Typography>
                          <Typography variant="body2" fontWeight="bold">
                            {metric.value}%
                          </Typography>
                        </Box>
                        <Box
                          sx={{
                            width: '100%',
                            height: 8,
                            backgroundColor: 'grey.200',
                            borderRadius: 1,
                            overflow: 'hidden',
                          }}
                        >
                          <Box
                            sx={{
                              width: `${metric.value}%`,
                              height: '100%',
                              backgroundColor: metric.color,
                              borderRadius: 1,
                              transition: 'width 1s ease-in-out',
                            }}
                          />
                        </Box>
                      </Box>
                    ))}
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          </>
        )}
      </Grid>
    </Box>
  );
};

export default StatisticsCharts;

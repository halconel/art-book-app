import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Chip,
  IconButton,
  TextField,
  Button,
  Menu,
  MenuItem,
  Card,
  CardContent,
  Grid,
  Alert,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import {
  FilterList,
  Search,
  Refresh,
  Info,
  Error as ErrorIcon,
  CheckCircle,
  Person,
  Settings,
  Image,
  Assignment,
  MoreVert,
} from '@mui/icons-material';
import { formatDistance } from 'date-fns';
import api from '../../services/authService';

const AdminLogs = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(25);
  const [totalCount, setTotalCount] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [actionFilter, setActionFilter] = useState('all');
  const [userFilter, setUserFilter] = useState('all');
  const [timeFilter, setTimeFilter] = useState('all');
  const [selectedLog, setSelectedLog] = useState(null);
  const [openLogDetail, setOpenLogDetail] = useState(false);
  const [menuAnchorEl, setMenuAnchorEl] = useState(null);

  useEffect(() => {
    fetchLogs();
  }, [page, rowsPerPage, searchTerm, actionFilter, userFilter, timeFilter]);

  const fetchLogs = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: page + 1,
        per_page: rowsPerPage,
        search: searchTerm,
        action_filter: actionFilter,
        user_filter: userFilter,
        time_filter: timeFilter,
      });

      const response = await api.get(`/admin/logs?${params}`);

      setLogs(response.data.logs || []);
      setTotalCount(response.data.total_count || 0);
      setError('');
    } catch (err) {
      setError('Failed to fetch admin logs');
      // console.error('Failed to fetch logs:', err);
    } finally {
      setLoading(false);
    }
  };

  const getActionIcon = action => {
    switch (action.toLowerCase()) {
      case 'create':
      case 'created':
        return <CheckCircle color="success" />;
      case 'update':
      case 'updated':
        return <Settings color="info" />;
      case 'delete':
      case 'deleted':
        return <ErrorIcon color="error" />;
      case 'login':
        return <Person color="primary" />;
      case 'upload':
        return <Image color="info" />;
      default:
        return <Info color="action" />;
    }
  };

  const getActionColor = action => {
    switch (action.toLowerCase()) {
      case 'create':
      case 'created':
        return 'success';
      case 'update':
      case 'updated':
        return 'info';
      case 'delete':
      case 'deleted':
        return 'error';
      case 'login':
      case 'logout':
        return 'primary';
      case 'upload':
        return 'secondary';
      default:
        return 'default';
    }
  };

  const getResourceTypeIcon = resourceType => {
    switch (resourceType?.toLowerCase()) {
      case 'user':
        return <Person fontSize="small" />;
      case 'image':
        return <Image fontSize="small" />;
      case 'project':
        return <Assignment fontSize="small" />;
      default:
        return <Info fontSize="small" />;
    }
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = event => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleLogClick = log => {
    setSelectedLog(log);
    setOpenLogDetail(true);
  };

  const handleMenuClick = (event, log) => {
    event.stopPropagation();
    setMenuAnchorEl(event.currentTarget);
    setSelectedLog(log);
  };

  const handleMenuClose = () => {
    setMenuAnchorEl(null);
    setSelectedLog(null);
  };

  const clearFilters = () => {
    setSearchTerm('');
    setActionFilter('all');
    setUserFilter('all');
    setTimeFilter('all');
    setPage(0);
  };

  if (loading && logs.length === 0) {
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
        <Typography variant="h4">Admin Activity Logs</Typography>

        <Box display="flex" gap={2}>
          <Button
            startIcon={<Refresh />}
            onClick={fetchLogs}
            disabled={loading}
          >
            Refresh
          </Button>
        </Box>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {/* Filters */}
      <Paper sx={{ p: 2, mb: 2 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} sm={6} md={3}>
            <TextField
              size="small"
              fullWidth
              placeholder="Search logs..."
              value={searchTerm}
              onChange={e => {
                setSearchTerm(e.target.value);
                setPage(0);
              }}
              InputProps={{
                startAdornment: <Search sx={{ mr: 1 }} />,
              }}
            />
          </Grid>

          <Grid item xs={6} sm={3} md={2}>
            <TextField
              size="small"
              fullWidth
              select
              label="Action"
              value={actionFilter}
              onChange={e => {
                setActionFilter(e.target.value);
                setPage(0);
              }}
            >
              <MenuItem value="all">All Actions</MenuItem>
              <MenuItem value="create">Created</MenuItem>
              <MenuItem value="update">Updated</MenuItem>
              <MenuItem value="delete">Deleted</MenuItem>
              <MenuItem value="login">Login</MenuItem>
              <MenuItem value="upload">Upload</MenuItem>
            </TextField>
          </Grid>

          <Grid item xs={6} sm={3} md={2}>
            <TextField
              size="small"
              fullWidth
              select
              label="Time Period"
              value={timeFilter}
              onChange={e => {
                setTimeFilter(e.target.value);
                setPage(0);
              }}
            >
              <MenuItem value="all">All Time</MenuItem>
              <MenuItem value="today">Today</MenuItem>
              <MenuItem value="week">This Week</MenuItem>
              <MenuItem value="month">This Month</MenuItem>
            </TextField>
          </Grid>

          <Grid item xs={12} sm={12} md={3}>
            <Box display="flex" gap={1}>
              <Button
                size="small"
                onClick={clearFilters}
                disabled={
                  searchTerm === '' &&
                  actionFilter === 'all' &&
                  userFilter === 'all' &&
                  timeFilter === 'all'
                }
              >
                Clear Filters
              </Button>

              <Button size="small" startIcon={<FilterList />} disabled>
                More Filters
              </Button>
            </Box>
          </Grid>
        </Grid>
      </Paper>

      {/* Summary Cards */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" gap={1}>
                <Info color="primary" />
                <Box>
                  <Typography variant="h6">{totalCount}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    Total Logs
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" gap={1}>
                <Person color="secondary" />
                <Box>
                  <Typography variant="h6">
                    {
                      logs.filter(log =>
                        log.action?.toLowerCase().includes('login')
                      ).length
                    }
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Login Events
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" gap={1}>
                <CheckCircle color="success" />
                <Box>
                  <Typography variant="h6">
                    {
                      logs.filter(log =>
                        log.action?.toLowerCase().includes('creat')
                      ).length
                    }
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Created Items
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" gap={1}>
                <ErrorIcon color="error" />
                <Box>
                  <Typography variant="h6">
                    {
                      logs.filter(log =>
                        log.action?.toLowerCase().includes('delet')
                      ).length
                    }
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Deleted Items
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Logs Table */}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Timestamp</TableCell>
              <TableCell>User</TableCell>
              <TableCell>Action</TableCell>
              <TableCell>Resource</TableCell>
              <TableCell>Details</TableCell>
              <TableCell>IP Address</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {logs.map(log => (
              <TableRow
                key={log.id}
                hover
                sx={{ cursor: 'pointer' }}
                onClick={() => handleLogClick(log)}
              >
                <TableCell>
                  <Box>
                    <Typography variant="body2">
                      {new Date(log.created_at).toLocaleString()}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {formatDistance(new Date(log.created_at), new Date(), {
                        addSuffix: true,
                      })}
                    </Typography>
                  </Box>
                </TableCell>

                <TableCell>
                  <Box display="flex" alignItems="center" gap={1}>
                    <Person fontSize="small" />
                    <Box>
                      <Typography variant="body2">
                        {log.user?.email || 'System'}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {log.user?.role}
                      </Typography>
                    </Box>
                  </Box>
                </TableCell>

                <TableCell>
                  <Chip
                    icon={getActionIcon(log.action)}
                    label={log.action}
                    color={getActionColor(log.action)}
                    size="small"
                  />
                </TableCell>

                <TableCell>
                  {log.resource_type && (
                    <Box display="flex" alignItems="center" gap={1}>
                      {getResourceTypeIcon(log.resource_type)}
                      <Box>
                        <Typography variant="body2">
                          {log.resource_type}
                        </Typography>
                        {log.resource_id && (
                          <Typography variant="caption" color="text.secondary">
                            ID: {log.resource_id}
                          </Typography>
                        )}
                      </Box>
                    </Box>
                  )}
                </TableCell>

                <TableCell>
                  <Typography
                    variant="body2"
                    sx={{
                      maxWidth: 200,
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {log.details || '-'}
                  </Typography>
                </TableCell>

                <TableCell>
                  <Typography variant="body2" sx={{ fontFamily: 'monospace' }}>
                    {log.ip_address || '-'}
                  </Typography>
                </TableCell>

                <TableCell align="right">
                  <IconButton
                    size="small"
                    onClick={e => handleMenuClick(e, log)}
                  >
                    <MoreVert />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}

            {logs.length === 0 && !loading && (
              <TableRow>
                <TableCell colSpan={7} align="center" sx={{ py: 4 }}>
                  <Typography color="text.secondary">
                    No logs found matching your criteria
                  </Typography>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>

        {loading && (
          <Box display="flex" justifyContent="center" p={2}>
            <CircularProgress />
          </Box>
        )}
      </TableContainer>

      {/* Pagination */}
      <TablePagination
        rowsPerPageOptions={[10, 25, 50, 100]}
        component="div"
        count={totalCount}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />

      {/* Log Detail Dialog */}
      <Dialog
        open={openLogDetail}
        onClose={() => setOpenLogDetail(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Log Entry Details</DialogTitle>

        <DialogContent>
          {selectedLog && (
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle2" gutterBottom>
                  Timestamp
                </Typography>
                <Typography variant="body2" gutterBottom>
                  {new Date(selectedLog.created_at).toLocaleString()}
                </Typography>
              </Grid>

              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle2" gutterBottom>
                  User
                </Typography>
                <Typography variant="body2" gutterBottom>
                  {selectedLog.user?.email || 'System'} (
                  {selectedLog.user?.role})
                </Typography>
              </Grid>

              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle2" gutterBottom>
                  Action
                </Typography>
                <Chip
                  icon={getActionIcon(selectedLog.action)}
                  label={selectedLog.action}
                  color={getActionColor(selectedLog.action)}
                  size="small"
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle2" gutterBottom>
                  IP Address
                </Typography>
                <Typography variant="body2" sx={{ fontFamily: 'monospace' }}>
                  {selectedLog.ip_address || 'N/A'}
                </Typography>
              </Grid>

              {selectedLog.resource_type && (
                <>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="subtitle2" gutterBottom>
                      Resource Type
                    </Typography>
                    <Typography variant="body2" gutterBottom>
                      {selectedLog.resource_type}
                    </Typography>
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <Typography variant="subtitle2" gutterBottom>
                      Resource ID
                    </Typography>
                    <Typography variant="body2" gutterBottom>
                      {selectedLog.resource_id || 'N/A'}
                    </Typography>
                  </Grid>
                </>
              )}

              {selectedLog.details && (
                <Grid item xs={12}>
                  <Typography variant="subtitle2" gutterBottom>
                    Details
                  </Typography>
                  <Paper sx={{ p: 2, backgroundColor: 'grey.50' }}>
                    <Typography variant="body2" sx={{ whiteSpace: 'pre-wrap' }}>
                      {selectedLog.details}
                    </Typography>
                  </Paper>
                </Grid>
              )}

              {selectedLog.metadata && (
                <Grid item xs={12}>
                  <Typography variant="subtitle2" gutterBottom>
                    Metadata
                  </Typography>
                  <Paper sx={{ p: 2, backgroundColor: 'grey.50' }}>
                    <pre style={{ margin: 0, fontSize: '0.875rem' }}>
                      {JSON.stringify(selectedLog.metadata, null, 2)}
                    </pre>
                  </Paper>
                </Grid>
              )}
            </Grid>
          )}
        </DialogContent>

        <DialogActions>
          <Button onClick={() => setOpenLogDetail(false)}>Close</Button>
        </DialogActions>
      </Dialog>

      {/* Context Menu */}
      <Menu
        anchorEl={menuAnchorEl}
        open={Boolean(menuAnchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem
          onClick={() => {
            handleLogClick(selectedLog);
            handleMenuClose();
          }}
        >
          <Info sx={{ mr: 1 }} />
          View Details
        </MenuItem>
      </Menu>
    </Box>
  );
};

export default AdminLogs;

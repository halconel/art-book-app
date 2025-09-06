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
  TextField,
  InputAdornment,
  IconButton,
  Button,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  CircularProgress,
  Alert,
  Tooltip,
} from '@mui/material';
import {
  Search,
  Add,
  Edit,
  Delete,
  Email,
  Person,
  CheckCircle,
  Cancel,
} from '@mui/icons-material';
import api from '../../services/authService';

const ClientManagement = () => {
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalCount, setTotalCount] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedClient, setSelectedClient] = useState(null);
  const [formData, setFormData] = useState({
    email: '',
    contact_info: '',
  });

  useEffect(() => {
    fetchClients();
  }, [page, rowsPerPage, searchQuery]);

  const fetchClients = async () => {
    try {
      setLoading(true);
      const params = {
        role: 'client',
        page: page + 1,
        per_page: rowsPerPage,
        search: searchQuery || undefined,
      };

      const response = await api.get('/admin/users', { params });
      setClients(response.data.users || []);
      setTotalCount(response.data.total_count || 0);
      setError('');
    } catch (err) {
      setError('Failed to fetch clients');
      // eslint-disable-next-line no-console
      console.error('Failed to fetch clients:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearchChange = event => {
    setSearchQuery(event.target.value);
    setPage(0);
  };

  const handlePageChange = (event, newPage) => {
    setPage(newPage);
  };

  const handleRowsPerPageChange = event => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleOpenDialog = (client = null) => {
    setSelectedClient(client);
    setFormData(
      client
        ? {
            email: client.email,
            contact_info: client.contact_info || '',
          }
        : {
            email: '',
            contact_info: '',
          }
    );
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedClient(null);
    setFormData({ email: '', contact_info: '' });
  };

  const handleSubmit = async () => {
    try {
      if (selectedClient) {
        await api.put(`/admin/users/${selectedClient.id}`, {
          user: formData,
        });
      } else {
        await api.post('/admin/users', {
          user: { ...formData, role: 'client' },
        });
      }

      handleCloseDialog();
      fetchClients();
    } catch (err) {
      setError('Failed to save client');
      // eslint-disable-next-line no-console
      console.error('Failed to save client:', err);
    }
  };

  const handleDelete = async clientId => {
    // eslint-disable-next-line no-alert
    if (window.confirm('Are you sure you want to delete this client?')) {
      try {
        await api.delete(`/admin/users/${clientId}`);
        fetchClients();
      } catch (err) {
        setError('Failed to delete client');
        // eslint-disable-next-line no-console
        console.error('Failed to delete client:', err);
      }
    }
  };

  const getStatusChip = client => {
    if (client.email_verified_at) {
      return (
        <Chip
          label="Verified"
          color="success"
          size="small"
          icon={<CheckCircle />}
        />
      );
    }
    return (
      <Chip label="Pending" color="warning" size="small" icon={<Cancel />} />
    );
  };

  if (loading && clients.length === 0) {
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
          Client Management
        </Typography>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={() => handleOpenDialog()}
        >
          Invite Client
        </Button>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Paper sx={{ width: '100%', mb: 2 }}>
        <Box p={2}>
          <TextField
            fullWidth
            variant="outlined"
            placeholder="Search clients by email..."
            value={searchQuery}
            onChange={handleSearchChange}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search />
                </InputAdornment>
              ),
            }}
          />
        </Box>

        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Email</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Registered</TableCell>
                <TableCell>Orders</TableCell>
                <TableCell align="center">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={5} align="center">
                    <CircularProgress size={24} />
                  </TableCell>
                </TableRow>
              ) : clients.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} align="center">
                    <Typography color="textSecondary">
                      No clients found
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : (
                clients.map(client => (
                  <TableRow key={client.id} hover>
                    <TableCell>
                      <Box display="flex" alignItems="center" gap={1}>
                        <Person />
                        {client.email}
                      </Box>
                    </TableCell>
                    <TableCell>{getStatusChip(client)}</TableCell>
                    <TableCell>
                      {new Date(client.created_at).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={client.orders_count || 0}
                        variant="outlined"
                        size="small"
                      />
                    </TableCell>
                    <TableCell align="center">
                      <Tooltip title="Edit Client">
                        <IconButton
                          onClick={() => handleOpenDialog(client)}
                          size="small"
                        >
                          <Edit />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Send Email">
                        <IconButton
                          onClick={() => window.open(`mailto:${client.email}`)}
                          size="small"
                        >
                          <Email />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Delete Client">
                        <IconButton
                          onClick={() => handleDelete(client.id)}
                          size="small"
                          color="error"
                        >
                          <Delete />
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>

        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={totalCount}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handlePageChange}
          onRowsPerPageChange={handleRowsPerPageChange}
        />
      </Paper>

      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          {selectedClient ? 'Edit Client' : 'Invite New Client'}
        </DialogTitle>
        <DialogContent>
          <TextField
            margin="normal"
            fullWidth
            label="Email Address"
            type="email"
            value={formData.email}
            onChange={e =>
              setFormData(prev => ({ ...prev, email: e.target.value }))
            }
            disabled={!!selectedClient}
          />
          <TextField
            margin="normal"
            fullWidth
            label="Contact Information"
            multiline
            rows={3}
            value={formData.contact_info}
            onChange={e =>
              setFormData(prev => ({ ...prev, contact_info: e.target.value }))
            }
            placeholder="Additional contact details, notes, etc."
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button onClick={handleSubmit} variant="contained">
            {selectedClient ? 'Update' : 'Invite'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ClientManagement;

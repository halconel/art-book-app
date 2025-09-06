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
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  CircularProgress,
  Alert,
  Card,
  CardContent,
  CardMedia,
  Tooltip,
  Switch,
  FormControlLabel,
} from '@mui/material';
import {
  Search,
  Add,
  Edit,
  Delete,
  Visibility,
  Image,
  Person,
  Work,
} from '@mui/icons-material';
import api from '../../services/authService';

const ProjectManagement = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalCount, setTotalCount] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);
  const [cyclePacks, setCyclePacks] = useState([]);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    thumbnail_url: '',
    is_personal: true,
    cycle_pack_id: '',
    status: 'draft',
  });

  useEffect(() => {
    fetchProjects();
    fetchCyclePacks();
  }, [page, rowsPerPage, searchQuery]);

  const fetchProjects = async () => {
    try {
      setLoading(true);
      const params = {
        page: page + 1,
        per_page: rowsPerPage,
        search: searchQuery || undefined,
      };

      const response = await api.get('/admin/projects', { params });
      setProjects(response.data.projects || []);
      setTotalCount(response.data.total_count || 0);
      setError('');
    } catch (err) {
      setError('Failed to fetch projects');
      // eslint-disable-next-line no-console
      console.error('Failed to fetch projects:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchCyclePacks = async () => {
    try {
      const response = await api.get('/admin/cycle-packs?status=pending');
      setCyclePacks(response.data.cycle_packs || []);
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error('Failed to fetch cycle packs:', err);
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

  const handleOpenDialog = (project = null) => {
    setSelectedProject(project);
    setFormData(
      project
        ? {
            title: project.title,
            description: project.description || '',
            thumbnail_url: project.thumbnail_url || '',
            is_personal: project.is_personal,
            cycle_pack_id: project.cycle_pack_id || '',
            status: project.status,
          }
        : {
            title: '',
            description: '',
            thumbnail_url: '',
            is_personal: true,
            cycle_pack_id: '',
            status: 'draft',
          }
    );
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedProject(null);
    setFormData({
      title: '',
      description: '',
      thumbnail_url: '',
      is_personal: true,
      cycle_pack_id: '',
      status: 'draft',
    });
  };

  const handleSubmit = async () => {
    try {
      if (selectedProject) {
        await api.put(`/admin/projects/${selectedProject.id}`, {
          project: formData,
        });
      } else {
        await api.post('/admin/projects', {
          project: formData,
        });
      }

      handleCloseDialog();
      fetchProjects();
    } catch (err) {
      setError('Failed to save project');
      // eslint-disable-next-line no-console
      console.error('Failed to save project:', err);
    }
  };

  const handleDelete = async projectId => {
    if (window.confirm('Are you sure you want to delete this project?')) {
      try {
        await api.delete(`/admin/projects/${projectId}`);
        fetchProjects();
      } catch (err) {
        setError('Failed to delete project');
        // eslint-disable-next-line no-console
        console.error('Failed to delete project:', err);
      }
    }
  };

  const getStatusColor = status => {
    switch (status) {
      case 'draft':
        return 'default';
      case 'in_progress':
        return 'info';
      case 'completed':
        return 'success';
      case 'on_hold':
        return 'warning';
      default:
        return 'default';
    }
  };

  const getProjectTypeChip = isPersonal => {
    return isPersonal ? (
      <Chip label="Personal" color="info" size="small" icon={<Person />} />
    ) : (
      <Chip label="Client" color="primary" size="small" icon={<Work />} />
    );
  };

  if (loading && projects.length === 0) {
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
          Project Management
        </Typography>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={() => handleOpenDialog()}
        >
          Create Project
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
            placeholder="Search projects by title..."
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
                <TableCell>Project</TableCell>
                <TableCell>Type</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Cycle Pack</TableCell>
                <TableCell>Created</TableCell>
                <TableCell align="center">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={6} align="center">
                    <CircularProgress size={24} />
                  </TableCell>
                </TableRow>
              ) : projects.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} align="center">
                    <Typography color="textSecondary">
                      No projects found
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : (
                projects.map(project => (
                  <TableRow key={project.id} hover>
                    <TableCell>
                      <Box display="flex" alignItems="center" gap={2}>
                        {project.thumbnail_url ? (
                          <img
                            src={project.thumbnail_url}
                            alt={project.title}
                            style={{
                              width: 40,
                              height: 40,
                              objectFit: 'cover',
                              borderRadius: 4,
                            }}
                          />
                        ) : (
                          <Box
                            sx={{
                              width: 40,
                              height: 40,
                              backgroundColor: 'grey.300',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              borderRadius: 1,
                            }}
                          >
                            <Image />
                          </Box>
                        )}
                        <Box>
                          <Typography variant="subtitle2">
                            {project.title}
                          </Typography>
                          {project.description && (
                            <Typography variant="body2" color="textSecondary">
                              {project.description.length > 50
                                ? `${project.description.substring(0, 50)}...`
                                : project.description}
                            </Typography>
                          )}
                        </Box>
                      </Box>
                    </TableCell>
                    <TableCell>
                      {getProjectTypeChip(project.is_personal)}
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={project.status}
                        color={getStatusColor(project.status)}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      {project.cycle_pack ? (
                        <Tooltip
                          title={`Pack #${project.cycle_pack.pack_number}`}
                        >
                          <Chip
                            label={`Pack ${project.cycle_pack.pack_number}`}
                            variant="outlined"
                            size="small"
                          />
                        </Tooltip>
                      ) : (
                        <Typography variant="body2" color="textSecondary">
                          No pack assigned
                        </Typography>
                      )}
                    </TableCell>
                    <TableCell>
                      {new Date(project.created_at).toLocaleDateString()}
                    </TableCell>
                    <TableCell align="center">
                      <Tooltip title="Edit Project">
                        <IconButton
                          onClick={() => handleOpenDialog(project)}
                          size="small"
                        >
                          <Edit />
                        </IconButton>
                      </Tooltip>
                      {project.thumbnail_url && (
                        <Tooltip title="View Thumbnail">
                          <IconButton
                            onClick={() =>
                              window.open(project.thumbnail_url, '_blank')
                            }
                            size="small"
                          >
                            <Visibility />
                          </IconButton>
                        </Tooltip>
                      )}
                      <Tooltip title="Delete Project">
                        <IconButton
                          onClick={() => handleDelete(project.id)}
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
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          {selectedProject ? 'Edit Project' : 'Create New Project'}
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Project Title"
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

            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Thumbnail URL"
                value={formData.thumbnail_url}
                onChange={e =>
                  setFormData(prev => ({
                    ...prev,
                    thumbnail_url: e.target.value,
                  }))
                }
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <FormControlLabel
                control={
                  <Switch
                    checked={formData.is_personal}
                    onChange={e =>
                      setFormData(prev => ({
                        ...prev,
                        is_personal: e.target.checked,
                      }))
                    }
                  />
                }
                label="Personal Project"
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Status</InputLabel>
                <Select
                  value={formData.status}
                  label="Status"
                  onChange={e =>
                    setFormData(prev => ({ ...prev, status: e.target.value }))
                  }
                >
                  <MenuItem value="draft">Draft</MenuItem>
                  <MenuItem value="in_progress">In Progress</MenuItem>
                  <MenuItem value="completed">Completed</MenuItem>
                  <MenuItem value="on_hold">On Hold</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            {!formData.is_personal && (
              <Grid item xs={12}>
                <FormControl fullWidth>
                  <InputLabel>Assign to Cycle Pack</InputLabel>
                  <Select
                    value={formData.cycle_pack_id}
                    label="Assign to Cycle Pack"
                    onChange={e =>
                      setFormData(prev => ({
                        ...prev,
                        cycle_pack_id: e.target.value,
                      }))
                    }
                  >
                    <MenuItem value="">No assignment</MenuItem>
                    {cyclePacks.map(pack => (
                      <MenuItem key={pack.id} value={pack.id}>
                        Pack #{pack.pack_number} - {pack.order?.title}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
            )}

            {formData.thumbnail_url && (
              <Grid item xs={12}>
                <Card sx={{ maxWidth: 200 }}>
                  <CardMedia
                    component="img"
                    height="140"
                    image={formData.thumbnail_url}
                    alt="Project thumbnail"
                    onError={e => {
                      e.target.style.display = 'none';
                    }}
                  />
                </Card>
              </Grid>
            )}
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button onClick={handleSubmit} variant="contained">
            {selectedProject ? 'Update' : 'Create'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ProjectManagement;

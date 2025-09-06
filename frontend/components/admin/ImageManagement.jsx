import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  CardMedia,
  Typography,
  Grid,
  Button,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControlLabel,
  Switch,
  Chip,
  Menu,
  MenuItem,
  Paper,
  LinearProgress,
  Alert,
  Fab,
  ImageList,
  ImageListItem,
  ImageListItemBar,
} from '@mui/material';
import {
  Add,
  Edit,
  Delete,
  MoreVert,
  CloudUpload,
  Visibility,
  VisibilityOff,
  Star,
  StarBorder,
  DragIndicator,
  FilterList,
  Search,
} from '@mui/icons-material';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import api from '../../services/authService';

const ImageManagement = () => {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [openDialog, setOpenDialog] = useState(false);
  const [editingImage, setEditingImage] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterAnchorEl, setFilterAnchorEl] = useState(null);
  const [filter, setFilter] = useState('all');
  const [viewMode, setViewMode] = useState('grid'); // grid or list

  const [imageForm, setImageForm] = useState({
    title: '',
    description: '',
    url: '',
    thumbnail_url: '',
    alt_text: '',
    is_featured: false,
    is_visible: true,
    project_id: null,
    tags: '',
  });

  useEffect(() => {
    fetchImages();
  }, []);

  const fetchImages = async () => {
    try {
      setLoading(true);
      const response = await api.get('/admin/images');
      setImages(response.data.images || []);
      setError('');
    } catch (err) {
      setError('Failed to fetch images');
      console.error('Failed to fetch images:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveImage = async () => {
    try {
      setUploading(true);

      const imageData = {
        ...imageForm,
        tags: imageForm.tags
          .split(',')
          .map(tag => tag.trim())
          .filter(Boolean),
      };

      let response;
      if (editingImage) {
        response = await api.patch(`/admin/images/${editingImage.id}`, {
          image: imageData,
        });
      } else {
        response = await api.post('/admin/images', {
          image: imageData,
        });
      }

      setSuccess(
        editingImage
          ? 'Image updated successfully'
          : 'Image created successfully'
      );
      setTimeout(() => setSuccess(''), 3000);

      setOpenDialog(false);
      setEditingImage(null);
      resetForm();
      fetchImages();
    } catch (err) {
      setError('Failed to save image');
      console.error('Failed to save image:', err);
    } finally {
      setUploading(false);
    }
  };

  const handleDeleteImage = async imageId => {
    if (!window.confirm('Are you sure you want to delete this image?')) return;

    try {
      await api.delete(`/admin/images/${imageId}`);
      setSuccess('Image deleted successfully');
      setTimeout(() => setSuccess(''), 3000);
      fetchImages();
    } catch (err) {
      setError('Failed to delete image');
      console.error('Failed to delete image:', err);
    }
  };

  const handleToggleFeatured = async (imageId, currentStatus) => {
    try {
      await api.patch(`/admin/images/${imageId}`, {
        image: { is_featured: !currentStatus },
      });
      fetchImages();
    } catch (err) {
      setError('Failed to update featured status');
      console.error('Failed to update featured:', err);
    }
  };

  const handleToggleVisibility = async (imageId, currentStatus) => {
    try {
      await api.patch(`/admin/images/${imageId}`, {
        image: { is_visible: !currentStatus },
      });
      fetchImages();
    } catch (err) {
      setError('Failed to update visibility');
      console.error('Failed to update visibility:', err);
    }
  };

  const handleDragEnd = async result => {
    if (!result.destination) return;

    const reorderedImages = Array.from(images);
    const [movedImage] = reorderedImages.splice(result.source.index, 1);
    reorderedImages.splice(result.destination.index, 0, movedImage);

    // Update local state immediately for better UX
    setImages(reorderedImages);

    try {
      // Send bulk update to backend
      const updates = reorderedImages.map((image, index) => ({
        id: image.id,
        position: index + 1,
      }));

      await api.patch('/admin/images/bulk-update', {
        updates,
      });
    } catch (err) {
      setError('Failed to update image order');
      console.error('Failed to reorder images:', err);
      // Revert on error
      fetchImages();
    }
  };

  const handleFileUpload = async event => {
    const file = event.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('image[file]', file);

    try {
      setUploading(true);
      const response = await api.post('/admin/images/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      setImageForm(prev => ({
        ...prev,
        url: response.data.url,
        thumbnail_url: response.data.thumbnail_url || response.data.url,
      }));

      setSuccess('Image uploaded successfully');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError('Failed to upload image');
      console.error('Failed to upload:', err);
    } finally {
      setUploading(false);
    }
  };

  const handleEditImage = image => {
    setEditingImage(image);
    setImageForm({
      title: image.title || '',
      description: image.description || '',
      url: image.url || '',
      thumbnail_url: image.thumbnail_url || '',
      alt_text: image.alt_text || '',
      is_featured: image.is_featured || false,
      is_visible: image.is_visible !== false,
      project_id: image.project_id || null,
      tags: image.tags ? image.tags.join(', ') : '',
    });
    setOpenDialog(true);
  };

  const resetForm = () => {
    setImageForm({
      title: '',
      description: '',
      url: '',
      thumbnail_url: '',
      alt_text: '',
      is_featured: false,
      is_visible: true,
      project_id: null,
      tags: '',
    });
  };

  const handleMenuClick = (event, image) => {
    setAnchorEl(event.currentTarget);
    setSelectedImage(image);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedImage(null);
  };

  const getFilteredImages = () => {
    let filtered = images;

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(
        image =>
          image.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          image.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          image.tags?.some(tag =>
            tag.toLowerCase().includes(searchTerm.toLowerCase())
          )
      );
    }

    // Apply status filter
    switch (filter) {
      case 'featured':
        return filtered.filter(image => image.is_featured);
      case 'hidden':
        return filtered.filter(image => !image.is_visible);
      case 'visible':
        return filtered.filter(image => image.is_visible);
      default:
        return filtered;
    }
  };

  const filteredImages = getFilteredImages();

  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="400px"
      >
        <LinearProgress sx={{ width: '100%' }} />
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
        <Typography variant="h4">Image Management</Typography>

        <Box display="flex" gap={2} alignItems="center">
          <TextField
            size="small"
            placeholder="Search images..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            InputProps={{
              startAdornment: <Search sx={{ mr: 1 }} />,
            }}
          />

          <Button
            startIcon={<FilterList />}
            onClick={e => setFilterAnchorEl(e.currentTarget)}
          >
            Filter: {filter}
          </Button>

          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={() => {
              setEditingImage(null);
              resetForm();
              setOpenDialog(true);
            }}
          >
            Add Image
          </Button>
        </Box>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {success && (
        <Alert severity="success" sx={{ mb: 2 }}>
          {success}
        </Alert>
      )}

      {/* Image Grid with Drag & Drop */}
      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable droppableId="images" direction="horizontal">
          {provided => (
            <ImageList
              ref={provided.innerRef}
              {...provided.droppableProps}
              variant="masonry"
              cols={4}
              gap={16}
              sx={{ mb: 2 }}
            >
              {filteredImages.map((image, index) => (
                <Draggable
                  key={image.id}
                  draggableId={image.id.toString()}
                  index={index}
                >
                  {(provided, snapshot) => (
                    <ImageListItem
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      sx={{
                        transform: snapshot.isDragging
                          ? 'rotate(5deg)'
                          : 'none',
                        boxShadow: snapshot.isDragging ? 4 : 1,
                        borderRadius: 1,
                        overflow: 'hidden',
                      }}
                    >
                      <img
                        src={image.thumbnail_url || image.url}
                        alt={image.alt_text || image.title}
                        loading="lazy"
                        style={{
                          width: '100%',
                          height: 'auto',
                          maxHeight: '300px',
                          objectFit: 'cover',
                        }}
                      />

                      <ImageListItemBar
                        title={image.title}
                        subtitle={
                          <Box
                            display="flex"
                            gap={1}
                            alignItems="center"
                            mt={0.5}
                          >
                            {image.is_featured && (
                              <Chip
                                label="Featured"
                                size="small"
                                color="warning"
                              />
                            )}
                            {!image.is_visible && (
                              <Chip label="Hidden" size="small" color="error" />
                            )}
                            {image.tags?.map(tag => (
                              <Chip
                                key={tag}
                                label={tag}
                                size="small"
                                variant="outlined"
                              />
                            ))}
                          </Box>
                        }
                        actionIcon={
                          <Box>
                            <IconButton
                              {...provided.dragHandleProps}
                              sx={{ color: 'rgba(255, 255, 255, 0.54)' }}
                            >
                              <DragIndicator />
                            </IconButton>
                            <IconButton
                              sx={{ color: 'rgba(255, 255, 255, 0.54)' }}
                              onClick={e => handleMenuClick(e, image)}
                            >
                              <MoreVert />
                            </IconButton>
                          </Box>
                        }
                      />
                    </ImageListItem>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </ImageList>
          )}
        </Droppable>
      </DragDropContext>

      {filteredImages.length === 0 && (
        <Paper sx={{ p: 4, textAlign: 'center' }}>
          <Typography variant="h6" color="text.secondary" gutterBottom>
            No images found
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {searchTerm || filter !== 'all'
              ? 'Try adjusting your search or filter criteria'
              : 'Add your first image to get started'}
          </Typography>
        </Paper>
      )}

      {/* Context Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem
          onClick={() => {
            handleEditImage(selectedImage);
            handleMenuClose();
          }}
        >
          <Edit sx={{ mr: 1 }} />
          Edit
        </MenuItem>

        <MenuItem
          onClick={() => {
            handleToggleFeatured(selectedImage.id, selectedImage.is_featured);
            handleMenuClose();
          }}
        >
          {selectedImage?.is_featured ? (
            <>
              <StarBorder sx={{ mr: 1 }} />
              Remove from Featured
            </>
          ) : (
            <>
              <Star sx={{ mr: 1 }} />
              Mark as Featured
            </>
          )}
        </MenuItem>

        <MenuItem
          onClick={() => {
            handleToggleVisibility(selectedImage.id, selectedImage.is_visible);
            handleMenuClose();
          }}
        >
          {selectedImage?.is_visible ? (
            <>
              <VisibilityOff sx={{ mr: 1 }} />
              Hide
            </>
          ) : (
            <>
              <Visibility sx={{ mr: 1 }} />
              Show
            </>
          )}
        </MenuItem>

        <MenuItem
          onClick={() => {
            handleDeleteImage(selectedImage.id);
            handleMenuClose();
          }}
          sx={{ color: 'error.main' }}
        >
          <Delete sx={{ mr: 1 }} />
          Delete
        </MenuItem>
      </Menu>

      {/* Filter Menu */}
      <Menu
        anchorEl={filterAnchorEl}
        open={Boolean(filterAnchorEl)}
        onClose={() => setFilterAnchorEl(null)}
      >
        <MenuItem
          onClick={() => {
            setFilter('all');
            setFilterAnchorEl(null);
          }}
        >
          All Images
        </MenuItem>
        <MenuItem
          onClick={() => {
            setFilter('featured');
            setFilterAnchorEl(null);
          }}
        >
          Featured Only
        </MenuItem>
        <MenuItem
          onClick={() => {
            setFilter('visible');
            setFilterAnchorEl(null);
          }}
        >
          Visible Only
        </MenuItem>
        <MenuItem
          onClick={() => {
            setFilter('hidden');
            setFilterAnchorEl(null);
          }}
        >
          Hidden Only
        </MenuItem>
      </Menu>

      {/* Add/Edit Dialog */}
      <Dialog
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          {editingImage ? 'Edit Image' : 'Add New Image'}
        </DialogTitle>

        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <input
                accept="image/*"
                style={{ display: 'none' }}
                id="image-upload"
                type="file"
                onChange={handleFileUpload}
              />
              <label htmlFor="image-upload">
                <Button
                  variant="outlined"
                  component="span"
                  startIcon={<CloudUpload />}
                  disabled={uploading}
                  fullWidth
                >
                  {uploading ? 'Uploading...' : 'Upload Image'}
                </Button>
              </label>
              {uploading && <LinearProgress sx={{ mt: 1 }} />}
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Title"
                value={imageForm.title}
                onChange={e =>
                  setImageForm(prev => ({ ...prev, title: e.target.value }))
                }
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Alt Text"
                value={imageForm.alt_text}
                onChange={e =>
                  setImageForm(prev => ({ ...prev, alt_text: e.target.value }))
                }
                helperText="For accessibility and SEO"
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Description"
                multiline
                rows={3}
                value={imageForm.description}
                onChange={e =>
                  setImageForm(prev => ({
                    ...prev,
                    description: e.target.value,
                  }))
                }
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Image URL"
                value={imageForm.url}
                onChange={e =>
                  setImageForm(prev => ({ ...prev, url: e.target.value }))
                }
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Thumbnail URL"
                value={imageForm.thumbnail_url}
                onChange={e =>
                  setImageForm(prev => ({
                    ...prev,
                    thumbnail_url: e.target.value,
                  }))
                }
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Tags (comma separated)"
                value={imageForm.tags}
                onChange={e =>
                  setImageForm(prev => ({ ...prev, tags: e.target.value }))
                }
                helperText="e.g. portrait, digital art, commission"
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <FormControlLabel
                control={
                  <Switch
                    checked={imageForm.is_featured}
                    onChange={e =>
                      setImageForm(prev => ({
                        ...prev,
                        is_featured: e.target.checked,
                      }))
                    }
                  />
                }
                label="Featured Image"
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <FormControlLabel
                control={
                  <Switch
                    checked={imageForm.is_visible}
                    onChange={e =>
                      setImageForm(prev => ({
                        ...prev,
                        is_visible: e.target.checked,
                      }))
                    }
                  />
                }
                label="Visible to Public"
              />
            </Grid>

            {/* Image Preview */}
            {(imageForm.url || imageForm.thumbnail_url) && (
              <Grid item xs={12}>
                <Typography variant="subtitle2" gutterBottom>
                  Preview:
                </Typography>
                <img
                  src={imageForm.thumbnail_url || imageForm.url}
                  alt="Preview"
                  style={{
                    maxWidth: '100%',
                    maxHeight: '200px',
                    objectFit: 'contain',
                    border: '1px solid #ddd',
                    borderRadius: 4,
                  }}
                />
              </Grid>
            )}
          </Grid>
        </DialogContent>

        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
          <Button
            onClick={handleSaveImage}
            variant="contained"
            disabled={uploading || !imageForm.title || !imageForm.url}
          >
            {editingImage ? 'Update' : 'Create'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ImageManagement;

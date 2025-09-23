import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  ImageList,
  ImageListItem,
  ImageListItemBar,
  Chip,
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  Grid,
  Card,
  CardContent,
  Button,
  TextField,
  Menu,
  MenuItem,
  CircularProgress,
  Fade,
} from '@mui/material';
import {
  Close,
  ChevronLeft,
  ChevronRight,
  FilterList,
  Search,
  Fullscreen,
  Share,
  Favorite,
  FavoriteBorder,
} from '@mui/icons-material';
import api from '../../services/authService';

const PublicGallery = () => {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedImage, setSelectedImage] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [openLightbox, setOpenLightbox] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterAnchorEl, setFilterAnchorEl] = useState(null);
  const [tagFilter, setTagFilter] = useState('all');
  const [allTags, setAllTags] = useState([]);
  const [favorites, setFavorites] = useState(new Set());
  const [pagination, setPagination] = useState({});
  const [loadingMore, setLoadingMore] = useState(false);

  useEffect(() => {
    fetchGallery();
  }, []);

  // Refetch when search or filter changes
  useEffect(() => {
    fetchGallery(1, searchTerm, tagFilter !== 'all' ? tagFilter : null);
  }, [searchTerm, tagFilter]);

  const fetchGallery = async (page = 1, search = '', tags = null) => {
    try {
      setLoading(true);
      // Use the new Gallery API endpoint with pagination and filtering
      const params = new URLSearchParams({
        page: page.toString(),
        ...(search && { search }),
        ...(tags && { tags: Array.isArray(tags) ? tags.join(',') : tags })
      });

      const response = await api.get(`/gallery?${params}`);
      const data = response.data;

      if (page === 1) {
        setImages(data.images || []);
      } else {
        setImages(prev => [...prev, ...data.images || []]);
      }

      // Set pagination info
      setPagination(data.pagination || {});

      // Set available tags from filters
      setAllTags(data.filters?.available_tags || []);

      setError('');
    } catch (err) {
      setError('Failed to load gallery');
      console.error('Failed to fetch gallery:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleImageClick = (image, index) => {
    setSelectedImage(image);
    setCurrentImageIndex(index);
    setOpenLightbox(true);
  };

  const handleNextImage = () => {
    const filteredImages = getFilteredImages();
    const nextIndex = (currentImageIndex + 1) % filteredImages.length;
    setCurrentImageIndex(nextIndex);
    setSelectedImage(filteredImages[nextIndex]);
  };

  const handlePrevImage = () => {
    const filteredImages = getFilteredImages();
    const prevIndex =
      currentImageIndex === 0
        ? filteredImages.length - 1
        : currentImageIndex - 1;
    setCurrentImageIndex(prevIndex);
    setSelectedImage(filteredImages[prevIndex]);
  };

  const handleToggleFavorite = imageId => {
    const newFavorites = new Set(favorites);
    if (newFavorites.has(imageId)) {
      newFavorites.delete(imageId);
    } else {
      newFavorites.add(imageId);
    }
    setFavorites(newFavorites);

    // Store in localStorage for persistence
    localStorage.setItem(
      'gallery_favorites',
      JSON.stringify(Array.from(newFavorites))
    );
  };

  const handleShareImage = async image => {
    const shareData = {
      title: image.title || 'Artwork',
      text: image.description || 'Check out this amazing artwork!',
      url: window.location.origin + '/gallery/' + image.id,
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        // Fallback - copy to clipboard
        await navigator.clipboard.writeText(shareData.url);
        // You could show a toast notification here
      }
    } catch (err) {
      console.error('Error sharing:', err);
    }
  };

  const loadMoreImages = async () => {
    if (loadingMore || !pagination.has_more) return;

    setLoadingMore(true);
    await fetchGallery(
      pagination.current_page + 1,
      searchTerm,
      tagFilter !== 'all' ? tagFilter : null
    );
    setLoadingMore(false);
  };

  // Since filtering is now done on the backend, we just return the images
  const filteredImages = images;

  // Load favorites from localStorage on component mount
  useEffect(() => {
    const savedFavorites = localStorage.getItem('gallery_favorites');
    if (savedFavorites) {
      setFavorites(new Set(JSON.parse(savedFavorites)));
    }
  }, []);

  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="400px"
      >
        <CircularProgress size={60} />
      </Box>
    );
  }

  return (
    <Box className="public-gallery">
      {/* Header */}
      <Box sx={{ textAlign: 'center', mb: 4 }}>
        <Typography variant="h2" component="h1" gutterBottom>
          Art Gallery
        </Typography>
        <Typography
          variant="h6"
          color="text.secondary"
          sx={{ maxWidth: 600, mx: 'auto' }}
        >
          Explore my collection of digital artwork, from character designs to
          environmental concepts.
        </Typography>
      </Box>

      {/* Search and Filters */}
      <Box
        display="flex"
        justifyContent="center"
        gap={2}
        mb={4}
        flexWrap="wrap"
      >
        <TextField
          size="small"
          placeholder="Search artwork..."
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          InputProps={{
            startAdornment: <Search sx={{ mr: 1 }} />,
          }}
          sx={{ minWidth: 250 }}
        />

        <Button
          startIcon={<FilterList />}
          onClick={e => setFilterAnchorEl(e.currentTarget)}
          variant="outlined"
        >
          Tags: {tagFilter === 'all' ? 'All' : tagFilter}
        </Button>
      </Box>

      {/* Stats */}
      <Box display="flex" justifyContent="center" gap={4} mb={4}>
        <Box textAlign="center">
          <Typography variant="h4" color="primary">
            {filteredImages.length}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Artworks
          </Typography>
        </Box>

        <Box textAlign="center">
          <Typography variant="h4" color="secondary">
            {allTags.length}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Categories
          </Typography>
        </Box>

        <Box textAlign="center">
          <Typography variant="h4" color="success.main">
            {favorites.size}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Favorites
          </Typography>
        </Box>
      </Box>

      {/* Gallery Grid */}
      {filteredImages.length > 0 ? (
        <ImageList variant="masonry" cols={3} gap={16}>
          {filteredImages.map((image, index) => (
            <Fade in={true} timeout={300 + index * 50} key={image.id}>
              <ImageListItem
                sx={{
                  cursor: 'pointer',
                  '&:hover': {
                    '& img': { transform: 'scale(1.05)' },
                    '& .overlay': { opacity: 1 },
                  },
                }}
                onClick={() => handleImageClick(image, index)}
              >
                <img
                  src={image.thumbnail_url || image.url}
                  alt={image.alt_text || image.title}
                  loading="lazy"
                  style={{
                    transition: 'transform 0.3s ease',
                    borderRadius: 8,
                  }}
                />

                {/* Overlay */}
                <Box
                  className="overlay"
                  sx={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    backgroundColor: 'rgba(0,0,0,0.5)',
                    opacity: 0,
                    transition: 'opacity 0.3s ease',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderRadius: 2,
                  }}
                >
                  <Fullscreen sx={{ color: 'white', fontSize: 40 }} />
                </Box>

                <ImageListItemBar
                  title={image.title}
                  subtitle={
                    <Box>
                      {image.description && (
                        <Typography
                          variant="caption"
                          display="block"
                          sx={{ mb: 0.5 }}
                        >
                          {image.description.substring(0, 100)}...
                        </Typography>
                      )}
                      <Box display="flex" gap={0.5} flexWrap="wrap">
                        {image.tags?.slice(0, 3).map(tag => (
                          <Chip
                            key={tag}
                            label={tag}
                            size="small"
                            variant="outlined"
                            sx={{ fontSize: '0.7rem' }}
                          />
                        ))}
                        {image.tags?.length > 3 && (
                          <Chip
                            label={`+${image.tags.length - 3}`}
                            size="small"
                            variant="outlined"
                            sx={{ fontSize: '0.7rem' }}
                          />
                        )}
                      </Box>
                    </Box>
                  }
                  actionIcon={
                    <IconButton
                      sx={{ color: 'rgba(255, 255, 255, 0.54)' }}
                      onClick={e => {
                        e.stopPropagation();
                        handleToggleFavorite(image.id);
                      }}
                    >
                      {favorites.has(image.id) ? (
                        <Favorite color="error" />
                      ) : (
                        <FavoriteBorder />
                      )}
                    </IconButton>
                  }
                />
              </ImageListItem>
            </Fade>
          ))}
        </ImageList>
      ) : (
        <Box textAlign="center" py={8}>
          <Typography variant="h6" color="text.secondary" gutterBottom>
            No artworks found
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {searchTerm || tagFilter !== 'all'
              ? 'Try adjusting your search or filter criteria'
              : 'The gallery is currently empty'}
          </Typography>
        </Box>
      )}

      {/* Load More Button */}
      {pagination.has_more && (
        <Box display="flex" justifyContent="center" mt={4}>
          <Button
            variant="outlined"
            size="large"
            onClick={loadMoreImages}
            disabled={loadingMore}
            sx={{ minWidth: 200 }}
          >
            {loadingMore ? <CircularProgress size={24} /> : 'Load More'}
          </Button>
        </Box>
      )}

      {/* Tag Filter Menu */}
      <Menu
        anchorEl={filterAnchorEl}
        open={Boolean(filterAnchorEl)}
        onClose={() => setFilterAnchorEl(null)}
      >
        <MenuItem
          onClick={() => {
            setTagFilter('all');
            setFilterAnchorEl(null);
          }}
        >
          All Tags
        </MenuItem>
        {allTags.map(tag => (
          <MenuItem
            key={tag}
            onClick={() => {
              setTagFilter(tag);
              setFilterAnchorEl(null);
            }}
          >
            {tag}
          </MenuItem>
        ))}
      </Menu>

      {/* Lightbox Dialog */}
      <Dialog
        open={openLightbox}
        onClose={() => setOpenLightbox(false)}
        maxWidth="lg"
        fullWidth
        sx={{
          '& .MuiDialog-paper': {
            backgroundColor: 'transparent',
            boxShadow: 'none',
            overflow: 'hidden',
          },
        }}
      >
        <DialogContent sx={{ p: 0, position: 'relative' }}>
          {selectedImage && (
            <>
              {/* Navigation Buttons */}
              <IconButton
                sx={{
                  position: 'absolute',
                  left: 16,
                  top: '50%',
                  transform: 'translateY(-50%)',
                  backgroundColor: 'rgba(0,0,0,0.5)',
                  color: 'white',
                  zIndex: 1,
                  '&:hover': { backgroundColor: 'rgba(0,0,0,0.7)' },
                }}
                onClick={handlePrevImage}
              >
                <ChevronLeft />
              </IconButton>

              <IconButton
                sx={{
                  position: 'absolute',
                  right: 16,
                  top: '50%',
                  transform: 'translateY(-50%)',
                  backgroundColor: 'rgba(0,0,0,0.5)',
                  color: 'white',
                  zIndex: 1,
                  '&:hover': { backgroundColor: 'rgba(0,0,0,0.7)' },
                }}
                onClick={handleNextImage}
              >
                <ChevronRight />
              </IconButton>

              {/* Close Button */}
              <IconButton
                sx={{
                  position: 'absolute',
                  right: 16,
                  top: 16,
                  backgroundColor: 'rgba(0,0,0,0.5)',
                  color: 'white',
                  zIndex: 1,
                  '&:hover': { backgroundColor: 'rgba(0,0,0,0.7)' },
                }}
                onClick={() => setOpenLightbox(false)}
              >
                <Close />
              </IconButton>

              {/* Image */}
              <img
                src={selectedImage.url}
                alt={selectedImage.alt_text || selectedImage.title}
                style={{
                  width: '100%',
                  height: 'auto',
                  maxHeight: '80vh',
                  objectFit: 'contain',
                  display: 'block',
                }}
              />

              {/* Image Info */}
              <Card
                sx={{
                  position: 'absolute',
                  bottom: 16,
                  left: 16,
                  right: 16,
                  backgroundColor: 'rgba(0,0,0,0.8)',
                  color: 'white',
                }}
              >
                <CardContent>
                  <Box
                    display="flex"
                    justifyContent="space-between"
                    alignItems="flex-start"
                  >
                    <Box>
                      <Typography variant="h6" gutterBottom>
                        {selectedImage.title}
                      </Typography>
                      {selectedImage.description && (
                        <Typography
                          variant="body2"
                          sx={{ mb: 1, opacity: 0.9 }}
                        >
                          {selectedImage.description}
                        </Typography>
                      )}
                      <Box display="flex" gap={1} flexWrap="wrap">
                        {selectedImage.tags?.map(tag => (
                          <Chip
                            key={tag}
                            label={tag}
                            size="small"
                            variant="outlined"
                            sx={{ color: 'white', borderColor: 'white' }}
                          />
                        ))}
                      </Box>
                    </Box>

                    <Box display="flex" gap={1}>
                      <IconButton
                        sx={{ color: 'white' }}
                        onClick={() => handleToggleFavorite(selectedImage.id)}
                      >
                        {favorites.has(selectedImage.id) ? (
                          <Favorite color="error" />
                        ) : (
                          <FavoriteBorder />
                        )}
                      </IconButton>

                      <IconButton
                        sx={{ color: 'white' }}
                        onClick={() => handleShareImage(selectedImage)}
                      >
                        <Share />
                      </IconButton>
                    </Box>
                  </Box>
                </CardContent>
              </Card>

              {/* Image Counter */}
              <Box
                sx={{
                  position: 'absolute',
                  top: 16,
                  left: 16,
                  backgroundColor: 'rgba(0,0,0,0.5)',
                  color: 'white',
                  px: 2,
                  py: 1,
                  borderRadius: 1,
                }}
              >
                <Typography variant="body2">
                  {currentImageIndex + 1} of {filteredImages.length}
                </Typography>
              </Box>
            </>
          )}
        </DialogContent>
      </Dialog>
    </Box>
  );
};

export default PublicGallery;

import React, { useState, useEffect } from 'react';

const Gallery = ({ images, fetchImages, projectId }) => {
  useEffect(() => {
    if (projectId) {
      fetchImages(projectId);
    }
  }, [projectId, fetchImages]);
  const [selectedImage, setSelectedImage] = useState(null);

  const openModal = image => {
    setSelectedImage(image);
  };

  const closeModal = () => {
    setSelectedImage(null);
  };

  if (!images || images.length === 0) {
    return (
      <div className="gallery-page">
        <div className="container">
          <h1>Gallery</h1>
          <p>No images available.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="gallery-page">
      <div className="container">
        <header className="gallery-header">
          <h1>Beyond Home Gallery</h1>
          <p>Explore the complete collection of artworks</p>
        </header>

        <div className="gallery-grid">
          {images.map(image => (
            <div
              key={image.id}
              className="gallery-item"
              onClick={() => openModal(image)}
            >
              <img
                src={image.img_url}
                alt={image.caption}
                className="gallery-image"
                loading="lazy"
              />
              <div className="image-overlay">
                <span className="image-caption">{image.caption}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Modal for full-size image */}
        {selectedImage && (
          <div className="modal-overlay" onClick={closeModal}>
            <div className="modal-content" onClick={e => e.stopPropagation()}>
              <button className="modal-close" onClick={closeModal}>
                ×
              </button>
              <img
                src={selectedImage.img_url}
                alt={selectedImage.caption}
                className="modal-image"
              />
              <div className="modal-caption">
                <h3>{selectedImage.caption}</h3>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Gallery;

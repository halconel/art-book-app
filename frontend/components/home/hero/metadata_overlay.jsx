import React from 'react';
import squaresSvg from '../../../assets/images/square_svg.svg';

const MetadataOverlay = ({ image }) => {
  if (!image) return null;

  const formatFileSize = bytes => {
    if (!bytes) return 'Unknown';
    const mb = bytes / (1024 * 1024);
    return `${mb.toFixed(1)} MB`;
  };

  const formatDimensions = (width, height) => {
    if (!width || !height) return 'Unknown';
    return `${width}/${height}`;
  };

  const truncateTitle = (title, maxLength = 20) => {
    if (!title) return 'Test Artwork';
    return title.length > maxLength ? title.substring(0, maxLength) + '...' : title;
  };


  return (
    <div className="metadata-overlay">
      <div className="top-bottom-gradient-shadow" />
      <div className="metadata-blocks">
        <div className="metadata-blocks-left">
          <div className="metadata-block size-block">
            <div className="metadata-label">SIZE:</div>
            <div className="metadata-value">
              {formatDimensions(image.width, image.height)}
            </div>
          </div>

          <div className="metadata-block description-block">
            <div className="metadata-label">DESCRIPTION:</div>
            <div className="metadata-value">
              {image.description || 'Digital Illustration'}
            </div>
          </div>

          <div className="metadata-block weight-block">
            <div className="metadata-label">WEIGHT:</div>
            <div className="metadata-value">
              {formatFileSize(image.file_size)}
            </div>
          </div>
        </div>

        <div className="metadata-block art-title-block">
          <div className="art-title">
            <div className="art-title-column-1">
              <div className="barcode-wrapper">
                <div className="barcode-text">
                  {truncateTitle(image.title || image.caption)}
                </div>
              </div>
              <div className="artwork-title">
                {truncateTitle(image.title || image.caption)}
              </div>
            </div>
            <div className="art-title-column-2">
              <div className="squares-svg">
                <img src={squaresSvg} alt="squares" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MetadataOverlay;

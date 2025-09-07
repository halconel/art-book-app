import React from 'react';

const OptimizedImage = ({ 
  src, 
  webpSrc, 
  alt, 
  className, 
  style,
  loading = 'lazy',
  ...props 
}) => {
  return (
    <picture>
      {webpSrc && (
        <source srcSet={webpSrc} type="image/webp" />
      )}
      <img
        src={src}
        alt={alt}
        className={className}
        style={style}
        loading={loading}
        {...props}
      />
    </picture>
  );
};

export default OptimizedImage;
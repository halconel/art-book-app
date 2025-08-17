import React, { useState, useEffect } from 'react';

const SlideshowControls = ({
  totalImages,
  isPlaying,
  lastChangeTime,
  onPrevious,
  onNext,
  onTogglePlay,
}) => {
  const [progress, setProgress] = useState(0);

  // Progress animation for slideshow
  useEffect(() => {
    if (!isPlaying || totalImages === 0) {
      setProgress(0);
      return;
    }

    const duration = 5000; // 5 seconds
    const interval = 50; // Update every 50ms for smooth animation

    const timer = setInterval(() => {
      const elapsed = Date.now() - lastChangeTime;
      const newProgress = Math.min((elapsed / duration) * 100, 100);
      setProgress(newProgress);
    }, interval);

    return () => clearInterval(timer);
  }, [isPlaying, totalImages, lastChangeTime]);

  if (totalImages === 0) return null;

  return (
    <div className="slideshow-controls">
      <button
        className="slideshow-control-btn prev-btn"
        onClick={onPrevious}
        title="Previous Image"
      >
        <i className="fa fa-chevron-left" />
      </button>

      <div className="play-pause-container">
        <svg className="progress-ring" width="60" height="60">
          <circle
            className="progress-ring-circle-bg"
            stroke="rgba(255, 255, 255, 0.2)"
            strokeWidth="3"
            fill="transparent"
            r="26"
            cx="30"
            cy="30"
          />
          <circle
            className="progress-ring-circle"
            stroke="rgba(255, 255, 255, 0.8)"
            strokeWidth="3"
            fill="transparent"
            r="26"
            cx="30"
            cy="30"
            strokeDasharray={`${2 * Math.PI * 26}`}
            strokeDashoffset={`${2 * Math.PI * 26 * (1 - progress / 100)}`}
            style={{
              transform: 'rotate(-90deg)',
              transformOrigin: '30px 30px',
              transition: 'stroke-dashoffset 0.05s linear',
            }}
          />
        </svg>
        <button
          className="slideshow-control-btn play-pause-btn"
          onClick={onTogglePlay}
          title={isPlaying ? 'Pause Slideshow' : 'Play Slideshow'}
        >
          <i className={`fa fa-${isPlaying ? 'pause' : 'play'}`} />
        </button>
      </div>

      <button
        className="slideshow-control-btn next-btn"
        onClick={onNext}
        title="Next Image"
      >
        <i className="fa fa-chevron-right" />
      </button>
    </div>
  );
};

export default SlideshowControls;

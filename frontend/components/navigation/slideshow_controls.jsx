import React, { useState, useEffect, useRef } from 'react';
import { connect } from 'react-redux';
import {
  previousImage,
  nextImage,
  togglePlayPauseAndUpdateTime,
} from '../../actions/slideshow_actions';
import ProgressRing from '../ui/progress_ring';

const SlideshowControls = ({
  totalImages,
  isPlaying,
  lastChangeTime,
  onPrevious,
  onNext,
  onTogglePlay,
}) => {
  const [progress, setProgress] = useState(0);
  const lastChangeTimeRef = useRef(lastChangeTime);

  // Update ref when lastChangeTime changes
  useEffect(() => {
    lastChangeTimeRef.current = lastChangeTime;
  }, [lastChangeTime]);

  // Progress animation for slideshow
  useEffect(() => {
    if (!isPlaying || totalImages === 0) {
      setProgress(0);
      return;
    }

    const duration = 5000; // 5 seconds
    const interval = 50; // Update every 50ms for smooth animation

    const timer = setInterval(() => {
      const elapsed = Date.now() - lastChangeTimeRef.current;
      const newProgress = Math.min((elapsed / duration) * 100, 100);
      setProgress(newProgress);
    }, interval);

    return () => clearInterval(timer);
  }, [isPlaying, totalImages]);

  if (totalImages === 0) return null;

  return (
    <div className="slideshow-controls">
      <button
        className="slideshow-control-btn prev-btn circular-notch"
        onClick={onPrevious}
        title="Previous Image"
      >
        <div className="notch-left">
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path
              d="M12 15L7 10L12 5"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
      </button>

      <div className="play-pause-container">
        <ProgressRing progress={progress} />
        <button
          className="slideshow-control-btn play-pause-btn"
          onClick={onTogglePlay}
          title={isPlaying ? 'Pause Slideshow' : 'Play Slideshow'}
        >
          {isPlaying ? (
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <rect
                x="3"
                y="2"
                width="3"
                height="12"
                fill="currentColor"
                rx="0.5"
              />
              <rect
                x="10"
                y="2"
                width="3"
                height="12"
                fill="currentColor"
                rx="0.5"
              />
            </svg>
          ) : (
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M5 3L13 8L5 13V3Z" fill="currentColor" />
            </svg>
          )}
        </button>
      </div>

      <button
        className="slideshow-control-btn next-btn circular-notch"
        onClick={onNext}
        title="Next Image"
      >
        <div className="notch-right">
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path
              d="M8 5L13 10L8 15"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
      </button>
    </div>
  );
};

const mapStateToProps = state => ({
  totalImages: Object.values(state.images).length,
  isPlaying: state.slideshow.isPlaying,
  lastChangeTime: state.slideshow.lastChangeTime,
});

const mapDispatchToProps = dispatch => ({
  onPrevious: () => dispatch(previousImage()),
  onNext: () => dispatch(nextImage()),
  onTogglePlay: () => dispatch(togglePlayPauseAndUpdateTime()),
});

export default connect(mapStateToProps, mapDispatchToProps)(SlideshowControls);

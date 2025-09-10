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
        <img src="/assets/prev.svg" alt="Prev" />
      </button>

      <div className="play-pause-container">
        <ProgressRing progress={progress} strokeWidth="5" />
        <button
          className="slideshow-control-btn play-pause-btn"
          onClick={onTogglePlay}
          title={isPlaying ? 'Pause Slideshow' : 'Play Slideshow'}
        >
          {isPlaying ? (
            <img src="/assets/pause.svg" alt="Pause" />
          ) : (
            <img src="/assets/play.svg" alt="Play" />
          )}
        </button>
      </div>

      <button
        className="slideshow-control-btn next-btn circular-notch"
        onClick={onNext}
        title="Next Image"
      >
        <img src="/assets/next.svg" alt="Next" />
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

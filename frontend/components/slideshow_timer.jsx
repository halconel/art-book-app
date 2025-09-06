import { useEffect } from 'react';
import { connect } from 'react-redux';
import { autoAdvanceSlideshow } from '../actions/slideshow_actions';

const SlideshowTimer = ({
  isPlaying,
  imagesLength,
  autoAdvanceSlideshow: autoAdvance,
}) => {
  // Auto-advance slideshow
  useEffect(() => {
    if (!isPlaying || imagesLength === 0) return;

    const interval = setInterval(() => {
      autoAdvance();
    }, 5000); // Change image every 5 seconds

    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isPlaying, imagesLength]);

  return null; // This component doesn't render anything
};

const mapStateToProps = state => ({
  isPlaying: state.slideshow.isPlaying,
  imagesLength: Object.values(state.images).length,
});

const mapDispatchToProps = dispatch => ({
  autoAdvanceSlideshow: () => dispatch(autoAdvanceSlideshow()),
});

export default connect(mapStateToProps, mapDispatchToProps)(SlideshowTimer);

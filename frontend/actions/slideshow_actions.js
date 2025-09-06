export const SET_CURRENT_IMAGE_INDEX = 'SET_CURRENT_IMAGE_INDEX';
export const TOGGLE_PLAY_PAUSE = 'TOGGLE_PLAY_PAUSE';
export const SET_IS_PLAYING = 'SET_IS_PLAYING';
export const UPDATE_LAST_CHANGE_TIME = 'UPDATE_LAST_CHANGE_TIME';

// Action creators
export const setCurrentImageIndex = index => ({
  type: SET_CURRENT_IMAGE_INDEX,
  index,
});

export const togglePlayPause = () => ({
  type: TOGGLE_PLAY_PAUSE,
});

export const setIsPlaying = isPlaying => ({
  type: SET_IS_PLAYING,
  isPlaying,
});

export const updateLastChangeTime = () => ({
  type: UPDATE_LAST_CHANGE_TIME,
  timestamp: Date.now(),
});

// Thunk actions for navigation
export const nextImage = () => (dispatch, getState) => {
  const { images, slideshow } = getState();
  const imageList = Object.values(images);

  if (imageList.length > 0) {
    // Ensure current index is within bounds
    const currentIndex =
      slideshow.currentImageIndex >= imageList.length
        ? 0
        : slideshow.currentImageIndex;
    const nextIndex = (currentIndex + 1) % imageList.length;
    dispatch(setCurrentImageIndex(nextIndex));
    dispatch(updateLastChangeTime());
    dispatch(setIsPlaying(false)); // Stop auto-play when user manually navigates
  }
};

export const previousImage = () => (dispatch, getState) => {
  const { images, slideshow } = getState();
  const imageList = Object.values(images);

  if (imageList.length > 0) {
    // Ensure current index is within bounds
    const currentIndex =
      slideshow.currentImageIndex >= imageList.length
        ? 0
        : slideshow.currentImageIndex;
    const prevIndex =
      currentIndex === 0 ? imageList.length - 1 : currentIndex - 1;
    dispatch(setCurrentImageIndex(prevIndex));
    dispatch(updateLastChangeTime());
    dispatch(setIsPlaying(false)); // Stop auto-play when user manually navigates
  }
};

export const togglePlayPauseAndUpdateTime = () => dispatch => {
  dispatch(togglePlayPause());
  dispatch(updateLastChangeTime());
};

// Auto-advance action for timer
export const autoAdvanceSlideshow = () => (dispatch, getState) => {
  const { images, slideshow } = getState();
  const imageList = Object.values(images);

  if (slideshow.isPlaying && imageList.length > 0) {
    // Ensure current index is within bounds
    const currentIndex =
      slideshow.currentImageIndex >= imageList.length
        ? 0
        : slideshow.currentImageIndex;
    const nextIndex = (currentIndex + 1) % imageList.length;
    dispatch(setCurrentImageIndex(nextIndex));
    dispatch(updateLastChangeTime());
  }
};

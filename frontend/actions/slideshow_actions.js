export const SET_CURRENT_IMAGE_INDEX = 'SET_CURRENT_IMAGE_INDEX';
export const TOGGLE_PLAY_PAUSE = 'TOGGLE_PLAY_PAUSE';
export const SET_IS_PLAYING = 'SET_IS_PLAYING';
export const UPDATE_LAST_CHANGE_TIME = 'UPDATE_LAST_CHANGE_TIME';
export const SET_PRELOADED_IMAGES = 'SET_PRELOADED_IMAGES';

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

export const setPreloadedImages = preloadedImages => ({
  type: SET_PRELOADED_IMAGES,
  preloadedImages,
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

// Image preloading utility
const preloadImage = url => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = url;
  });
};

// Preload next images action
export const preloadNextImages = () => (dispatch, getState) => {
  const { images, slideshow } = getState();
  const imageList = Object.values(images);

  if (imageList.length === 0) return;

  const currentIndex =
    slideshow.currentImageIndex >= imageList.length
      ? 0
      : slideshow.currentImageIndex;

  // Preload next 2 images
  const nextIndex = (currentIndex + 1) % imageList.length;
  const afterNextIndex = (currentIndex + 2) % imageList.length;

  const imagesToPreload = [
    imageList[nextIndex]?.img_url,
    imageList[afterNextIndex]?.img_url,
  ].filter(Boolean);

  Promise.all(imagesToPreload.map(preloadImage))
    .then(preloadedImages => {
      const preloadedUrls = preloadedImages.reduce((acc, img, index) => {
        acc[imagesToPreload[index]] = img;
        return acc;
      }, {});
      dispatch(setPreloadedImages(preloadedUrls));
    })
    .catch(error => {
      // Silent error handling
    });
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

import {
  SET_CURRENT_IMAGE_INDEX,
  TOGGLE_PLAY_PAUSE,
  SET_IS_PLAYING,
  UPDATE_LAST_CHANGE_TIME,
} from '../actions/slideshow_actions';

const initialState = {
  currentImageIndex: 0,
  isPlaying: true,
  lastChangeTime: Date.now(),
};

const slideshowReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_CURRENT_IMAGE_INDEX:
      return {
        ...state,
        currentImageIndex: action.index,
      };
    case TOGGLE_PLAY_PAUSE:
      return {
        ...state,
        isPlaying: !state.isPlaying,
      };
    case SET_IS_PLAYING:
      return {
        ...state,
        isPlaying: action.isPlaying,
      };
    case UPDATE_LAST_CHANGE_TIME:
      return {
        ...state,
        lastChangeTime: action.timestamp,
      };
    default:
      return state;
  }
};

export default slideshowReducer;

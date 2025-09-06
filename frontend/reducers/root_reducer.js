import { combineReducers } from 'redux';
import projectsReducer from './projects_reducer';
import imagesReducer from './images_reducer';
import slideshowReducer from './slideshow_reducer';

const rootReducer = combineReducers({
  projects: projectsReducer,
  images: imagesReducer,
  slideshow: slideshowReducer,
});

export default rootReducer;

import { combineReducers } from 'redux';
import projectsReducer from './projects_reducer';
import imagesReducer from './images_reducer';

const rootReducer = combineReducers({
  projects: projectsReducer,
  images: imagesReducer,
});

export default rootReducer;

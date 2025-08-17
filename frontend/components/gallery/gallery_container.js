import { connect } from 'react-redux';
import { fetchImages } from '../../actions/image_actions';
import Gallery from './gallery';

const mapStateToProps = state => ({
  images: Object.values(state.images).filter(
    image => image.project_id === state.projects.beyond_home?.id
  ),
  projectId: state.projects.beyond_home?.id,
});

const mapDispatchToProps = dispatch => ({
  fetchImages: projectId => dispatch(fetchImages(projectId)),
});

export default connect(mapStateToProps, mapDispatchToProps)(Gallery);

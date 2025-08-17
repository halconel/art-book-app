import React from 'react';
import { connect } from 'react-redux';
import { fetchMainPageImages } from '../../actions/image_actions';
import BeyondHome from './beyond_home';

const mapStateToProps = state => ({
  images: Object.values(state.images),
});

const mapDispatchToProps = dispatch => ({
  fetchMainPageImages: () => dispatch(fetchMainPageImages()),
});

const BeyondHomeContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(BeyondHome);

// Wrapper to pass only necessary props from parent
const BeyondHomeContainerWrapper = ({ currentImageIndex }) => {
  return <BeyondHomeContainer currentImageIndex={currentImageIndex} />;
};

export default BeyondHomeContainerWrapper;

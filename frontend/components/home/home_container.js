import React from 'react';
import { connect } from 'react-redux';
import { fetchMainPageImages } from '../../actions/image_actions';
import Home from './home';

const mapStateToProps = state => ({
  images: Object.values(state.images),
});

const mapDispatchToProps = dispatch => ({
  fetchMainPageImages: () => dispatch(fetchMainPageImages()),
});

const HomeContainer = connect(mapStateToProps, mapDispatchToProps)(Home);

// Wrapper component - no props needed now since everything comes from Redux
const HomeContainerWrapper = () => {
  return <HomeContainer />;
};

export default HomeContainerWrapper;

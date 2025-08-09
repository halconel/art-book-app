import React from 'react';
import { connect } from 'react-redux';
import { useParams } from 'react-router-dom';
import { fetchUser } from '../../actions/user_actions';
import UserProfile from './user_profile';

const UserProfileContainer = () => {
  const { id } = useParams();
  
  React.useEffect(() => {
    // We'll handle this in the component
  }, [id]);

  return <UserProfileWithParams userId={id} />;
};

const UserProfileWithParams = connect(
  (state, ownProps) => ({
    user: state.entities.users[ownProps.userId],
    currentUser: state.session.currentUser,
    projects: Object.values(state.entities.projects).filter(
      project => project.user_id === parseInt(ownProps.userId)
    )
  }),
  dispatch => ({
    fetchUser: id => dispatch(fetchUser(id))
  })
)(UserProfile);

export default UserProfileContainer;

import { connect } from 'react-redux';
import { fetchUser } from '../../actions/user_actions';
import Likes from './likes';

const mapStateToProps = (state, ownProps) => {
  return {
    user: state.entities.users[ownProps.match.params.id],
    projects: Object.values(state.entities.projects).filter(
      project => project.user_id === parseInt(ownProps.match.params.id)
    )
  };
};

const mapDispatchToProps = dispatch => ({
  fetchUser: id => dispatch(fetchUser(id))
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Likes);

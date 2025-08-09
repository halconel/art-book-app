import { connect } from 'react-redux';
import { fetchUser } from '../../actions/user_actions';
import UserMain from './user_main';

const UserMainContainer = (props) => {
  const mapStateToProps = (state) => {
    return {
      user: state.entities.users[props.userId],
      projects: Object.values(state.entities.projects).filter(
        project => project.user_id === parseInt(props.userId)
      )
    };
  };

  const mapDispatchToProps = dispatch => ({
    fetchUser: id => dispatch(fetchUser(id))
  });

  const ConnectedUserMain = connect(
    mapStateToProps,
    mapDispatchToProps
  )(UserMain);

  return <ConnectedUserMain />;
};

export default UserMainContainer;

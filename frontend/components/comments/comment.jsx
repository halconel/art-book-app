import React from 'react';
import { Link } from 'react-router-dom';

const Comment = (props) => {
  const [state, setState] = React.useState({
    user_id: null,
    project_id: null,
    body: ""
  });

  const update = (field) => {
    return e => setState({
      ...state,
      [field]: e.currentTarget.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const comment = {
      ...state,
      user_id: props.userId,
      project_id: props.projectId
    };
    props.createComment({ comment });
    setState({ ...state, body: "" });
  };

  return (
    <li className="new-comment-container">
      <img className="comment-avatar" src={props.currentUser.avatar_url} alt={props.currentUser.username} />
      <div className="comment">
        <Link to={`users/${props.userId}`} className="comment-user">{props.currentUser.username}</Link>
        <form onSubmit={handleSubmit} className="comment-body">
          <input 
            type="text" 
            onChange={update('body')}
            placeholder="new comment"
            value={state.body}
            className="comment-input"
          />
        </form>
      </div>
    </li>
  );
};

export default Comment;

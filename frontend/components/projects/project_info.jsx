import React from 'react';
import { Link } from 'react-router-dom';

const ProjectInfo = (props) => {
  React.useEffect(() => {
    const id = props.project.user_id;
    props.fetchUser(id);
  }, [props.project.user_id]);

  const likeStatus = () => {
    if (props.project.likes.includes(props.currentUser.id)) {
      return "Liked ❤";
    } else {
      return "Like";
    }
  };

  const buttonType = () => {
    if (props.project.likes.includes(props.currentUser.id)) {
      return "liked-button";
    } else {
      return "session-button";
    }
  };

  const toggleLike = () => {
    const like = {
      project_id: props.project.id,
      user_id: props.currentUser.id
    };

    if (props.project.likes.includes(props.currentUser.id)) {
      props.unlikeProject(like);
    } else {
      props.likeProject(like);
    }
  };

  const project = props.project;
  const user = props.user;

  return (
    <aside className="project-right">
      <Link to={`/users/${user.id}`}>
        <img className="avatar" src={user.avatar_url} alt={user.username} />
      </Link>
      <div className="about">
        <h3>{user.username}</h3>
        <h4>{project.description}</h4>
        <p>Lorem ipsum dolor sit amet, noster verear pro cu, mea eu vitae latine contentiones. Duo in modo magna aeterno, eu dico definiebas ius, ei postea sensibus consequat sea. Ne commodo electram iudicabit duo, vim et illum dissentiet.
        </p>
        <section className="likes-group">
          <button className={buttonType()} onClick={toggleLike}>{likeStatus()}</button>
        </section>
      </div>
    </aside>
  );
};

export default ProjectInfo;

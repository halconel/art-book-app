import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Greeting = (props) => {
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    props.logout();
    navigate('/');
  };

  return (
    <nav className="nav-right">
      <div>
          <Link to="/home">
            <button className="header-button">
              <p>Explore</p>
            </button>
          </Link>

          <Link to="/">
            <button onClick={handleSubmit} className="header-button">
              <p>Log Out</p>
            </button>
          </Link>

          <Link to={`/users/${props.currentUser.id}`}>
            <button className="header-button">
              <p>My Profile</p>
            </button>
          </Link>
      </div>
    </nav>
  );
};

export default Greeting;

import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Modal from 'react-modal';
import { login, signup, clearErrors } from '../../actions/session_actions';
import { connect } from 'react-redux';

const style = {
  content: {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)',
    backgroundColor: 'white',
    border: '1px solid #ccc',
    borderRadius: '4px',
    padding: '20px',
    maxWidth: '400px',
    width: '90%'
  },
  overlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.75)'
  }
};

const SessionForm = (props) => {
  const navigate = useNavigate();
  const [state, setState] = React.useState({
    email: '',
    username: '',
    password: '',
    modalOpen: false,
    logIn: true
  });

  const update = (field) => {
    return e => setState({ ...state, [field]: e.currentTarget.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const user = Object.assign({}, state);
    const processForm = (state.logIn) ? props.login : props.signup;
    processForm(user).then(() => {
      if (state.logIn) {
        navigate('/home');
      }
    });
  };

  const guestSignup = (e) => {
    e.preventDefault();
    const guestUser = {
      username: 'guest',
      password: 'password',
      email: 'guest@example.com'
    };
    props.signup(guestUser).then(() => {
      navigate('/home');
    });
  };

  const guestLogin = (e) => {
    e.preventDefault();
    const guestUser = {
      username: 'guest',
      password: 'password'
    };
    props.login(guestUser).then(() => {
      navigate('/home');
    });
  };

  const renderErrors = () => {
    return (
      <ul className="errors">
        {props.errors.map((error, i) => (
          <li key={`error-${i}`}>
            {error}
          </li>
        ))}
      </ul>
    );
  };

  const closeModal = () => {
    setState({ ...state, modalOpen: false });
  };

  const openModal = (bool) => {
    setState({ ...state, modalOpen: true, logIn: bool });
  };

  const formHeader = () => {
    return (state.logIn) ? <h3>Log in to ArtBook</h3> : <h3>Join ArtBook</h3>;
  };

  const formButton = () => {
    return (state.logIn) ? "Log in" : "Sign up";
  };

  const switchForms = () => {
    props.clearErrors();
    setState({ ...state, logIn: !state.logIn });
  };

  const switchButton = () => {
    return (state.logIn) ? <p>Don't have an account? Sign up</p> : <p>Already have an account? Log in</p>;
  };

  const emailInput = () => {
    if (!state.logIn) {
      return (
        <input type="text"
          className="login-input"
          placeholder="Email"
          value={state.email}
          onChange={update('email')}
        />
      );
    }
  };

  return (
    <nav className="nav-right">

      <div className="header-group">
        <button className="header-button" onClick={() => openModal(true)}>Login</button>
        <button className="header-button" onClick={() => openModal(false)}>Sign up</button>
      </div>

      <Modal
        contentLabel="Modal"
        isOpen={state.modalOpen}
        onRequestClose={closeModal}
        style={style}>

        <div className="login-form-container">
          <div className="x-button">
            <button onClick={closeModal}><i aria-hidden="true"></i></button>
          </div>

          <form className="login-form-box">
            {formHeader()}
            {renderErrors()}

            <div className="login-form">
              <input type="text"
                className="login-input"
                placeholder="Username"
                value={state.username}
                onChange={update('username')}
              />

              {emailInput()}

              <input type="password"
                className="login-input"
                placeholder="Password"
                value={state.password}
                onChange={update('password')}
              />
            </div>

            <div className="session-button-container">
              <button className="session-button" onClick={handleSubmit}>{formButton()}</button>
              <button className="session-button" onClick={state.logIn ? guestLogin : guestSignup}>Guest</button>
            </div>

            <a
              href="/#"
              className="switch-forms"
              onClick={switchForms}
            >
              {switchButton()}
            </a>
          </form>
        </div>
      </Modal>
    </nav>
  );
};

export default SessionForm;

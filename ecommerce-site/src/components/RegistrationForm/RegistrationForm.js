import React, { useState } from 'react';
import '../Login/Login.css';

const RegistrationForm = ({ onRegister, isRegistering, setIsRegistering }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const toggleForm = () => {
    setIsRegistering(!isRegistering);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    onRegister(username, password);
  };

  return (
    <div className='login-container'>
      {isRegistering ? (
        <form onSubmit={handleSubmit} className='login-form'>
          <input type="text" id="register-username" name="username" value={username} onChange={(e) => setUsername(e.target.value)} placeholder="Username" required />
          <input type="password" id="register-password" name="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" required />
          <button type="submit" className='login-form-button'>Register</button>
          <button type="button" onClick={toggleForm} className='toggle-form-button'>
            Already have an account? Log in
          </button>
        </form>
      ) : (
        <button onClick={toggleForm} className='toggle-form-button'>
          Create new account
        </button>
      )}
    </div>
  );
};

export default RegistrationForm;

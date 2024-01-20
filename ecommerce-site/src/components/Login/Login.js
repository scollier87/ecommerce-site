import React, { useState, useContext } from 'react';
import { useNavigate, useLocation} from 'react-router-dom';
import { AuthContext } from '../../App';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');

  const navigate = useNavigate();
  const location = useLocation();
  const auth = useContext(AuthContext);

  const { from } = location.state || {from: {pathname: '/'}};

  const handleLogin = async (event) => {
    event.preventDefault();

    try {
      const userData = await fetchUserData(username);
      if (userData && userData.password === password) {
        console.log('Login successful');
        auth.setIsLoggedIn(true);
        navigate(from);
        // Proceed with setting user context, redirecting, etc.
      } else {
        console.log('Login failed: Invalid username or password');
        setLoginError('Invalid username or password');
      }
    } catch (error) {
      console.log('Login error:', error);
      setLoginError('Login failed due to a technical issue.');
    }
  };

  return (
    <div>
      <form onSubmit={handleLogin}>
        <input
          type="text"
          id="login-username"
          name="username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Username"
        />
        <input
          type="password"
          id="login-password"
          name="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
        />
        <button type="submit">Login</button>
        {loginError && <p>{loginError}</p>}
      </form>
    </div>
  );
};

const fetchUserData = async (username) => {
  const url = `https://ecommerce-site-bae1b-default-rtdb.firebaseio.com/data/Users/${username}.json`;
  const response = await fetch(url);
  if (!response.ok) throw new Error('Failed to fetch user data');
  const data = await response.json();
  console.log('Data received:', data);
  return data;
};

export default Login;

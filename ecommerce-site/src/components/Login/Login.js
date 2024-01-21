import React, { useState, useContext } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { AuthContext, CartContext } from '../../App';
import { v4 as uuidv4 } from 'uuid'; // Importing UUID for generating user IDs
import './Login.css'
import { fetchUserCart } from '../utils/cartUtils';

// Placeholder function for password hashing
const hashPassword = (password) => {
  return password;
};

const fetchUserData = async (username) => {
  try {
    const response = await fetch(`https://ecommerce-site-bae1b-default-rtdb.firebaseio.com/data/Users.json`);
    if (!response.ok) {
      throw new Error('Failed to fetch user data');
    }

    const users = await response.json();
    console.log('Fetched users data:', users);

    let userData = null;
    for (const key in users) {
      if (users[key].username.toLowerCase() === username.toLowerCase()) {
        userData = { uid: key, ...users[key] };
        console.log('User data found:', userData);
        break;
      }
    }

    if (!userData) {
      console.log('User not found for username:', username);
    }

    return userData;
  } catch (error) {
    console.error('Error fetching user data:', error);
    throw error;
  }
};



const Login = () => {
  const [isRegistering, setIsRegistering] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');

  const navigate = useNavigate();
  const location = useLocation();
  const { setIsLoggedIn, setUser } = useContext(AuthContext);
  const { setCartItems } = useContext(CartContext)
  const { from } = location.state || { from: { pathname: '/' } };

  const handleLogin = async (event) => {
    event.preventDefault();
    try {
      const userData = await fetchUserData(username);
      if (userData && userData.password === hashPassword(password)) {
        console.log('Login successful');
        setIsLoggedIn(true);

        setUser(userData);
        console.log('User data after setUser:', userData);

        // Store user data in localStorage
        localStorage.setItem('user', JSON.stringify(userData));
        console.log('User data stored in localStorage:', userData);

        const userCart = await fetchUserCart(userData.uid);
        setCartItems(userCart);
        localStorage.setItem('cart', JSON.stringify(userCart));

        navigate(from);
      } else {
        setLoginError('Invalid username or password');
      }
    } catch (error) {
      console.error('Login failed due to a technical issue.', error);
      setLoginError(`Login failed due to: ${error.message}`);
    }
  };

  const handleRegister = async (event) => {
    event.preventDefault();
    const newUid = uuidv4();
    const passwordHash = hashPassword(password);
    const newUser = { username, password: passwordHash };
    const url = `https://ecommerce-site-bae1b-default-rtdb.firebaseio.com/data/Users/${newUid}.json`;
    try {
      const response = await fetch(url, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newUser),
      });
      if (response.ok) {
        console.log('User registration successful');
        setIsLoggedIn(true);
        navigate(from);
      } else {
        throw new Error('Failed to register user');
      }
    } catch (error) {
      setLoginError('Registration failed due to a technical issue.');
    }
  };

  return (
    <div className='login-container'>
      {isRegistering ? (
        <form onSubmit={handleRegister} className='login-form'>
          <input type="text" id="register-username" name="username" value={username} onChange={(e) => setUsername(e.target.value)} placeholder="Username" required />
          <input type="password" id="register-password" name="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" required />
          <button type="submit">Register</button>
          {loginError && <p className='login-error'>{loginError}</p>}
        </form>
      ) : (
        <form onSubmit={handleLogin} className='login-form'>
          <input type="text" id="login-username" name="username" value={username} onChange={(e) => setUsername(e.target.value)} placeholder="Username" required />
          <input type="password" id="login-password" name="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" required />
          <button type="submit">Login</button>
          {loginError && <p className='login-error'>{loginError}</p>}
        </form>
      )}
      <button onClick={() => setIsRegistering(!isRegistering)} className='toggle-form'>
        {isRegistering ? 'Already have an account? Log in' : 'Create new account'}
      </button>
    </div>
  );
};

export default Login;

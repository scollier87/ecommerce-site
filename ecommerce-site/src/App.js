import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import NavBar from './components/NavBar/NavBar';
import Home from './components/Splash/Splash';
import Login from './components/Login/Login';
import Shop from './components/Shop/Shop';
import Cart from './components/Cart/Cart';
import './App.css'

export const AuthContext = React.createContext({
  isLoggedIn: false,
  user: null,
  setIsLoggedIn: () => {},
  setUser: () => {}
});

export const CartContext = React.createContext({
  cartItems: [],
  setCartItems: () => {}
});

function App() {
  const getInitialValue = (key, defaultValue) => {
    const storedValue = localStorage.getItem(key);
    if (storedValue === null) {
      return defaultValue;
    }
    try {
      return JSON.parse(storedValue);
    } catch (error) {
      console.error(`Error parsing local storage for key ${key}:`, error);
      return defaultValue;
    }
  };

  const [isLoggedIn, setIsLoggedIn] = useState(() => getInitialValue('isLoggedIn', false));
  const [user, setUser] = useState(() => getInitialValue('user', null));
  const [cartItems, setCartItems] = useState(() => getInitialValue('cartItems', []));

  useEffect(() => {
    if (isLoggedIn) {
      localStorage.setItem('isLoggedIn', JSON.stringify(isLoggedIn));
      localStorage.setItem('user', JSON.stringify(user));
    } else {
      localStorage.removeItem('isLoggedIn');
      localStorage.removeItem('user');
      localStorage.removeItem('cart');
    }
  }, [isLoggedIn, user]);

  useEffect(() => {
    localStorage.setItem('cartItems', JSON.stringify(cartItems));
  }, [cartItems]);

  return (
    <AuthContext.Provider value={{ isLoggedIn, setIsLoggedIn, user, setUser }}>
      <CartContext.Provider value={{ cartItems, setCartItems }}>
        <Router>
          <NavBar />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/shop" element={<Shop />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/login" element={<Login />} />
          </Routes>
        </Router>
      </CartContext.Provider>
    </AuthContext.Provider>
  );
}

export default App;
import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import NavBar from './components/NavBar/NavBar';
import Home from './components/Splash/Splash';
import Login from './components/Login/Login';
import Shop from './components/Shop/Shop';
import Cart from './components/Cart/Cart';
import Order from './components/Order/Order';
import Orders from './components/ViewOrders/ViewOrders';
import NavigateModal from './components/NavigateModal/NavigateModal';
import './App.css'

export const AuthContext = React.createContext({
  isLoggedIn: false,
  user: null,
  setIsLoggedIn: () => {},
  setUser: () => {},
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
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    if (isLoggedIn) {
      localStorage.setItem('isLoggedIn', JSON.stringify(isLoggedIn));
      localStorage.setItem('user', JSON.stringify(user));
    } else {
      localStorage.removeItem('isLoggedIn');
      localStorage.removeItem('user');
    }
  }, [isLoggedIn, user]);

  useEffect(() => {
    const storedUserJson = localStorage.getItem('user');
    if (storedUserJson) {
      const storedUser = JSON.parse(storedUserJson);
      setUser(storedUser);
      if (storedUser && storedUser.uid) {
        checkForAbandonedCart(storedUser.uid);
      }
    }
  }, []);


  const checkForAbandonedCart = async (userId) => {
    console.log(`Checking cart for user ID: ${userId}`);
    const url = `https://ecommerce-site-bae1b-default-rtdb.firebaseio.com/data/Users/${userId}/cart.json`;

    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`Failed to fetch cart data: ${response.statusText}`);
      }
      const cartData = await response.json();
      if (cartData && cartData.length > 0) {
        console.log('Abandoned cart found, showing modal.');
        setShowModal(true);
      } else {
        console.log('No abandoned cart, not showing modal.');
        setShowModal(false);
      }
    } catch (error) {
      console.error('Error checking for abandoned cart:', error);
    }
  };


  useEffect(() => {
    if (user && user.uid) {
      checkForAbandonedCart(user.uid);
    }
  }, [user])

const handleContinueShopping = () => {
  setShowModal(false);
};

const handleResetCart = async () => {
  setShowModal(false);
  setCartItems([]);

  if (user && user.uid) {
    const url = `https://ecommerce-site-bae1b-default-rtdb.firebaseio.com/data/Users/${user.uid}/cart.json`;
    try {
      await fetch(url, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({}),
      });
      console.log('Cart cleared in Firebase.');
      localStorage.removeItem('cartItems');
    } catch (error) {
      console.error('Error clearing cart in Firebase:', error);
    }
  }
};

const modalActions = [
  { type: 'navigate', path: '/shop', label: 'Continue Shopping' },
  { type: 'navigate', path: '/cart', label: 'Proceed to Order' },
  { type: 'function', fn: handleResetCart, label: 'Reset Cart' }
];

console.log(`Modal shown: ${showModal}`);

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
              <Route path="/order" element={<Order />} />
              <Route path="/viewOrders" element={<Orders />} />
          </Routes>
          <NavigateModal
            isOpen={showModal}
            onClose={() => setShowModal(false)}
            actions={modalActions}
            title="Abandoned Cart Detected"
          >
            <p>You have items in your cart. Would you like to complete your order?</p>
          </NavigateModal>
        </Router>
      </CartContext.Provider>
    </AuthContext.Provider>
  );
}

export default App;
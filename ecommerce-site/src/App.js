// src/App.js
import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import NavBar from './components/NavBar/NavBar';
import Home from './components/Splash/Splash';
import Login from './components/Login/Login';
import Shop from './components/Shop/Shop';
import Cart from './components/Cart/Cart';

export const AuthContext = React.createContext(null);
export const CartContext = React.createContext();

function App() {

  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [cart, setCart] = useState([])

  return (
    <AuthContext.Provider value={{isLoggedIn, setIsLoggedIn}}>
      <CartContext.Provider value={{ cart, setCart}}>
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

import React, { useContext, useEffect, useCallback } from 'react';
import { CartContext, AuthContext } from '../../App';
import { useNavigate } from 'react-router-dom';
import './Cart.css';

const Cart = () => {
  const { cartItems, setCartItems } = useContext(CartContext);
  const { isLoggedIn, user } = useContext(AuthContext);
  const navigate = useNavigate();

  const fetchCartFromFirebase = useCallback(async (userId) => {
    const url = `https://ecommerce-site-bae1b-default-rtdb.firebaseio.com/data/Users/${userId}/cart.json`;
    try {
      const response = await fetch(url);
      if (!response.ok) throw new Error('Failed to fetch cart.');
      const cartData = await response.json();
      const itemsArray = cartData ? Object.values(cartData) : [];
      setCartItems(itemsArray);
      localStorage.setItem('cartItems', JSON.stringify(itemsArray));
    } catch (error) {
      console.error('Error fetching cart from Firebase:', error);
      const localCart = localStorage.getItem('cartItems');
      if (localCart) {
        setCartItems(JSON.parse(localCart));
      }
    }
  }, [setCartItems]);


  useEffect(() => {
    if (user && user.uid) {
      fetchCartFromFirebase(user.uid);
    }
  }, [user, fetchCartFromFirebase]);

  const updateCartInFirebaseAndLocally = async (updatedCartItems) => {
    if (!user || !user.uid) {
      console.error("Can't update the cart without a user ID.");
      return;
    }

    const url = `https://ecommerce-site-bae1b-default-rtdb.firebaseio.com/data/Users/${user.uid}/cart.json`;
    try {
      await fetch(url, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedCartItems),
      });
      setCartItems(updatedCartItems);
    } catch (error) {
      console.error('Error updating cart in Firebase:', error);
    }
  };

  const updateQuantity = (productId, newQuantity) => {
    if (newQuantity < 1) {
      console.log("Invalid quantity. Minimum quantity is 1.");
      return;
    }

    const updatedCartItems = cartItems.map((item) => {
      if (item.id === productId) {
        return { ...item, quantity: newQuantity };
      }
      return item;
    });

    // Update the cart in Firebase and locally
    updateCartInFirebaseAndLocally(updatedCartItems);
  };


  const handleContinueShopping = () => navigate('/shop');
  const handleProceedToOrder = () => navigate('/order');

  const removeFromCart = (productId) => {
    const updatedCartItems = cartItems.filter(item => item.id !== productId);
    updateCartInFirebaseAndLocally(updatedCartItems);
  };

  return (
    <div className="cart-container">
      {cartItems.length > 0 ? (
        cartItems.map((item) => (
          <div key={item.id} className="cart-item">
            <img src={item.imageUrl} alt={item.name} />
            <div className="cart-item-details">
              <h4>{item.name}</h4>
              <p>Price: ${item.price.toFixed(2)}</p>
              <div className="quantity-controls">
                <button onClick={() => updateQuantity(item.id, item.quantity - 1)}>-</button>
                <span>{item.quantity}</span>
                <button onClick={() => updateQuantity(item.id, item.quantity + 1)}>+</button>
              </div>
              <p>In Stock: {item.stock}</p>
              <p>Subtotal: ${(item.quantity * item.price).toFixed(2)}</p>
              <button onClick={() => removeFromCart(item.id)} className='remove-from-cart-button'>Remove</button>
            </div>
          </div>
        ))
      ) : (
        isLoggedIn ? (
          <p className='cart-empty-message'>Your cart is empty. <button onClick={handleContinueShopping} className="continue-shopping-button">Continue Shopping</button></p>
        ) : (
          <p className='cart-empty-message'>Please <button onClick={() => navigate('/login')} className="login-button">log in</button> to view your cart.</p>
        )
      )}
      {cartItems.length > 0 && (
        <div className="cart-actions">
          <div className="cart-summary">
            <p className="cart-total">Total: ${cartItems.reduce((total, item) => total + item.quantity * item.price, 0).toFixed(2)}</p>
            <button onClick={handleProceedToOrder} className="proceed-to-order-button button-common">Proceed to Checkout</button>
          </div>
          <button onClick={handleContinueShopping} className="continue-shopping-button button-common">Continue Shopping</button>
        </div>
      )}
    </div>
  );

};

export default Cart;

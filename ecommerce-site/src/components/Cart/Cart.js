import React, { useContext, useEffect } from 'react';
import { CartContext, AuthContext } from '../../App';
import { useNavigate } from 'react-router-dom';
import './Cart.css';

const Cart = () => {
  const { cartItems, setCartItems } = useContext(CartContext);
  const { isLoggedIn, user } = useContext(AuthContext);
  const navigate = useNavigate();

  const fetchCartFromFirebase = async (userId) => {
    const url = `https://ecommerce-site-bae1b-default-rtdb.firebaseio.com/data/Users/${userId}/cart.json`;
    try {
      const response = await fetch(url);
      const cartData = await response.json();
      if (!response.ok) throw new Error('Failed to fetch cart.');
      setCartItems(cartData ? Object.values(cartData) : []);
    } catch (error) {
      console.error('Error fetching cart:', error);
    }
  };

  // Fetch cart from Firebase when user logs in
  useEffect(() => {
    if (user && user.uid) {
      fetchCartFromFirebase(user.uid);
    }
  }, [user, setCartItems]);

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
    // Prevent invalid quantity updates
    if (newQuantity < 1) {
      console.log("Invalid quantity. Minimum quantity is 1.");
      return;
    }

    // Find the item to update
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

import React, { useContext } from 'react';
import { CartContext, AuthContext } from '../../App';
import './Cart.css';

const Cart = () => {
  const { cartItems, setCartItems } = useContext(CartContext);
  const { user } = useContext(AuthContext);

  const updateQuantity = async (productId, newQuantity) => {
    // Prevent negative quantities
    if (newQuantity < 0) return;

    let updatedCartItems;

    if (newQuantity === 0) {
      // Filter out the item with zero quantity
      updatedCartItems = cartItems.filter(item => item.id !== productId);
    } else {
      // Update the quantity of the item
      updatedCartItems = cartItems.map(item =>
        item.id === productId ? { ...item, quantity: newQuantity } : item
      );
    }

    setCartItems(updatedCartItems);
    await updateCartInFirebase(user.uid, updatedCartItems);
  };

  const removeFromCart = async (productId) => {
    // Filter out the item to be removed
    const updatedCartItems = cartItems.filter(item => item.id !== productId);

    setCartItems(updatedCartItems);
    await updateCartInFirebase(user.uid, updatedCartItems);
  };

  const updateCartInFirebase = async (userId, updatedCart) => {
    if (!userId) {
      console.error("Can't update the cart without a user ID.");
      return;
    }

    try {
      const response = await fetch(`https://ecommerce-site-bae1b-default-rtdb.firebaseio.com/data/Users/${userId}/cart.json`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedCart),
      });

      if (!response.ok) {
        throw new Error('Could not update cart in Firebase.');
      }
    } catch (error) {
      console.error('Error updating cart in Firebase:', error);
    }
  };

  if (!cartItems) {
    return <p>Loading cart...</p>;
  }

  if (cartItems.length === 0) {
    return <p>Your cart is empty.</p>;
  }

  return (
    <div className="cart-container">
      {cartItems.map((item) => (
        <div key={item.id} className="cart-item">
          <img src={item.imageUrl} alt={item.name} />
          <div>
            <p>{item.name}</p>
            <p>${item.price.toFixed(2)}</p>
            <div className="quantity-controls">
              <button onClick={() => updateQuantity(item.id, item.quantity - 1)}>-</button>
              <span> {item.quantity} </span>
              <button onClick={() => updateQuantity(item.id, item.quantity + 1)}>+</button>
            </div>
            <p>In Stock: {item.stock}</p>
            <p>Subtotal: ${(item.quantity * item.price).toFixed(2)}</p>
          </div>
          <button onClick={() => removeFromCart(item.id)} className='remove-from-cart-button'>Remove</button>
        </div>
      ))}
      <div className="cart-summary">
        <p>Total: ${cartItems.reduce((total, item) => total + item.quantity * item.price, 0).toFixed(2)}</p>
        {/* You can add Checkout button and other functionalities here */}
      </div>
    </div>
  );
};

export default Cart;
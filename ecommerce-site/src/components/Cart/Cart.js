import React, { useContext } from 'react';
import { CartContext, AuthContext } from '../../App';
import './Cart.css';

const Cart = () => {
  const { cartItems, setCartItems } = useContext(CartContext);
  const { user } = useContext(AuthContext);

  const removeFromCart = async (productId) => {
    const updatedCartItems = cartItems.reduce((acc, item) => {
      if (item.id === productId) {
        const newQuantity = item.quantity - 1;
        if (newQuantity > 0) {
          // Decrease the quantity
          acc.push({ ...item, quantity: newQuantity });
        }
        // If newQuantity is 0, item is not pushed back into the cart
      } else {
        // Keep the item in the cart
        acc.push(item);
      }
      return acc;
    }, []);

    setCartItems(updatedCartItems);
    localStorage.setItem('cart', JSON.stringify(updatedCartItems));

    // Update cart in Firebase
    if (user && user.uid) {
      await updateCartInFirebase(user.uid, updatedCartItems);
    }
  };

  const updateCartInFirebase = async (userId, updatedCart) => {
    try {
      const response = await fetch(`https://ecommerce-site-bae1b-default-rtdb.firebaseio.com/data/Users/${userId}/cart.json`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedCart)
      });

      if (!response.ok) {
        throw new Error('Could not update cart in Firebase.');
      }
      console.log('Cart updated in Firebase after removal.');
    } catch (error) {
      console.error('Error updating cart in Firebase:', error);
    }
  };

  if (cartItems.length === 0) {
    return <p>Your cart is empty.</p>;
  }

  return (
    <div className="cart-container">
      {cartItems.map((item, index) => (
        <div key={index} className="cart-item">
          <img src={item.imageUrl} alt={item.name} className="product-image" />
          <div className="cart-item-details">
            <p className="cart-item-name">{item.name}</p>
            <p className="cart-item-price">${item.price.toFixed(2)}</p>
            <p className="cart-item-quantity">Quantity: {item.quantity}</p>
          </div>
          <button onClick={() => removeFromCart(item.id)} className="remove-from-cart-button">
            Remove
          </button>
        </div>
      ))}
    </div>
  );
};

export default Cart;

import React, { useContext, useEffect } from 'react';
import { CartContext, AuthContext } from '../../App';
import { useNavigate } from 'react-router-dom';
import './Cart.css';

const Cart = () => {
  const { cartItems, setCartItems } = useContext(CartContext);
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    console.log("Cart component mounted");
    const storedCart = localStorage.getItem('cartItems');
    console.log("Stored cart from localStorage:", storedCart);
    if (storedCart && storedCart.length > 0) {
      setCartItems(JSON.parse(storedCart));
    }
  }, [setCartItems]);


  const updateQuantity = async (productId, newQuantity) => {
    console.log("Updating quantity for product:", productId, "New quantity:", newQuantity);
    const existingCartItem = cartItems.find(item => item.id === productId);

    // Prevent negative quantities and exceeding stock count
    if (newQuantity < 0 || (existingCartItem && newQuantity > existingCartItem.stock)){
    console.log("Invalid quantity update attempted");
    return};

    let updatedCartItems;

    if (newQuantity === 0) {
      updatedCartItems = cartItems.filter(item => item.id !== productId);
    } else {
      updatedCartItems = cartItems.map(item =>
        item.id === productId ? { ...item, quantity: newQuantity } : item
      );
    }
    console.log("Cart items after quantity update:", updatedCartItems);
    setCartItems(updatedCartItems);
    await updateCartInFirebase(user.uid, updatedCartItems);
  };

  const handleContinueShopping = () => {
    navigate('/shop'); // Navigate to the shop page
  };

  const removeFromCart = async (productId) => {
    console.log("Removing product from cart:", productId);
    const updatedCartItems = cartItems.filter(item => item.id !== productId);
    console.log("Cart items after removal:", updatedCartItems);
    setCartItems(updatedCartItems);
    await updateCartInFirebase(user.uid, updatedCartItems);
  };

  const updateCartInFirebase = async (userId, updatedCart) => {
    console.log("Updating cart in Firebase for user:", userId);
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
      console.log("Cart update response from Firebase:", await response.json());
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

  const handleProceedToOrder = () => {
    navigate('/order')
  };

  return (
    <div className="cart-container">
      {cartItems.map((item) => (
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
      ))}
      <div className="cart-actions">
        {cartItems.length > 0 && (
          <div className="cart-summary">
            <p className="cart-total">Total: ${cartItems.reduce((total, item) => total + item.quantity * item.price, 0).toFixed(2)}</p>
            <button onClick={handleProceedToOrder} className="proceed-to-order-button">
              Proceed to Checkout
            </button>
          </div>
        )}
        <button onClick={handleContinueShopping} className="continue-shopping-button">
          Continue Shopping
        </button>
      </div>
    </div>
  );


};

export default Cart;

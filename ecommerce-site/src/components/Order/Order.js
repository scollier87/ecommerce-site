import React, { useContext, useState } from 'react';
import { AuthContext, CartContext } from '../../App';
import { useNavigate } from 'react-router-dom';
import './Order.css'

const Order = () => {
  const { user } = useContext(AuthContext);
  const { cartItems, setCartItems } = useContext(CartContext);
  const navigate = useNavigate();

  const [address, setAddress] = useState('');
  const [phone, setPhone] = useState('');
  const [specialInstructions, setSpecialInstructions] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const totalPrice = cartItems.reduce((total, item) => total + item.price * item.quantity, 0);

  const formatDate = (date) => {
    const twoDigit = (num) => num.toString().padStart(2, '0');

    let month = twoDigit(date.getMonth() + 1); // months are 0-based in JavaScript
    let day = twoDigit(date.getDate());
    let year = date.getFullYear().toString().slice(-2); // get the last two digits of the year
    let hours = twoDigit(date.getHours());
    let minutes = twoDigit(date.getMinutes());

    return `${month}/${day}/${year}, ${hours}:${minutes}`;
  };

  const confirmOrder = async () => {
    setLoading(true);
    setError(null);

  const orderDate = new Date();

    try {
      for (const item of cartItems) {
        const productResponse = await fetch(`https://ecommerce-site-bae1b-default-rtdb.firebaseio.com/data/Products/${item.id}.json`);
        const product = await productResponse.json();

        const updatedStock = product.stock - item.quantity;
        if (updatedStock < 0) {
          throw new Error(`Insufficient stock for ${item.name}`);
        }

        await fetch(`https://ecommerce-site-bae1b-default-rtdb.firebaseio.com/data/Products/${item.id}.json`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ stock: updatedStock }),
        });
      }

      const order = {
        userId: user.uid,
        items: cartItems,
        totalPrice,
        address,
        phone,
        specialInstructions,
        status: 'pending',
        datePlaced: formatDate(orderDate),
      };

      await fetch(`https://ecommerce-site-bae1b-default-rtdb.firebaseio.com/data/Users/${user.uid}/Orders.json`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(order),
      });

      await fetch(`https://ecommerce-site-bae1b-default-rtdb.firebaseio.com/data/Users/${user.uid}/cart.json`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify([]),
      });

      setCartItems([]);

      setLoading(false);
      alert('Your order has been placed successfully!');

      navigate('/');
    } catch (error) {
      setError(error.message);
      setLoading(false);
      alert('Failed to place order: ' + error.message);
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div className="order-container">
      <h2>Your Order</h2>
      <div className="order-form">
        <input
          type="text"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          placeholder="Address"
          className="order-input"
        />
        <input
          type="text"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          placeholder="Phone Number"
          className="order-input"
        />
        <textarea
          value={specialInstructions}
          onChange={(e) => setSpecialInstructions(e.target.value)}
          placeholder="Special Instructions"
          className="order-textarea"
        />
      </div>
      {cartItems.map((item) => (
        <div key={item.id} className="order-item">
          <img src={item.imageUrl} alt={item.name} className="order-item-image" />
          <div className="order-item-details">
            <p>{item.name} - ${item.price.toFixed(2)} x {item.quantity}</p>
          </div>
        </div>
      ))}
      <div className="order-summary">
        <p>Total: ${totalPrice.toFixed(2)}</p>
      </div>
      <div className="order-buttons">
        <button
          onClick={confirmOrder}
          disabled={loading}
          className="confirm-order-button"
        >
          Confirm Order
        </button>
        <button onClick={() => navigate('/cart')} className="cancel-order-button">
          Cancel Order
        </button>
      </div>
    </div>
  );


};

export default Order;

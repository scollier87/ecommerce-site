import React, { useContext } from 'react';
import { CartContext } from '../../App';

const Cart = () => {
  const { cart } = useContext(CartContext);

  if (cart.length === 0) {
    return <p>Your cart is empty.</p>;
  }

  return (
    <div className="cart-container">
      {cart.map((item, index) => (
        <div key={index} className="cart-item">
          <img src={item.imageUrl} alt={item.name} />
          <p>{item.name}</p>
          <p>${item.price}</p>
          {/* Implement removing from cart if needed */}
        </div>
      ))}
    </div>
  );
};

export default Cart;
import React, { useContext } from 'react';
import { AuthContext, CartContext } from '../../App';
import { useNavigate } from 'react-router-dom';
import './ProductCard.css';

const ProductCard = ({ product }) => {
  const { isLoggedIn, user } = useContext(AuthContext);
  const { cart, setCart } = useContext(CartContext);
  const navigate = useNavigate();

  const handleAddToCart = () => {
    if (isLoggedIn && user) {
      const newCartItem = { ...product, quantity: 1 }; // Define your cart item structure
      const updatedCart = [...cart, newCartItem];
      setCart(updatedCart);
      updateCartInFirebase(user.id, updatedCart); // Assuming user.id is the unique identifier for the user
    } else {
      navigate('/login');
    }
  };

  const updateCartInFirebase = async (userId, updatedCart) => {
    if (!userId) return; // Do not proceed if userId is not set

    try {
      const response = await fetch(`https://ecommerce-site-bae1b-default-rtdb.firebaseio.com/Users/${userId}/cart.json`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(updatedCart)
      });

      if (!response.ok) {
        throw new Error('Could not update cart in Firebase.');
      }

      console.log('Cart updated in Firebase.');
    } catch (error) {
      console.error('Error updating cart in Firebase:', error);
    }
  };

  if (!product) {
    return null;
  }

  return (
    <div className="product-card">
      <div className="product-image-container">
        <img src={product.imageUrl} alt={product.name} className="product-image" />
        <img src={product.hoverImageUrl} alt={product.name} className="product-image hover-image" />
      </div>
      <div className="product-details">
        <h3>{product.name}</h3>
        <p className="price">${product.price}</p>
        <button onClick={handleAddToCart} className="add-to-cart-button">
          Add to Cart
        </button>
      </div>
    </div>
  );
};

export default ProductCard;


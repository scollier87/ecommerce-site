import React, { useContext } from 'react';
import { AuthContext, CartContext } from '../../App';
import { useNavigate } from 'react-router-dom';
import './ProductCard.css';

const ProductCard = ({ product }) => {
  const { isLoggedIn, user } = useContext(AuthContext);
  const { cart, setCart } = useContext(CartContext);
  const navigate = useNavigate();

  const handleAddToCart = () => {
    console.log('isLoggedIn:', isLoggedIn);
    console.log('user:', user);
    if (!isLoggedIn || !user) {
      navigate('/login');
      return;
    }

    const itemIndex = cart.findIndex((item) => item.id === product.id);

    let updatedCart;
    if (itemIndex > -1) {
      updatedCart = cart.map((item, index) =>
        index === itemIndex ? { ...item, quantity: item.quantity + 1 } : item
      );
    } else {
      updatedCart = [...cart, { ...product, quantity: 1 }];
    }

    setCart(updatedCart);
    updateCartInFirebase(user.uid, updatedCart);
  };


  const updateCartInFirebase = async (userId, updatedCart) => {
    if (!userId) {
      console.error("Can't update the cart without a user ID.");
      return;
    }

    try {
      const response = await fetch(`https://ecommerce-site-bae1b-default-rtdb.firebaseio.com/Users/${userId}/cart.json`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedCart),
      });

      if (!response.ok) {
        throw new Error('Could not update cart in Firebase.');
      }

      const responseBody = await response.json();
      console.log('Response from Firebase:', responseBody);

      console.log('Cart updated in Firebase for user:', userId);
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
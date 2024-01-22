import React, { useContext } from 'react';
import { AuthContext, CartContext } from '../../App';
import { useNavigate } from 'react-router-dom';
import './ProductCard.css';

const ProductCard = ({ product }) => {
  const { isLoggedIn, user } = useContext(AuthContext);
  const { cartItems, setCartItems } = useContext(CartContext);
  const navigate = useNavigate();

  const handleAddToCart = async () => {
    if (!isLoggedIn) {
      navigate('/login');
      return;
    }

    // Check if the product is already in the cart
    const existingCartItemIndex = cartItems.findIndex(item => item.id === product.id);

    let updatedCartItems;
    if (existingCartItemIndex !== -1) {
      // Product is already in the cart, so update the quantity
      updatedCartItems = cartItems.map((item, index) =>
        index === existingCartItemIndex ? { ...item, quantity: item.quantity + 1 } : item
      );
    } else {
      // Product is not in the cart, so add it with quantity 1
      updatedCartItems = [...cartItems, { ...product, quantity: 1 }];
    }

    setCartItems(updatedCartItems);
    await updateCartInFirebase(user.uid, updatedCartItems);

    navigate('/cart');
  };

  const updateCartInFirebase = async (userId, updatedCart) => {
    if (!userId) {
      console.error("Can't update the cart without a user ID.");
      return;
    }

    try {
      const response = await fetch(`https://ecommerce-site-bae1b-default-rtdb.firebaseio.com/data/Users/${userId}/cart.json`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedCart),
      });

      if (!response.ok) {
        throw new Error('Could not update cart in Firebase.');
      }

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
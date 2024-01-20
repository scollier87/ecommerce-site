import React from 'react';
import './ProductCard.css'; // Your CSS file for the product card

const ProductCard = ({ product }) => {
  if (!product) {
    return null;
  }

  return (
    <div className="product-card">
      <div className="product-image-container">
        <img src={product.imageUrl} alt={product.name} className="product-image" />
        <img src={product.hoverImageUrl} alt={product.name} className="product-image hover-image" />
      </div>
      <h3>{product.name}</h3>
      <p className="price">${product.price}</p>
    </div>
  );
};

export default ProductCard;

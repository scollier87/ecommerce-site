import React, { useState, useEffect } from 'react';
import ProductCard from '../ProductCard/ProductCard';
import './Shop.css';

const Shop = () => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch('https://ecommerce-site-bae1b-default-rtdb.firebaseio.com/data/Products.json');
        const data = await response.json();
        console.log(data)
        const loadedProducts = [];

        for (const key in data) {
          if (Object.prototype.hasOwnProperty.call(data, key)) {
            loadedProducts.push({
              id: key,
              ...data[key],
            });
          }
        }

        setProducts(loadedProducts);
      } catch (error) {
        console.error('There has been a problem with your fetch operation:', error);
        setProducts([]);
      }
    };

    fetchProducts();
  }, []);

  return (
    <div className="shop-container">
      {products.length > 0 ? (
        products.map((product) => {
          if (!product || !product.imageUrl || !product.name || typeof product.price !== 'number') {
            return null; // Skip rendering this product if it doesn't have the required fields
          }
          return <ProductCard key={product.id} product={product} />; // Render the ProductCard
        })
      ) : (
        <p>Loading products...</p>
      )}
    </div>
  );
};

export default Shop;

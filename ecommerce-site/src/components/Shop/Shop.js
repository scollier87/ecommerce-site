import React, { useState, useEffect } from 'react';
import ProductCard from '../ProductCard/ProductCard';
import Modal from '../Modal/Modal';
import './Shop.css';

const Shop = () => {
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch('https://ecommerce-site-bae1b-default-rtdb.firebaseio.com/data/Products.json');
        const data = await response.json();
        const loadedProducts = [];

        for (const key in data) {
          if (data.hasOwnProperty(key)) {
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

  const openModal = product => {
    setSelectedProduct(product);
    setIsModalOpen(true);
  }

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedProduct(null);
  }

  return (
    <div className="shop-container">
      {products.length > 0 ? (
        products.map((product) => {
          if (!product || !product.imageUrl || !product.name || typeof product.price !== 'number') {
            return null;
          }

          return (
            <div key={product.id} className="product-container">
              <ProductCard product={product} />
              <button onClick={() => openModal(product)} className="view-item-button">
                View Item
              </button>
            </div>
          );
        })
      ) : (
        <p>Loading products...</p>
      )}

      <Modal isOpen={isModalOpen} onClose={closeModal}>
        {selectedProduct && (
          <div>
            <h2>{selectedProduct.name}</h2>
            <img src={selectedProduct.imageUrl} alt={selectedProduct.name} />
            <p>Price: ${selectedProduct.price.toFixed(2)}</p>
            {/* Include any other product details you want to show in the modal */}
          </div>
        )}
      </Modal>
    </div>
  );
};

export default Shop;

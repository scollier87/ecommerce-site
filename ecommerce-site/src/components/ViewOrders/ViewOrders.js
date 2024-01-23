import React, { useContext, useState, useEffect } from 'react';
import { AuthContext } from '../../App';
import './ViewOrders.css';

const Orders = () => {
  const { user } = useContext(AuthContext);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrders = async () => {
      if (!user) {
        setError('User not logged in.');
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(`https://ecommerce-site-bae1b-default-rtdb.firebaseio.com/data/Users/${user.uid}/Orders.json`);
        if (!response.ok) {
          throw new Error('Failed to fetch orders.');
        }
        const data = await response.json();

        if (data && typeof data === 'object' && !Array.isArray(data)) {
          const loadedOrders = Object.keys(data).map(key => {
            const orderData = data[key];
            const itemsArray = orderData.items && Array.isArray(orderData.items) ? orderData.items : [];
            return {
              id: key,
              address: orderData.address,
              items: itemsArray,
              phone: orderData.phone,
              specialInstructions: orderData.specialInstructions,
              status: orderData.status,
              totalPrice: orderData.totalPrice,
              userId: orderData.userId,
            };
          });
          setOrders(loadedOrders);
        } else {
          setOrders([]);
        }
      } catch (error) {
        console.error('Error fetching orders:', error);
        setError(error.message);
      }

      setLoading(false);
    };

    fetchOrders();
  }, [user]);

  if (loading) return <div className="loading">Loading orders...</div>;
  if (error) return <p>Error: {error}</p>;
  if (orders.length === 0) return <p>You have no orders yet.</p>;

  return (
    <div className="orders">
      <h2>Your Orders</h2>
      <div className="order-list">
        {orders.map((order) => (
          <div key={order.id} className="order-item">
            <p>Order ID: {order.id}</p>
            <p>Address: {order.address}</p>
            <p>Phone: {order.phone}</p>
            <p>Total Price: {order.totalPrice}</p>
            <p>Status: {order.status}</p>
            {order.items && order.items.length > 0 && (
              <div>
                <h3>Items:</h3>
                <ul>
                  {order.items.map((item, index) => (
                    <li key={index} className="order-item-detail">
                      <img src={item.imageUrl} alt="Product" className="order-item-image" />
                      <div className="order-item-info">
                        <p>Quantity: {item.quantity}</p>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Orders;

export const fetchUserCart = async (userId) => {
    const response = await fetch(`https://ecommerce-site-bae1b-default-rtdb.firebaseio.com/data/Users/${userId}/cart.json`);
    if (!response.ok) {
        throw new Error('Failed to fetch cart data');
    }
    const cartData = await response.json();
    return cartData || []; // If no cart data, return empty array
};

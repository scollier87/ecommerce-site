import React, { useContext } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { AuthContext, CartContext } from '../../App'; // Import CartContext as well
import './NavBar.css';

const NavBar = () => {
    const { isLoggedIn, setIsLoggedIn, setUser } = useContext(AuthContext); // Destructure the needed functions
    const { setCartItems } = useContext(CartContext); // Destructure setCart from CartContext
    const navigate = useNavigate();
    const location = useLocation();

    const handleLogout = () => {
        setIsLoggedIn(false); // Use the destructured function
        setUser(null); // Use the destructured function
        setCartItems([]); // Clear the cart using setCart from CartContext
        // Remove items from local storage
        localStorage.removeItem('isLoggedIn');
        localStorage.removeItem('user');
        localStorage.removeItem('cart');
        navigate('/');
    }

    return (
        <nav className="navbar">
            <div className="nav-logo">
                <Link to="/">RockClimbingStore</Link>
            </div>
            <div className="nav-links">
                <Link to="/">Home</Link>
                <Link to="/shop">Shop</Link>
                <Link to="/cart">Cart</Link>
                {isLoggedIn ? ( // Use the destructured isLoggedIn
                    <button onClick={handleLogout} className="sign-out-button">Sign Out</button>
                ) : (
                    <Link to="/login" state={{from: location.pathname}}>Login</Link> // Only show when not logged in
                )}
            </div>
        </nav>
    );
}

export default NavBar;

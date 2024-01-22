import React, { useContext } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { AuthContext, CartContext } from '../../App';
import './NavBar.css';

const NavBar = () => {
    const { isLoggedIn, setIsLoggedIn, setUser } = useContext(AuthContext);
    const { cartItems } = useContext(CartContext)
    const { setCartItems } = useContext(CartContext);
    const navigate = useNavigate();
    const location = useLocation();

    const totalQuantity = cartItems.reduce((total, item) => total + item.quantity, 0);

    const handleLogout = () => {
        setIsLoggedIn(false);
        setUser(null);
        setCartItems([]);
        localStorage.removeItem('isLoggedIn');
        localStorage.removeItem('user');
        localStorage.removeItem('cartItems');
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
                <Link to="/cart">Cart ({totalQuantity})</Link>
                {isLoggedIn ? (
                    <button onClick={handleLogout} className="sign-out-button">Sign Out</button>
                ) : (
                    <Link to="/login" state={{from: location.pathname}}>Login</Link> // Only show when not logged in
                )}
            </div>
        </nav>
    );
}

export default NavBar;

import React, { useContext } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../App';
import './NavBar.css';

const NavBar = () => {
    const auth = useContext(AuthContext);
    const navigate = useNavigate();
    const location = useLocation();

    const handleLogout = () => {
        auth.setIsLoggedIn(false);
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
                {auth.isLoggedIn ? (
                    <button onClick={handleLogout} className="sign-out-button">Sign Out</button>
                ) : (
                    <Link to="/login" state={{from: location.pathname}}>Login</Link> // Only show when not logged in
                )}
            </div>
        </nav>
    );
}

export default NavBar;

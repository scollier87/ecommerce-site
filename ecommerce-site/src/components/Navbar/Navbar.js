import React from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css';

const NavBar = () => {
    return (
        <nav className="navbar">
            <div className="nav-logo">
                <Link to="/">RockClimbingNeeds</Link>
            </div>
            <div className="nav-links">
                <Link to="/">Home</Link>
                <Link to="/shop">Shop</Link>
                <Link to="/cart">Cart</Link>
                <Link to="/login">Login</Link>
            </div>
        </nav>
    );
}

export default NavBar;

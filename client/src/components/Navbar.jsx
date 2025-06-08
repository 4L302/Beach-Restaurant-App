import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import '../App.css'; // Stili custom

const Navbar = () => {
  const { user, logout, isAuthenticated, isLoading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  // Nascondi la navbar nelle pagine di login e register
  if (location.pathname === '/login' || location.pathname === '/register') {
    return null;
  }

  if (isLoading) return null;

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const toggleMenu = () => {
    setMenuOpen(prev => !prev);
  };

  // Chiude il menu quando clicchi su un link (utile per mobile)
  const handleLinkClick = () => {
    setMenuOpen(false);
  };

  return (
    <nav className="navbar navbar-light bg-glass shadow-sm fixed-top">
      <div className="container d-flex justify-content-between align-items-center">
        <Link to="/" className="navbar-brand fw-bold" onClick={handleLinkClick}>
          RestaurantLido
        </Link>

        <button
          className="navbar-toggler"
          type="button"
          aria-label="Toggle navigation"
          onClick={toggleMenu}
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className={`navbar-collapse ${menuOpen ? 'show' : 'collapse'}`} id="navbarNav">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            <li className="nav-item">
              <Link to="/" className="nav-link" onClick={handleLinkClick}>Home</Link>
            </li>
            <li className="nav-item">
              <Link to="/menu" className="nav-link" onClick={handleLinkClick}>Menu</Link>
            </li>
            {isAuthenticated && (
              <>
                <li className="nav-item">
                  <Link to="/reservations" className="nav-link" onClick={handleLinkClick}>Book</Link>
                </li>
                <li className="nav-item">
                  <Link to="/my-reservations" className="nav-link" onClick={handleLinkClick}>My Bookings</Link>
                </li>
              </>
            )}
          </ul>
          <ul className="navbar-nav ms-auto d-flex align-items-center">
            {isAuthenticated ? (
              <>
                {user && (
                  <li className="nav-item me-2">
                    <span className="navbar-text">Hi, {user.name}!</span>
                  </li>
                )}
                <li className="nav-item">
                  <button
                    onClick={() => {
                      handleLogout();
                      handleLinkClick();
                    }}
                    className="btn btn-outline-danger btn-sm"
                  >
                    Logout
                  </button>
                </li>
              </>
            ) : (
              <>
                <li className="nav-item">
                  <Link to="/login" className="nav-link" onClick={handleLinkClick}>Login</Link>
                </li>
                <li className="nav-item">
                  <Link to="/register" className="nav-link" onClick={handleLinkClick}>Register</Link>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

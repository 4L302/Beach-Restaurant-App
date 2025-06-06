import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Navbar = () => {
    const { user, logout, isAuthenticated } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login'); // Redirect to login page after logout
    };

    return (
        <nav className="bg-gray-800 text-white p-4 shadow-md">
            <div className="container mx-auto flex flex-wrap justify-between items-center">
                <Link to="/" className="text-xl font-bold hover:text-gray-300">RestaurantLido</Link>

                <div className="space-x-4 flex items-center mt-2 sm:mt-0">
                    <Link to="/" className="hover:text-gray-300">Home</Link>
                    <Link to="/menu" className="hover:text-gray-300">Menu</Link>

                    {isAuthenticated ? (
                        <>
                            <Link to="/reservations" className="hover:text-gray-300">Book</Link>
                            <Link to="/my-reservations" className="hover:text-gray-300">My Bookings</Link>
                            {user && <span className="text-gray-400 hidden md:inline">Hi, {user.name}!</span>}
                            <button
                                onClick={handleLogout}
                                className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-3 rounded text-sm focus:outline-none focus:shadow-outline"
                            >
                                Logout
                            </button>
                        </>
                    ) : (
                        <>
                            <Link to="/login" className="hover:text-gray-300">Login</Link>
                            <Link to="/register" className="hover:text-gray-300">Register</Link>
                        </>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;

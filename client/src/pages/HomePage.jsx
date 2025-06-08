import React from 'react';
import { Link } from 'react-router-dom'; // Import Link for the optional button

const HomePage = () => {
    return (
        <div className="container py-5">
            <div className="p-5 mb-4 bg-light rounded-3 shadow-sm"> {/* Added shadow-sm for subtle depth */}
                <div className="container-fluid py-5 text-center">
                    <h1 className="display-4 fw-bold">Welcome to RestaurantLido!</h1> {/* Updated h1 to display-4 for more impact */}
                    <p className="fs-4 col-md-10 mx-auto"> {/* Used fs-4 and restricted width for better readability */}
                        Discover a world of exquisite flavors and an unforgettable dining experience.
                        Our chefs craft every dish with passion, using only the freshest ingredients.
                    </p>
                    <Link className="btn btn-primary btn-lg mt-4" to="/menu">View Our Menu</Link> {/* Adjusted margin-top */}
                </div>
            </div>

            {/* Optional: Add more sections like featured dishes or about us summary here */}
            {/* Example:
            <div className="row align-items-md-stretch">
                <div className="col-md-6 mb-4">
                    <div className="h-100 p-5 text-white bg-dark rounded-3">
                        <h2>About Us</h2>
                        <p>Learn more about our story and commitment to quality.</p>
                        <Link className="btn btn-outline-light" to="/about">Read More</Link>
                    </div>
                </div>
                <div className="col-md-6 mb-4">
                    <div className="h-100 p-5 bg-light border rounded-3">
                        <h2>Book a Table</h2>
                        <p>Reserve your spot for an amazing meal.</p>
                        <Link className="btn btn-outline-secondary" to="/reservations">Make a Reservation</Link>
                    </div>
                </div>
            </div>
            */}
        </div>
    );
};

export default HomePage;

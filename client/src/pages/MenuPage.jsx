import React, { useState, useEffect } from 'react';
import apiClient from '../services/api';
import DishCard from '../components/DishCard'; // Import DishCard

const MenuPage = () => {
    const [allDishes, setAllDishes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchDishes = async () => {
            try {
                setLoading(true);
                setError('');
                const response = await apiClient.get('/dishes');
                setAllDishes(response.data);
            } catch (err) {
                console.error("Error fetching dishes:", err);
                setError('Failed to load dishes. Please try again later.');
            } finally {
                setLoading(false);
            }
        };
        fetchDishes();
    }, []);

    // Categorize dishes - ensuring category exists and is a string before toLowerCase()
    const fishDishes = allDishes.filter(dish => dish.category && typeof dish.category === 'string' && dish.category.toLowerCase() === 'fish');
    const meatDishes = allDishes.filter(dish => dish.category && typeof dish.category === 'string' && dish.category.toLowerCase() === 'meat');
    const otherDishes = allDishes.filter(dish =>
        dish.category && typeof dish.category === 'string' &&
        dish.category.toLowerCase() !== 'fish' &&
        dish.category.toLowerCase() !== 'meat'
    );

    if (loading) {
        return (
            <div className="container text-center py-5">
                <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading...</span>
                </div>
                <p className="lead mt-2">Loading menu...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="container py-5">
                <div className="alert alert-danger text-center">{error}</div>
            </div>
        );
    }

    return (
        <div className="container py-4">
            <h1 className="text-center display-4 fw-bold my-5">Our Menu</h1>

            {fishDishes.length > 0 && (
                <section className="mb-5">
                    <h2 className="h2 text-info mb-4 border-bottom pb-2">
                        Seafood Delights
                    </h2>
                    <div className="row">
                        {fishDishes.map(dish => (
                            <div key={dish.id} className="col-12 col-sm-6 col-md-4 col-lg-3 mb-4">
                                <DishCard dish={dish} />
                            </div>
                        ))}
                    </div>
                </section>
            )}

            {meatDishes.length > 0 && (
                <section className="mb-5">
                    <h2 className="h2 text-danger mb-4 border-bottom pb-2">
                        From the Land
                    </h2>
                    <div className="row">
                        {meatDishes.map(dish => (
                            <div key={dish.id} className="col-12 col-sm-6 col-md-4 col-lg-3 mb-4">
                                <DishCard dish={dish} />
                            </div>
                        ))}
                    </div>
                </section>
            )}

            {otherDishes.length > 0 && (
                 <section className="mb-5">
                    <h2 className="h2 text-secondary mb-4 border-bottom pb-2">
                        More Options
                    </h2>
                    <div className="row">
                        {otherDishes.map(dish => (
                            <div key={dish.id} className="col-12 col-sm-6 col-md-4 col-lg-3 mb-4">
                                <DishCard dish={dish} />
                            </div>
                        ))}
                    </div>
                </section>
            )}

            {allDishes.length === 0 && !loading && (
                <div className="text-center py-5">
                    <p className="lead text-muted">No dishes available at the moment. Please check back later!</p>
                </div>
            )}
        </div>
    );
};

export default MenuPage;

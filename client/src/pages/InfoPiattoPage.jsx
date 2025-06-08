import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import apiClient from '../services/api';

const InfoPiattoPage = () => {
    const { id } = useParams(); // Get dish ID from URL params
    const [dish, setDish] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchDishDetails = async () => {
            try {
                setLoading(true);
                setError('');
                const response = await apiClient.get(`/dishes/${id}`);
                setDish(response.data);
            } catch (err) {
                console.error(`Error fetching dish details for ID ${id}:`, err);
                if (err.response && err.response.status === 404) {
                    setError('Dish not found.');
                } else {
                    setError('Failed to load dish details. Please try again later.');
                }
            } finally {
                setLoading(false);
            }
        };

        if (id) {
            fetchDishDetails();
        }
    }, [id]);

    if (loading) {
        return (
            <div className="container text-center py-5">
                <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading...</span>
                </div>
                <p className="lead mt-2">Loading dish details...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="container py-5">
                <div className="alert alert-danger text-center" role="alert">
                    {error}
                </div>
                 <div className="text-center mt-3">
                    <Link to="/menu" className="btn btn-secondary">
                        &larr; Back to Menu
                    </Link>
                </div>
            </div>
        );
    }

    if (!dish) {
        return (
            <div className="container text-center py-5">
                <p className="lead text-muted">Dish information is currently unavailable.</p>
                <div className="mt-3">
                    <Link to="/menu" className="btn btn-secondary">
                        &larr; Back to Menu
                    </Link>
                </div>
            </div>
        );
    }

    const imageUrl = dish.image_url || 'https://via.placeholder.com/700x450.png?text=No+Image+Available';

    return (
        <div className="bg-light min-vh-100 py-4 py-md-5">
            <div className="container"> {/* Added container for better spacing on smaller screens */}
                <div className="card shadow-lg mx-auto" style={{ maxWidth: '768px' }}>
                    <img
                        src={imageUrl}
                        alt={dish.name}
                        className="card-img-top"
                        style={{ maxHeight: '450px', objectFit: 'cover' }}
                    />
                    <div className="card-body p-4 p-md-5">
                        <h1 className="display-5 fw-bold mb-3">{dish.name}</h1>
                        <p className="h3 fw-semibold text-success mb-4">${dish.price.toFixed(2)}</p>

                        {dish.description && (
                            <section className="mb-4">
                                <h2 className="h4 text-dark mt-4 mb-2 fw-semibold">Description</h2>
                                <p className="text-muted">{dish.description}</p>
                            </section>
                        )}

                        {dish.ingredients && (
                            <section className="mb-4">
                                <h2 className="h4 text-dark mt-4 mb-2 fw-semibold">Ingredients</h2>
                                <p>{dish.ingredients}</p> {/* Default paragraph styling */}
                            </section>
                        )}

                        {dish.preparation && (
                            <section className="mb-4">
                                <h2 className="h4 text-dark mt-4 mb-2 fw-semibold">Preparation</h2>
                                <p>{dish.preparation}</p> {/* Default paragraph styling */}
                            </section>
                        )}

                        {dish.allergens && (
                            <section className="mb-4">
                                <h2 className="h4 text-dark mt-4 mb-2 fw-semibold">Allergens</h2>
                                <p className="text-danger">{dish.allergens}</p>
                            </section>
                        )}

                        <div className="mt-4 pt-2 text-center"> {/* Added pt-2 for a bit more spacing */}
                            <Link
                                to="/menu"
                                className="btn btn-primary btn-lg"
                            >
                                &larr; Back to Menu
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default InfoPiattoPage;

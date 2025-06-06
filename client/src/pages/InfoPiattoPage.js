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
        return <div className="text-center py-10">Loading dish details...</div>;
    }

    if (error) {
        return <div className="text-center py-10 text-red-500">{error}</div>;
    }

    if (!dish) {
        // This case might be redundant if error state covers not found, but good for safety
        return <div className="text-center py-10 text-gray-500">Dish information is currently unavailable.</div>;
    }

    const imageUrl = dish.image_url || 'https://via.placeholder.com/600x400.png?text=No+Image+Available';

    return (
        <div className="bg-gray-50 min-h-screen py-8">
            <div className="container mx-auto px-4">
                <div className="max-w-4xl mx-auto bg-white shadow-xl rounded-lg overflow-hidden">
                    <img
                        src={imageUrl}
                        alt={dish.name}
                        className="w-full h-64 sm:h-80 md:h-96 object-cover"
                    />
                    <div className="p-6 md:p-8">
                        <h1 className="text-3xl sm:text-4xl font-bold text-gray-800 mb-4">{dish.name}</h1>
                        <p className="text-2xl font-semibold text-green-600 mb-6">${dish.price.toFixed(2)}</p>

                        {dish.description && (
                            <div className="mb-6">
                                <h2 className="text-xl font-semibold text-gray-700 mb-2">Description</h2>
                                <p className="text-gray-600 text-base leading-relaxed">{dish.description}</p>
                            </div>
                        )}

                        {dish.ingredients && (
                            <div className="mb-6">
                                <h2 className="text-xl font-semibold text-gray-700 mb-2">Ingredients</h2>
                                <p className="text-gray-600 text-base">{dish.ingredients}</p>
                            </div>
                        )}

                        {dish.preparation && (
                            <div className="mb-6">
                                <h2 className="text-xl font-semibold text-gray-700 mb-2">Preparation</h2>
                                <p className="text-gray-600 text-base">{dish.preparation}</p>
                            </div>
                        )}

                        {dish.allergens && (
                            <div className="mb-6">
                                <h2 className="text-xl font-semibold text-gray-700 mb-2">Allergens</h2>
                                <p className="text-red-500 text-base">{dish.allergens}</p>
                            </div>
                        )}

                        <div className="mt-8 text-center">
                            <Link
                                to="/menu"
                                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg transition-colors duration-300"
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

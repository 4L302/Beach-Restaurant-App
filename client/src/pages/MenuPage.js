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

    const fishDishes = allDishes.filter(dish => dish.category && dish.category.toLowerCase() === 'fish');
    const meatDishes = allDishes.filter(dish => dish.category && dish.category.toLowerCase() === 'meat');
    // Optional: handle dishes with other categories or no category
    const otherDishes = allDishes.filter(dish => dish.category && dish.category.toLowerCase() !== 'fish' && dish.category.toLowerCase() !== 'meat');


    if (loading) {
        return <div className="text-center py-10">Loading menu...</div>;
    }

    if (error) {
        return <div className="text-center py-10 text-red-500">{error}</div>;
    }

    return (
        <div className="container mx-auto p-4 sm:p-6 lg:p-8">
            <h1 className="text-4xl font-bold text-center text-gray-800 my-8">Our Menu</h1>

            {/* Seafood Section */}
            {fishDishes.length > 0 && (
                <section className="mb-12">
                    <h2 className="text-3xl font-semibold text-blue-700 mb-6 border-b-2 border-blue-300 pb-2">
                        Seafood Delights
                    </h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                        {fishDishes.map(dish => (
                            <DishCard key={dish.id} dish={dish} />
                        ))}
                    </div>
                </section>
            )}

            {/* Land/Meat Section */}
            {meatDishes.length > 0 && (
                <section className="mb-12">
                    <h2 className="text-3xl font-semibold text-red-700 mb-6 border-b-2 border-red-300 pb-2">
                        From the Land
                    </h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                        {meatDishes.map(dish => (
                            <DishCard key={dish.id} dish={dish} />
                        ))}
                    </div>
                </section>
            )}

            {/* Other Dishes Section (Optional) */}
            {otherDishes.length > 0 && (
                 <section className="mb-12">
                    <h2 className="text-3xl font-semibold text-gray-700 mb-6 border-b-2 border-gray-300 pb-2">
                        More Options
                    </h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                        {otherDishes.map(dish => (
                            <DishCard key={dish.id} dish={dish} />
                        ))}
                    </div>
                </section>
            )}

            {allDishes.length === 0 && !loading && (
                <div className="text-center py-10 text-gray-500">
                    <p>No dishes available at the moment. Please check back later!</p>
                </div>
            )}
        </div>
    );
};

export default MenuPage;

import React from 'react';
import { Link } from 'react-router-dom';

const DishCard = ({ dish }) => {
  // Default placeholder image if image_url is not provided
  const imageUrl = dish.image_url || 'https://via.placeholder.com/300x200.png?text=No+Image';

  return (
    <Link
      to={`/menu/dish/${dish.id}`}
      className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-shadow duration-300 ease-in-out"
    >
      <img
        src={imageUrl}
        alt={dish.name}
        className="w-full h-48 object-cover" // Fixed height for uniformity
      />
      <div className="p-4">
        <h3 className="text-xl font-semibold text-gray-800 mb-1 truncate">{dish.name}</h3>
        <p className="text-lg font-bold text-green-600 mb-2">${dish.price.toFixed(2)}</p>
        {/* Optional: Short description or ingredients preview */}
        {dish.description && <p className="text-sm text-gray-600 truncate">{dish.description}</p>}
      </div>
    </Link>
  );
};

export default DishCard;

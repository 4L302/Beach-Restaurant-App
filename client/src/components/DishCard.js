import React from 'react';
import { Link } from 'react-router-dom';

const DishCard = ({ dish }) => {
  // Default placeholder image if image_url is not provided
  const imageUrl = dish.image_url || 'https://via.placeholder.com/300x200.png?text=No+Image';

  return (
    <Link
      to={`/menu/dish/${dish.id}`}
      className="card text-decoration-none h-100 shadow-sm"
    >
      <img
        src={imageUrl}
        alt={dish.name}
        className="card-img-top"
        style={{ height: '200px', objectFit: 'cover' }} // Preserving image style
      />
      <div className="card-body d-flex flex-column">
        <h5 className="card-title mb-1 text-truncate">{dish.name}</h5>
        <p className="card-text fw-bold text-success mb-2">${dish.price.toFixed(2)}</p>
        {dish.description && <p className="card-text text-muted small text-truncate">{dish.description}</p>}
      </div>
    </Link>
  );
};

export default DishCard;

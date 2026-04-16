import React from 'react';
import './StarRating.css';

const StarRating = ({ rating, size = 'sm' }) => {
  const filled = Math.floor(rating);
  const half = rating % 1 >= 0.5;
  const empty = 5 - filled - (half ? 1 : 0);

  return (
    <span className={`star-rating star-rating--${size}`} title={`${rating} out of 5`}>
      {[...Array(filled)].map((_, i) => <span key={`f${i}`} className="star star-full">★</span>)}
      {half && <span className="star star-half">★</span>}
      {[...Array(empty)].map((_, i) => <span key={`e${i}`} className="star star-empty">☆</span>)}
      <span className="star-value">{rating}</span>
    </span>
  );
};

export default StarRating;

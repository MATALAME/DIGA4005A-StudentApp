import React from "react";
import "../Styling/StarRating.css";

const StarRating = ({ rating }) => {
  const MAX_STARS = 5;

  
  const filledStars = Math.floor(rating);
  const hasHalfStar = rating % 1 !== 0;
  const emptyStars = MAX_STARS - filledStars - (hasHalfStar ? 1 : 0);

  return (
    <div className="star-rating">
      
      {Array(filledStars)
        .fill()
        .map((_, index) => (
          <span key={`filled-${index}`} className="star filled">
            ★
          </span>
        ))}

    
      {hasHalfStar && <span className="star half">★</span>}

     
      {Array(emptyStars)
        .fill()
        .map((_, index) => (
          <span key={`empty-${index}`} className="star empty">
            ★
          </span>
        ))}
    </div>
  );
};

export default StarRating;
import React, { useState } from "react";
import { useNavigate } from 'react-router-dom';

import load1 from "../images/Load1.jpg";
import load2 from "../images/Load2.jpg";
import load3 from "../images/Load3.jpg";


function Load() {
  const [currentPage, setCurrentPage] = useState(1);
  const navigate = useNavigate();

  const handleNext = () => {  // This function runs when the "Next" button is clicked, 
    if (currentPage < 3) {
      setCurrentPage(prev => prev + 1); // If the user is on either page 1 or 2, it should go to the next page
    } else { 
      navigate('/signup');// If the user is on page 3, it navigates to the signup page
    }
  };

 
  return (
    <div className="Load-Pages">
      {currentPage === 1 && (
        <div className="Page">
          <h2>Find Jobs That Fit Your Time</h2>
          <p>Browse and accept short-term gigs based on your availability. No long-term commitments - just flexibility and freedom.</p>
          <img src={load1} alt="woman assembling cupboard" />
        </div>
      )}

      {currentPage === 2 && (
        <div className="Page">
          <h2>Turn Your Skills Into Income</h2>
          <p>Got a talent? Offer services through a business profile, get reviews, and grow your student hustle.</p>
          <img src={load2} alt="woman braiding hair" />
        </div>
      )}

      {currentPage === 3 && (
        <div className="Page">
          <h2>Got a Task? We've Got Hustlers</h2>
          <p>Post your job and let students with the right skills take care of it.</p>
          <img src={load3} alt="woman tutoring another woman" />
        </div>
      )}

      <button onClick={handleNext} className="next-button">
        {currentPage === 3 ? "Get Started" : "Next"}
      </button>
    </div>
  );
}

export default Load;

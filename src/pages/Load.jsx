import React, { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';

import AppStart from "../images/AppLogo.png"
import load1 from "../images/Load1.jpg";
import load2 from "../images/Load2.jpg";
import load3 from "../images/Load3.jpg";
import "../Styling/Load.css";

function Load() {
  const [currentPage, setCurrentPage] = useState(1);
  const navigate = useNavigate();

  useEffect(() => {
    if (currentPage === 1) {
      const timer = setTimeout(() => {
        setCurrentPage(2);
      }, 4000); //Apps usually have a loading time, so we added a 4 second loading time, just to simulate that effect
      return () => clearTimeout(timer); 
    }
  }, [currentPage]);

  const handleNext = () => {  
    if (currentPage < 4) {
      setCurrentPage(prev => prev + 1); 
    } else { 
      navigate('/signup');
    }
  };

 
  return (
    <div className="Load-Pages">

      {currentPage === 1 && (
        <div className="Start-Page">
          <h2>Student Hustle</h2>
          <img src={AppStart} alt="StudentHustleLogo" />
          <p>2025 B&M Studio</p>
          <div className="loading-dots">
            <span></span>
            <span></span>
            <span></span>
          </div>
        </div>
      )}

      {currentPage === 2 && (
        <div className="Page">
          <h2>Find Jobs That Fit Your Time</h2>
          <p>Browse and accept short-term gigs based on your availability. No long-term commitments - just flexibility and freedom.</p>
          <img src={load1} alt="woman assembling cupboard" />
        </div>
      )}

      {currentPage === 3 && (
        <div className="Page">
          <h2>Turn Your Skills Into Income</h2>
          <p>Got a talent? Offer services through a business profile, get reviews, and grow your student hustle.</p>
          <img src={load2} alt="woman braiding hair" />
        </div>
      )}

      {currentPage === 4 && (
        <div className="Page">
          <h2>Got a Task? We've Got Hustlers</h2>
          <p>Post your job and let students with the right skills take care of it.</p>
          <img src={load3} alt="woman tutoring another woman" />
        </div>
      )}

      {currentPage > 1 && (  
        <button onClick={handleNext} className="next-button">
          {currentPage === 4 ? "Get Started" : "Next"}
        </button>
    )}
    </div>
  );
}

export default Load;

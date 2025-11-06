import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../Styling/TermsPage.css"; 

const TermsPage = ({ userType }) => {
  const navigate = useNavigate();
  const [accepted, setAccepted] = useState(false);

  const handleContinue = () => {
    if (accepted) {
      navigate("/home");
    } else {
      alert("You must accept the terms to continue.");
    }
  };

  return (
    <div className="terms-container">
      <div className="terms-content">
      <h2>Terms and Conditions</h2>
        <p>
          Welcome to Student Hustle! By registering on our platform, you agree 
          to abide by our rules and terms of service. Student Hustle connects 
          individuals seeking short-term work opportunities with students and 
          small businesses offering tasks such as tutoring, cleaning, errands, 
          and other short-term jobs. 
        </p>
        <p>
          All users are expected to provide accurate information, fulfill their 
          commitments professionally, and treat others with respect. Student 
          Hustle is not responsible for disputes or issues arising between users; 
          however, we encourage all parties to communicate responsibly and 
          follow fair practices.
        </p>
        <p>
          By continuing, you confirm that you have read, understood, and accepted 
          these terms and conditions.
        </p>
      </div>

      <div className="terms-actions">
      <label>
  <input 
    type="checkbox" 
    checked={accepted} 
    onChange={(e) => setAccepted(e.target.checked)} 
  />
  <span>I accept the Terms and Conditions</span>
</label>
        <button 
          className={`continue-btn ${accepted ? "active" : "disabled"}`} 
          onClick={handleContinue} 
          disabled={!accepted}
        >
          Continue
        </button>
      </div>
    </div>
  );
};

export default TermsPage;

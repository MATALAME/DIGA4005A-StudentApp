import React from "react";
import { useNavigate } from "react-router-dom";
import "../Styling/ApplicationPage.css"
import Layout from "../Components/Layout";

import successImage from "../images/HappyCharacter.png"

const ApplicationPage = () => {
  const navigate = useNavigate();

  const handleGoHome = () => {
    navigate("/Home");
  };

  return (
    <Layout>
    <div className="success-page">
      <div className="success-card">
        <img src={successImage} alt="Success" className="success-image" />
        <h2>You've successfully applied!</h2>
        <p>
          Wait for the client to contact you — get ready to start earning!
        </p>
        <button className="home-button" onClick={handleGoHome}>
          Back to Home
        </button>
      </div>
    </div>
    </Layout>
  );
};

export default ApplicationPage;

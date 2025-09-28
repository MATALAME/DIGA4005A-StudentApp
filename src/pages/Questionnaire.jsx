import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaChevronDown } from "react-icons/fa";
import "../Styling/Questionnaire.css";

import name from "../images/Name.png";
import institution from "../images/Institution.png";
import location from "../images/Location.png";
import skills from "../images/Skills.png";
import contact from "../images/Contact.png";

// Logos of universities
import uctLogo from "../images/ucticon.png";
import stellenboschLogo from "../images/Stelliesicon.png";
import witsLogo from "../images/witsicon.png";
import ujLogo from "../images/ujicon.png";
import ukznLogo from "../images/ukznicon.png";
import upLogo from "../images/upicon.png";
import nwuLogo from "../images/nwuicon.png";
import uwcLogo from "../images/uwcicon.png"
import rhodesLogo from "../images/rhodesicon.png";
import unisaLogo from "../images/unisaicon.png";
import ufsLogo from "../images/ufsicon.png";
import tutLogo from "../images/tshwaneicon.png"
import dutLogo from "../images/duticon.png";
import nmuLogo from "../images/nmuicon.png";
import ulLogo from "../images/ulicon.png";


// Inside your component, create an array for institutions:
const institutions = [
  { name: "University of Cape Town", logo: uctLogo },
  { name: "Stellenbosch University", logo: stellenboschLogo },
  { name: "University of the Witwatersrand", logo: witsLogo },
  { name: "University of Johannesburg", logo: ujLogo },
  { name: "University of KwaZulu-Natal", logo: ukznLogo },
  { name: "University of Pretoria", logo: upLogo },
  { name: "North-West University", logo: nwuLogo },
  { name: "University of the Western Cape", logo: uwcLogo },
  { name: "Rhodes University", logo: rhodesLogo },
  { name: "University of South Africa", logo: unisaLogo },
  { name: "University of the Free State", logo: ufsLogo },
  { name: "Tshwane University of Technology", logo: tutLogo },
  { name: "Durban University of Technology", logo: dutLogo },
  { name: "Nelson Mandela University", logo: nmuLogo },
  { name: "University of Limpopo", logo: ulLogo },
];

function Questionnaire({ setProfileData }) {
  const [step, setStep] = useState(1);
  const totalSteps = 5;

  const [formData, setFormData] = useState({
    name: "",
    middleName: "",
    surname: "",
    gender: "",
    age: "",
    institution: "",
    faculty: "",
    studyType: "",
    yearOfStudy: "",
    street: "",
    suburb: "",
    city: "",
    province: "",
    zip: "",
    skills: [],
    phone: "",
    linkedin: "",
    instagram: "",
    facebook:""
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleInstitutionChange = (e) => {
    const selectedInstitution = institutions.find(inst => inst.name === e.target.value);
    setFormData({
      ...formData,
      institution: selectedInstitution.name,
      institutionLogo: selectedInstitution.logo
    });
  };
  

  const toggleSkill = (skill) => {
    setFormData((prev) => ({
      ...prev,
      skills: prev.skills.includes(skill)
        ? prev.skills.filter((s) => s !== skill)
        : [...prev.skills, skill],
    }));
  };

  const nextStep = () => setStep((prev) => prev + 1);

  const handleSubmit = async () => {
    try {
      // Get the logged in user from localStorage
      const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));

      if (!loggedInUser) {
        alert("No user is logged in. Please log in first.");
        return;
      }

      
      const response = await fetch(`http://localhost:5001/users/${loggedInUser.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ profile: formData }), 
      });

      if (response.ok) {
        const updatedUser = await response.json();

        
        localStorage.setItem("loggedInUser", JSON.stringify(updatedUser));

        alert("Profile updated successfully!");
        navigate("/profile"); 
      } else {
        alert("Failed to update profile. Please try again.");
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      alert("An error occurred. Please try again.");
    }
  };

  return (
    <div className="questionnaire-container">
    <div className="questionnaire">

    {/* Progress bar */}
    <div className="progress-bar-container">
       <div className={`progress-bar-fill step-${step}`} />
    </div>

      {step === 1 && (
        <div>
          <h2>Personal Info</h2>
          <img className="Questionnaire-icon" src={name} alt="ID-Icon" />
          <input name="name" placeholder="Name" onChange={handleChange} />
          <input name="middleName" placeholder="Middle Name" onChange={handleChange} />
          <input name="surname" placeholder="Surname" onChange={handleChange} />

          <div className="dropdown-container">
          <select name="gender" onChange={handleChange} className="custom-select">
            <option value="">Select Gender</option>
            <option>Male</option>
            <option>Female</option>
          </select>
          <FaChevronDown className="dropdown-icon" />
          </div>

          <input name="age" type="number" placeholder="Age" onChange={handleChange} />
          <button onClick={nextStep}>Continue</button>
        </div>
      )}

      {step === 2 && (
        <div>
          <h2>Insitution</h2>
          <img className = "Questionnaire-icon" src={institution} alt="ID-Icon" />
        <div className="Insititution">
          <div className="dropdown-container">
        <select
          name="institution"
          onChange={handleInstitutionChange}
          className="custom-select"
        >
          <option value="">Select Institution</option>
          {institutions.map(inst => (
            <option key={inst.name} value={inst.name}>{inst.name}</option>
          ))}
        </select>
        <FaChevronDown className="dropdown-icon" />
      </div>

          <input name="faculty" placeholder="Faculty / Department" onChange={handleChange} />
          <div>

          <div className="radio-group">
            <label><input type="radio" name="studyType" value="Full-Time" onChange={handleChange}/> Full-Time</label>
            <label><input type="radio" name="studyType" value="Part-Time" onChange={handleChange}/> Part-Time</label>
            </div>
          </div>

          <div className="dropdown-container">
          <select name="yearOfStudy" onChange={handleChange} className="custom-select" >
            <option value="">Year of Study</option>
            <option>1st</option>
            <option>2nd</option>
            <option>3rd</option>
            <option>4th</option>
          </select>
          <FaChevronDown className="dropdown-icon" />
          </div>
          
          <button onClick={nextStep}>Continue</button>
        </div>
        </div>
      )}

      {step === 3 && (
        <div>
          <h2>Location</h2>
          <img className="Questionnaire-icon" src={location} alt="Location-Icon" />
          <input name="street" placeholder="Street" onChange={handleChange} />
          <input name="suburb" placeholder="Suburb" onChange={handleChange} />
          <input name="city" placeholder="Town / City" onChange={handleChange} />
          <input name="province" placeholder="Province" onChange={handleChange} />
          <input name="zip" placeholder="ZIP Code" onChange={handleChange} />
          <button onClick={nextStep}>Continue</button>
        </div>
      )}

      {step === 4 && (
        <div>
          <h2>Select Skills</h2>
          <img className = "Questionnaire-icon" src={skills} alt="Skills-Icon" />
          {["Tutoring","Deliveries","Errands","Photography","Cleaning","Repairs"].map(skill => (
            <button
              key={skill}
              className={formData.skills.includes(skill) ? "active-skill" : ""}
              onClick={() => toggleSkill(skill)}
              type="button"
            >
              {skill}
            </button>
          ))}
          <button onClick={nextStep}>Continue</button>
        </div>
      )}

      {step === 5 && (
        <div>
          <h2>Contact</h2>
          <img className="Questionnaire-icon" src={contact} alt="Contact-Icon" />
          <input name="phone" placeholder="Phone Number (Optional)" onChange={handleChange} />
          <input name="linkedin" placeholder="LinkedIn (Optional)" onChange={handleChange} />
          <input name="instagram" placeholder="Instagram (Optional)" onChange={handleChange} />
          <input name="facebook" placeholder="Facebook (Optional)" onChange={handleChange} />
          <button onClick={handleSubmit}>Submit</button>
        </div>
      )}
    </div>
    </div>
  );
}

export default Questionnaire;

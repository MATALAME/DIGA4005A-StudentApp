import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../Styling/Questionnaire.css";

import name from "../images/Name.png";
import institution from "../images/Institution.png";
import location from "../images/Location.png";
import skills from "../images/Skills.png";
import contact from "../images/Contact.png";

function Questionnaire({ setProfileData }) {
  const [step, setStep] = useState(1);
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
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
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

      
      const response = await fetch(`http://localhost:5000/users/${loggedInUser.id}`, {
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
    <div className="questionnaire">
      {step === 1 && (
        <div>
          <h2>Personal Info</h2>
          <img className="Questionnaire-icon" src={name} alt="ID-Icon" />
          <input name="name" placeholder="Name" onChange={handleChange} />
          <input name="middleName" placeholder="Middle Name" onChange={handleChange} />
          <input name="surname" placeholder="Surname" onChange={handleChange} />
          <select name="gender" onChange={handleChange}>
            <option value="">Select Gender</option>
            <option>Male</option>
            <option>Female</option>
          </select>
          <input name="age" type="number" placeholder="Age" onChange={handleChange} />
          <button onClick={nextStep}>Continue</button>
        </div>
      )}

      {step === 2 && (
        <div>
          <h2>Institution</h2>
          <img className="Questionnaire-icon" src={institution} alt="Institution-Icon" />
          <input name="institution" placeholder="Institution" onChange={handleChange} />
          <input name="faculty" placeholder="Faculty / Department" onChange={handleChange} />
          <div>
            <label>
              <input type="radio" name="studyType" value="Full-Time" onChange={handleChange} /> Full-Time
            </label>
            <label>
              <input type="radio" name="studyType" value="Part-Time" onChange={handleChange} /> Part-Time
            </label>
          </div>
          <select name="yearOfStudy" onChange={handleChange}>
            <option value="">Year of Study</option>
            <option>1st</option>
            <option>2nd</option>
            <option>3rd</option>
            <option>4th</option>
          </select>
          <button onClick={nextStep}>Continue</button>
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
          <img className="Questionnaire-icon" src={skills} alt="Skills-Icon" />
          {["Tutoring", "Deliveries", "Errands", "Photography", "Cleaning", "Repairs"].map((skill) => (
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
          <button onClick={handleSubmit}>Submit</button>
        </div>
      )}
    </div>
  );
}

export default Questionnaire;

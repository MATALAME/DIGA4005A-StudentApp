import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { FaChevronDown } from "react-icons/fa";
import "../Styling/Questionnaire.css";

// Images
import nameIcon from "../images/Name.png";
import institutionIcon from "../images/Institution.png";
import locationIcon from "../images/Location.png";
import skillsIcon from "../images/Skills.png";
import contactIcon from "../images/Contact.png";

// University logos
import uctLogo from "../images/ucticon.png";
import stellenboschLogo from "../images/Stelliesicon.png";
import witsLogo from "../images/witsicon.png";
import ujLogo from "../images/ujicon.png";
import ukznLogo from "../images/ukznicon.png";
import upLogo from "../images/upicon.png";
import nwuLogo from "../images/nwuicon.png";
import uwcLogo from "../images/uwcicon.png";
import rhodesLogo from "../images/rhodesicon.png";
import unisaLogo from "../images/unisaicon.png";
import ufsLogo from "../images/ufsicon.png";
import tutLogo from "../images/tshwaneicon.png";
import dutLogo from "../images/duticon.png";
import nmuLogo from "../images/nmuicon.png";
import ulLogo from "../images/ulicon.png";

// Institution array
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

//  WRAPPER COMPONENT 
export default function QuestionnaireWrapper() {
  const location = useLocation();
  const accountType = location.state?.accountType || "student"; // default to student

  return (
    <>
      {accountType === "student" ? <StudentQuestionnaire /> : <ClientQuestionnaire />}
    </>
  );
}

//  STUDENT QUESTIONNAIRE 
function StudentQuestionnaire() {
  const [step, setStep] = useState(1);
  const totalSteps = 5;
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    middleName: "",
    surname: "",
    gender: "",
    age: "",
    institution: "",
    institutionLogo: "",
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
    facebook: ""
  });

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleInstitutionChange = (e) => {
    const selected = institutions.find(inst => inst.name === e.target.value);
    setFormData({ ...formData, institution: selected.name, institutionLogo: selected.logo });
  };

  const toggleSkill = (skill) => {
    setFormData((prev) => ({
      ...prev,
      skills: prev.skills.includes(skill)
        ? prev.skills.filter(s => s !== skill)
        : [...prev.skills, skill],
    }));
  };

  const nextStep = () => setStep(prev => prev + 1);

  const handleSubmit = async () => {
    try {
      const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));
      if (!loggedInUser) return alert("No user logged in.");

      const response = await fetch(`http://localhost:5001/users/${loggedInUser.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ profile: formData })
      });

      if (response.ok) {
        const updatedUser = await response.json();
        localStorage.setItem("loggedInUser", JSON.stringify(updatedUser));
        alert("Profile updated successfully!");
        navigate("/profile");
      } else alert("Failed to update profile.");
    } catch (error) {
      console.error(error);
      alert("Error updating profile.");
    }
  };

  return (
    <div className="questionnaire-container">
      <div className="questionnaire">
        {/* Progress Bar */}
        <div className="progress-bar-container">
          <div className={`progress-bar-fill step-${step}`} />
        </div>

        {step === 1 && (
          <div>
            <h2>Personal Info</h2>
            <img className="Questionnaire-icon" src={nameIcon} alt="ID-Icon" />
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
            <h2>Institution</h2>
            <img className="Questionnaire-icon" src={institutionIcon} alt="Institution" />
            <div className="dropdown-container">
              <select name="institution" onChange={handleInstitutionChange} className="custom-select">
                <option value="">Select Institution</option>
                {institutions.map(inst => <option key={inst.name} value={inst.name}>{inst.name}</option>)}
              </select>
              <FaChevronDown className="dropdown-icon" />
            </div>
            <input name="faculty" placeholder="Faculty / Department" onChange={handleChange} />
            <div className="radio-group">
              <label><input type="radio" name="studyType" value="Full-Time" onChange={handleChange} /> Full-Time</label>
              <label><input type="radio" name="studyType" value="Part-Time" onChange={handleChange} /> Part-Time</label>
            </div>
            <div className="dropdown-container">
              <select name="yearOfStudy" onChange={handleChange} className="custom-select">
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
        )}

        {step === 3 && (
          <div>
            <h2>Location</h2>
            <img className="Questionnaire-icon" src={locationIcon} alt="Location" />
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
            <img className="Questionnaire-icon" src={skillsIcon} alt="Skills" />
            {["Tutoring","Deliveries","Errands","Photography","Cleaning","Repairs"].map(skill => (
              <button
                key={skill}
                className={formData.skills.includes(skill) ? "active-skill" : ""}
                type="button"
                onClick={() => toggleSkill(skill)}
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
            <img className="Questionnaire-icon" src={contactIcon} alt="Contact" />
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

// CLIENT QUESTIONNAIRE
function ClientQuestionnaire() {
  const [step, setStep] = useState(1);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    middleName: "",
    surname: "",
    gender: "",
    age: "",
    street: "",
    suburb: "",
    city: "",
    province: "",
    zip: "",
    email: "",
    phone: "",
    skills: [],
  });

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const toggleSkill = (skill) => {
    setFormData((prev) => ({
      ...prev,
      skills: prev.skills.includes(skill)
        ? prev.skills.filter(s => s !== skill)
        : [...prev.skills, skill],
    }));
  };

  const nextStep = () => setStep(prev => prev + 1);

  const handleSubmit = async () => {
    try {
      const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));
      if (!loggedInUser) return alert("No user logged in.");

      const response = await fetch(`http://localhost:5001/users/${loggedInUser.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ profile: formData })
      });

      if (response.ok) {
        const updatedUser = await response.json();
        localStorage.setItem("loggedInUser", JSON.stringify(updatedUser));
        alert("Profile updated successfully!");
        navigate("/profile");
      } else alert("Failed to update profile.");
    } catch (error) {
      console.error(error);
      alert("Error updating profile.");
    }
  };

  return (
    <div className="questionnaire-container">
      <div className="questionnaire">
        <div className="progress-bar-container">
          <div className={`progress-bar-fill step-${step}`} />
        </div>

        {step === 1 && (
          <div>
            <h2>Personal Info</h2>
            <img className="Questionnaire-icon" src={nameIcon} alt="ID-Icon" />
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
            <h2>Contact Info</h2>
            <img className="Questionnaire-icon" src={institutionIcon} alt="Institution" />
            <input name="email" placeholder="Email" onChange={handleChange} />
            <input name="phone" placeholder="Phone Number" onChange={handleChange} />
            <button onClick={nextStep}>Continue</button>
          </div>
        )}

        {step === 3 && (
          <div>
            <h2>Location</h2>
            <img className="Questionnaire-icon" src={locationIcon} alt="Location" />
            <input name="street" placeholder="Street" onChange={handleChange} />
            <input name="suburb" placeholder="Suburb" onChange={handleChange} />
            <input name="city" placeholder="City" onChange={handleChange} />
            <input name="province" placeholder="Province" onChange={handleChange} />
            <input name="zip" placeholder="ZIP Code" onChange={handleChange} />
            <button onClick={nextStep}>Continue</button>
          </div>
        )}

        {step === 4 && (
          <div>
            <h2>Job Preferences</h2>
            <img className="Questionnaire-icon" src={skillsIcon} alt="Skills" />
            {["Deliveries","Errands","Cleaning","Repairs","Tutoring"].map(skill => (
              <button
                key={skill}
                className={formData.skills.includes(skill) ? "active-skill" : ""}
                type="button"
                onClick={() => toggleSkill(skill)}
              >
                {skill}
              </button>
            ))}
            <button onClick={handleSubmit}>Submit</button>
          </div>
        )}

      </div>
    </div>
  );
}

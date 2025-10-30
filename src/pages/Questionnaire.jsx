import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { FaChevronDown } from "react-icons/fa";
import "../Styling/Questionnaire.css";
import { toast } from "react-hot-toast";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../firebase";

// Images
import nameIcon from "../images/Name.png";
import institutionIcon from "../images/Institution.png";
import locationIcon from "../images/Location.png";
import skillsIcon from "../images/Skills.png";
import contactIcon from "../images/Contact.png";

// University logos (same as before)
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

// Institutions array
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

export default function QuestionnaireWrapper() {
  const location = useLocation();
  const accountType = location.state?.accountType || "student";
  return accountType === "student" ? <StudentQuestionnaire /> : <ClientQuestionnaire />;
}

//Student Questionnaire
function StudentQuestionnaire() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const totalSteps = 5;

  const [formData, setFormData] = useState({
    name: "", middleName: "", surname: "", gender: "", age: "",
    institution: "", institutionLogo: "", faculty: "", studyType: "", yearOfStudy: "",
    street: "", suburb: "", city: "", province: "", zip: "",
    skills: [], phone: "", linkedin: "", instagram: "", facebook: ""
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" });
  };

  const handleInstitutionChange = (e) => {
    const selected = institutions.find(inst => inst.name === e.target.value);
    setFormData({ ...formData, institution: selected.name, institutionLogo: selected.logo });
    setErrors({ ...errors, institution: "" });
  };

  const toggleSkill = (skill) => {
    setFormData(prev => ({
      ...prev,
      skills: prev.skills.includes(skill)
        ? prev.skills.filter(s => s !== skill)
        : [...prev.skills, skill],
    }));
    setErrors({ ...errors, skills: "" });
  };

  const validateStep = () => {
    const stepErrors = {};
    if (step === 1) {
      if (!formData.name) stepErrors.name = "Name is required.";
      if (!formData.surname) stepErrors.surname = "Surname is required.";
      if (!formData.gender) stepErrors.gender = "Gender is required.";
      if (!formData.age) stepErrors.age = "Age is required.";
    } else if (step === 2) {
      if (!formData.institution) stepErrors.institution = "Institution is required.";
      if (!formData.faculty) stepErrors.faculty = "Faculty is required.";
      if (!formData.studyType) stepErrors.studyType = "Study type is required.";
      if (!formData.yearOfStudy) stepErrors.yearOfStudy = "Year of study is required.";
    } else if (step === 3) {
      if (!formData.street) stepErrors.street = "Street is required.";
      if (!formData.suburb) stepErrors.suburb = "Suburb is required.";
      if (!formData.city) stepErrors.city = "City is required.";
      if (!formData.province) stepErrors.province = "Province is required.";
      if (!formData.zip) stepErrors.zip = "ZIP Code is required.";
    } else if (step === 4) {
      if (formData.skills.length === 0) stepErrors.skills = "At least one skill is required.";
    }
    setErrors(stepErrors);
    return Object.keys(stepErrors).length === 0;
  };

  const nextStep = () => {
    if (validateStep()) setStep(prev => Math.min(prev + 1, totalSteps));
  };

  const handleSubmit = async () => {
    if (!validateStep()) return;

    try {
      const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));
      if (!loggedInUser) return toast.error("No user logged in.");

      
      const updatedUser = { ...loggedInUser, profile: formData };
      localStorage.setItem("loggedInUser", JSON.stringify(updatedUser));

      toast.success("Profile updated successfully!");
      navigate("/home");


      const userRef = doc(db, "users", loggedInUser.id);
      setDoc(
        userRef,
        {
          profile: formData,
          accountType: loggedInUser.accountType || "student",
          updatedAt: serverTimestamp(),
        },
        { merge: true }
      ).catch(err => console.error("Error updating profile:", err));

    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error("Error updating profile.");
    }
  };

  return renderQuestionnaire({ step, nextStep, handleSubmit, handleChange, handleInstitutionChange, toggleSkill, errors, formData });
}

//Client Questionnire
function ClientQuestionnaire() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);

  const [formData, setFormData] = useState({
    name: "", middleName: "", surname: "", gender: "", age: "",
    email: "", phone: "", street: "", suburb: "", city: "", province: "", zip: "",
    skills: []
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" });
  };

  const toggleSkill = (skill) => {
    setFormData(prev => ({
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
      if (!loggedInUser) return toast.error("No user logged in.");

      const updatedUser = { ...loggedInUser, profile: formData };
      localStorage.setItem("loggedInUser", JSON.stringify(updatedUser));
      toast.success("Profile updated successfully!");
      navigate("/profile");

     
      const userRef = doc(db, "users", loggedInUser.id);
      setDoc(
        userRef,
        {
          profile: formData,
          accountType: loggedInUser.accountType || "client",
          updatedAt: serverTimestamp(),
        },
        { merge: true }
      ).catch(err => console.error("Error updating profile:", err));
    } catch (error) {
      console.error(error);
      toast.error("Error updating profile.");
    }
  };

  return renderQuestionnaire({ step, nextStep, handleSubmit, handleChange, toggleSkill, errors, formData, isClient: true });
}

function renderQuestionnaire({ step, nextStep, handleSubmit, handleChange, handleInstitutionChange, toggleSkill, errors, formData, isClient = false }) {
  return (
    <div className="questionnaire-container">
      <div className="questionnaire">
        <div className="progress-bar-container">
          <div className={`progress-bar-fill step-${step}`} />
        </div>

        {/* Step 1 */}
        {step === 1 && (
          <div>
            <h2>Personal Info</h2>
            <img src={nameIcon} alt="Name Icon" className="Questionnaire-icon" />
            <input name="name" placeholder="Name" onChange={handleChange} />
            <input name="middleName" placeholder="Middle Name" onChange={handleChange} />
            <input name="surname" placeholder="Surname" onChange={handleChange} />
            <div className="dropdown-container">
              <select name="gender" onChange={handleChange}>
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

        {/* Step 2 */}
        {step === 2 && (
          <div>
            <h2>{isClient ? "Contact Info" : "Institution"}</h2>
            <img src={isClient ? contactIcon : institutionIcon} alt="Icon" className="Questionnaire-icon" />
            {!isClient ? (
              <>
                <select name="institution" onChange={handleInstitutionChange}>
                  <option value="">Select Institution</option>
                  {institutions.map(inst => <option key={inst.name} value={inst.name}>{inst.name}</option>)}
                </select>
                <input name="faculty" placeholder="Faculty / Department" onChange={handleChange} />
                <div>
                  <label><input type="radio" name="studyType" value="Full-Time" onChange={handleChange} /> Full-Time</label>
                  <label><input type="radio" name="studyType" value="Part-Time" onChange={handleChange} /> Part-Time</label>
                </div>
                <select name="yearOfStudy" onChange={handleChange}>
                  <option value="">Year of Study</option>
                  <option>1st</option>
                  <option>2nd</option>
                  <option>3rd</option>
                  <option>4th</option>
                </select>
              </>
            ) : (
              <>
                <input name="email" placeholder="Email" onChange={handleChange} />
                <input name="phone" placeholder="Phone" onChange={handleChange} />
              </>
            )}
            <button onClick={nextStep}>Continue</button>
          </div>
        )}

        {/* Step 3 */}
        {step === 3 && (
          <div>
            <h2>Location</h2>
            <img src={locationIcon} alt="Location Icon" className="Questionnaire-icon" />
            <input name="street" placeholder="Street" onChange={handleChange} />
            <input name="suburb" placeholder="Suburb" onChange={handleChange} />
            <input name="city" placeholder="City" onChange={handleChange} />
            <input name="province" placeholder="Province" onChange={handleChange} />
            <input name="zip" placeholder="ZIP Code" onChange={handleChange} />
            <button onClick={nextStep}>Continue</button>
          </div>
        )}

        {/* Step 4 */}
        {step === 4 && (
          <div>
            <h2>{isClient ? "Job Preferences" : "Skills"}</h2>
            <img src={skillsIcon} alt="Skills Icon" className="Questionnaire-icon" />
            {["Deliveries","Errands","Cleaning","Repairs","Tutoring","Photography"].map(skill => (
              <button
                key={skill}
                type="button"
                className={formData.skills.includes(skill) ? "active-skill" : ""}
                onClick={() => toggleSkill(skill)}
              >
                {skill}
              </button>
            ))}
            <button onClick={handleSubmit}>Submit</button>
          </div>
        )}

        {/* Step 5 (students only) */}
        {!isClient && step === 5 && (
          <div>
            <h2>Contact</h2>
            <img src={contactIcon} alt="Contact Icon" className="Questionnaire-icon" />
            <input name="phone" placeholder="Phone (Optional)" onChange={handleChange} />
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

import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useJobContext } from "../Context/JobContext";
import Layout from "../Components/Layout";
import "../Styling/ProfilePage.css";
import StarRating from "../Components/StarRating";
import { db } from "../firebase";
import { doc, setDoc, getDoc, collection, addDoc, serverTimestamp } from "firebase/firestore";

function ProfilePage() {
  const [profileData, setProfileData] = useState(null);
  const [accountType, setAccountType] = useState("");
  const [showJobForm, setShowJobForm] = useState(false);
  const [jobDetails, setJobDetails] = useState({
    jobTitle: "",
    description: "",
    payAmount: "",
    currency: "ZAR",
    suburb: "",
    city: "",
    province: "",
    priority: "Low priority",
    category: "",
  });
  const [errors, setErrors] = useState({});
  const { addJob } = useJobContext();
  const navigate = useNavigate();

  
  useEffect(() => {
    const fetchProfile = async () => {
      const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));
      if (!loggedInUser) return;

      const userRef = doc(db, "users", loggedInUser.id);
      const userSnap = await getDoc(userRef);

      if (userSnap.exists()) {
        const data = userSnap.data();
        const profile = data.profile || {};
        setProfileData({
          name: loggedInUser.name || profile.name || "Unnamed",
          email: loggedInUser.email || profile.email || "Unknown",
          accountType: loggedInUser.accountType,
          skills: profile.skills || [],
          institution: profile.institution || "",
          institutionLogo: profile.institutionLogo || "",
          faculty: profile.faculty || "",
          studyType: profile.studyType || "",
          yearOfStudy: profile.yearOfStudy || "",
          street: profile.street || "",
          suburb: profile.suburb || "",
          city: profile.city || "",
          province: profile.province || "",
          zip: profile.zip || "",
          reviewScore: profile.reviewScore || 0,
          ...profile,
        });
        setAccountType(loggedInUser.accountType);
      }
    };

    fetchProfile();
  }, []);

  
  const handleInputChange = (e) => {
    setJobDetails({ ...jobDetails, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" });
  };

 
  const handleCreateJob = async () => {
    const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));
    if (!loggedInUser) return alert("You must be logged in to create a job.");
    if (accountType !== "client") return alert("Only clients can post jobs.");

    const requiredFields = [
      "jobTitle",
      "description",
      "payAmount",
      "suburb",
      "city",
      "province",
      "category",
    ];

    const newErrors = {};
    requiredFields.forEach((field) => {
      if (!jobDetails[field]) newErrors[field] = "This field is required.";
    });

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      const jobsRef = collection(db, "jobs");
      const newJob = {
        ...jobDetails,
        username: loggedInUser.name,
        profilePhoto: "default-avatar.png",
        timestamp: serverTimestamp(),
        reviewScore: 0,
        userId: loggedInUser.id,
      };

      await addDoc(jobsRef, newJob);

      alert("Job listing created successfully!");
      setShowJobForm(false);
      navigate("/home");
    } catch (error) {
      console.error("Error creating job:", error);
      alert("An error occurred. Please try again.");
    }
  };

  if (!profileData) return <p className="no-data">Loading profile...</p>;

  return (
    <Layout>
      <div className="profile-page">
        <div className="profile-card">
          {/* Header */}
          <div className="profile-header">
            <div className="profile-avatar">
              {profileData.name.charAt(0).toUpperCase()}
            </div>
            <div className="profile-info">
              <h2>{profileData.name}'s Profile</h2>
              <div className="star-rating">
                {profileData.reviewScore > 0 ? (
                  <StarRating rating={profileData.reviewScore} />
                ) : (
                  <p>No reviews yet</p>
                )}
              </div>
            </div>
          </div>

          {/* Student Info */}
          {accountType === "student" && (
            <div className="profile-section">
              <h3>Student Info</h3>
              <div className="institution-info">
                {profileData.institutionLogo && (
                  <img
                    src={profileData.institutionLogo}
                    alt={profileData.institution}
                    className="institution-logo"
                  />
                )}
                <span className="institution-name">{profileData.institution}</span>
              </div>
              <p>Faculty: {profileData.faculty}</p>
              <p>Study Type: {profileData.studyType}</p>
              <p>Year of Study: {profileData.yearOfStudy}</p>
              <p>
                Location: {profileData.suburb}, {profileData.city}, {profileData.province}
              </p>
              <div className="skills">
                {profileData.skills?.length > 0 ? (
                  profileData.skills.map((skill, idx) => (
                    <span key={idx} className="skill-tag">
                      {skill}
                    </span>
                  ))
                ) : (
                  <p className="no-skills">No skills listed</p>
                )}
              </div>
            </div>
          )}

          {/* Client Info */}
          {accountType === "client" && (
            <div className="profile-section">
              <h3>Client Info</h3>
              <p>Email: {profileData.email}</p>
              <div className="skills">
                {profileData.skills?.length > 0 ? (
                  profileData.skills.map((skill, idx) => (
                    <span key={idx} className="skill-tag">
                      {skill}
                    </span>
                  ))
                ) : (
                  <p className="no-skills">No job preferences listed</p>
                )}
              </div>
              <button
                className="create-job-button"
                onClick={() => setShowJobForm(true)}
              >
                Create Job Listing
              </button>
            </div>
          )}

          {/* Job Form (Client Only) */}
          {showJobForm && accountType === "client" && (
            <div className="job-form">
              <h3>Create Job Listing</h3>
              <input
                type="text"
                name="jobTitle"
                placeholder="Job Title"
                value={jobDetails.jobTitle}
                onChange={handleInputChange}
              />
              {errors.jobTitle && <p className="error-text">{errors.jobTitle}</p>}

              <textarea
                name="description"
                placeholder="Job Description"
                value={jobDetails.description}
                onChange={handleInputChange}
              />
              {errors.description && <p className="error-text">{errors.description}</p>}

              <input
                type="number"
                name="payAmount"
                placeholder="Pay Amount"
                value={jobDetails.payAmount}
                onChange={handleInputChange}
              />
              {errors.payAmount && <p className="error-text">{errors.payAmount}</p>}

              <input
                type="text"
                name="suburb"
                placeholder="Suburb"
                value={jobDetails.suburb}
                onChange={handleInputChange}
              />
              {errors.suburb && <p className="error-text">{errors.suburb}</p>}

              <input
                type="text"
                name="city"
                placeholder="City"
                value={jobDetails.city}
                onChange={handleInputChange}
              />
              {errors.city && <p className="error-text">{errors.city}</p>}

              <input
                type="text"
                name="province"
                placeholder="Province"
                value={jobDetails.province}
                onChange={handleInputChange}
              />
              {errors.province && <p className="error-text">{errors.province}</p>}

              <select
                name="priority"
                value={jobDetails.priority}
                onChange={handleInputChange}
              >
                <option value="Low priority">Low priority</option>
                <option value="Urgent">Urgent</option>
              </select>

              <select
                name="category"
                value={jobDetails.category}
                onChange={handleInputChange}
              >
                <option value="">Select Category</option>
                <option value="Errands">Errands</option>
                <option value="Tutoring">Tutoring</option>
                <option value="Deliveries">Deliveries</option>
                <option value="Other Jobs">Other</option>
              </select>
              {errors.category && <p className="error-text">{errors.category}</p>}

              <button onClick={handleCreateJob}>Submit</button>
              <button onClick={() => setShowJobForm(false)}>Cancel</button>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}

export default ProfilePage;

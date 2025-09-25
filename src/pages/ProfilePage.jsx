import React, { useEffect, useState } from "react";
import "../Styling/ProfilePage.css";
import Layout from "../Components/Layout";

import whatsapp from "../images/whatsapp.png";
import linkedin from "../images/linkedin.png";
import instagram from "../images/instagram.png";
import facebook from "../images/facebook.png";

function ProfilePage() {
  const [profileData, setProfileData] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        
        const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));

        if (!loggedInUser) {
          alert("No user is logged in. Please log in first.");
          return;
        }

      
        const response = await fetch(`http://localhost:5000/users/${loggedInUser.id}`);
        if (!response.ok) {
          throw new Error("Failed to fetch user profile.");
        }

        const userData = await response.json();
        setProfileData(userData.profile); // Set the profile data
      } catch (error) {
        console.error("Error fetching profile:", error);
        alert("An error occurred while fetching the profile. Please try again.");
      }
    };

    fetchProfile();
  }, []);

  if (!profileData) return <p className="no-data">No profile data yet</p>;

  // Safe initials
  const initials = `${profileData.name?.[0] ?? ""}${profileData.surname?.[0] ?? ""}`.toUpperCase();

  return (
    <Layout>
      <div className="profile-page">
        <div className="profile-card">
          {/* Header */}
          <div className="profile-header">
            <div className="profile-avatar">{initials}</div>
            <div className="profile-info">
              <h2>{`${profileData.name ?? ""} ${profileData.surname ?? ""}`}</h2>
              <p>{profileData.gender ?? ""}{profileData.age ? `, ${profileData.age} years` : ""}</p>
            </div>
          </div>

          {/* Institution */}
          <div className="profile-section">
            <h3>Institution</h3>
            <div className="institution-info">
              {profileData.institutionLogo && (
                <img
                  src={profileData.institutionLogo}
                  alt={profileData.institution}
                  className="institution-logo"
                />
              )}
              <span className="institution-name">{profileData.institution ?? "-"}</span>
            </div>
            <p>{profileData.faculty ?? "-"}</p>
            <p>
              {profileData.studyType ?? "-"}
              {profileData.yearOfStudy ? ` - ${profileData.yearOfStudy}` : ""}
            </p>
          </div>

          {/* Skills */}
          <div className="profile-section">
            <h3>Skills</h3>
            <div className="skills">
              {profileData.skills?.length > 0 ? (
                profileData.skills.map(skill => (
                  <span key={skill} className="skill-tag">{skill}</span>
                ))
              ) : (
                <p className="no-skills">No skills selected</p>
              )}
            </div>
          </div>

          {/* Contact */}
          <div className="profile-section">
            <h3>Contact</h3>
            {profileData.phone && (
              <p>
                <img src={whatsapp} alt="Whatsapp" className="contact-icon" />
                {profileData.phone}
              </p>
            )}
            {profileData.linkedin && (
              <p>
                <img src={linkedin} alt="LinkedIn" className="contact-icon" />
                {profileData.linkedin}
              </p>
            )}
            {profileData.instagram && (
              <p>
                <img src={instagram} alt="Instagram" className="contact-icon" />
                {profileData.instagram}
              </p>
            )}
            {profileData.facebook && (
              <p>
                <img src={facebook} alt="Facebook" className="contact-icon" />
                {profileData.facebook}
              </p>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}

export default ProfilePage;

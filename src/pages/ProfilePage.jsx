import React, { useEffect, useState } from "react";
import Layout from "../Components/Layout";
import "../Styling/ProfilePage.css";
import StarRating from "../Components/StarRating";

function ProfilePage() {
  const [profileData, setProfileData] = useState(null);
  const [accountType, setAccountType] = useState("");

  useEffect(() => {
    const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));
    if (loggedInUser) {
      setProfileData(loggedInUser.profile);
      setAccountType(loggedInUser.accountType);
    }
  }, []);

  if (!profileData) return <p className="no-data">Loading profile...</p>;

  return (
    <Layout>
      <div className="profile-page">
        <div className="profile-card">
          {/* Header: Avatar + Name */}
          <div className="profile-header">
            <div className="profile-avatar">
              {profileData.name.charAt(0).toUpperCase()}
            </div>
            <div className="profile-info">
              <h2>{profileData.name}'s Profile</h2>
              <div className="star-rating">
                {profileData.reviewScore ? (
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
              <p>Institution: {profileData.institution}</p>
              <p>Faculty: {profileData.faculty}</p>
              <p>Year: {profileData.yearOfStudy}</p>
            </div>
          )}

          {/* Client Info */}
          {accountType === "client" && (
            <div className="profile-section">
              <h3>Client Info</h3>
              <p>Email: {profileData.email}</p>
              <div className="skills">
                {profileData.skills && profileData.skills.length > 0 ? (
                  profileData.skills.map((skill, index) => (
                    <span key={index} className="skill-tag">
                      {skill}
                    </span>
                  ))
                ) : (
                  <p className="no-skills">No skills listed</p>
                )}
              </div>
            </div>
          )}

          {/* Contact Info */}
          <div className="profile-section">
            <h3>Contact</h3>
            <p>Phone: {profileData.phone}</p>
            <p>LinkedIn: {profileData.linkedin}</p>
            <p>Instagram: {profileData.instagram}</p>
            <p>Facebook: {profileData.facebook}</p>
          </div>
        </div>
      </div>
    </Layout>
  );
}

export default ProfilePage;

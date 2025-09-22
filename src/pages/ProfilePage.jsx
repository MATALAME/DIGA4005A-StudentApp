import React from "react";
import "../Styling/ProfilePage.css";
import Layout from "../Components/Layout";

function ProfilePage() {
  const storedData = localStorage.getItem("profileData");
  const profileData = storedData ? JSON.parse(storedData) : null;

  if (!profileData) return <p className="no-data">No profile data yet</p>;

  return (
    <Layout>
    <div className="profile-page">
      <div className="profile-card">
        <div className="profile-header">
          <div className="profile-avatar">
            {profileData.name[0].toUpperCase()}{profileData.surname[0].toUpperCase()}
          </div>
          <div className="profile-info">
            <h2>{profileData.name} {profileData.surname}</h2>
            <p>{profileData.gender}, {profileData.age} years</p>
          </div>
        </div>

        <div className="profile-section">
          <h3>Institution</h3>
          <p>{profileData.institution}</p>
          <p>{profileData.faculty}</p>
          <p>{profileData.studyType} - {profileData.yearOfStudy}</p>
        </div>

        <div className="profile-section">
          <h3>Skills</h3>
          <div className="skills">
            {profileData.skills.length > 0 ? (
              profileData.skills.map(skill => (
                <span key={skill} className="skill-tag">{skill}</span>
              ))
            ) : (
              <p className="no-skills">No skills selected</p>
            )}
          </div>
        </div>

        <div className="profile-section">
          <h3>Contact</h3>
          {profileData.phone && <p>📞 {profileData.phone}</p>}
          {profileData.linkedin && <p>🔗 {profileData.linkedin}</p>}
        </div>
      </div>
    </div>
    </Layout>
  );
}

export default ProfilePage;

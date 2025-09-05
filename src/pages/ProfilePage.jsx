import React from "react";
import Questionnaire from "./Questionnaire";

function ProfilePage() {
    const storedData = localStorage.getItem("profileData");
    const profileData = storedData ? JSON.parse(storedData) : null;
    
    if (!profileData) return <p>No profile data yet</p>;

  return (
    <div className="profile-page">
      <h2>{profileData.name} {profileData.surname}</h2>
      <p>{profileData.gender}, {profileData.age} years</p>
      
      <h3>Institution</h3>
      <p>{profileData.institution}</p>
      <p>{profileData.faculty}</p>
      <p>{profileData.studyType} - {profileData.yearOfStudy}</p>

      <h3>Skills</h3>
      <div className="skills">
        {profileData.skills.map(skill => (
          <span key={skill} className="skill-tag">{skill}</span>
        ))}
      </div>

      <h3>Contact</h3>
      <p>{profileData.phone}</p>
      <p>{profileData.linkedin}</p>
    </div>
  );
}

export default ProfilePage;

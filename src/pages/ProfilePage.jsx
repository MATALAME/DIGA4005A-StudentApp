import React, { useEffect, useState } from "react";
import Layout from "../Components/Layout";
import "../Styling/ProfilePage.css";

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

  if (!profileData) return <p>Loading profile...</p>;

  return (
    <Layout>
      <div className="profile-page">
        <h2>{profileData.name}'s Profile</h2>

        {accountType === "student" && (
          <div>
            <p>Institution: {profileData.institution}</p>
            <p>Faculty: {profileData.faculty}</p>
            <p>Year: {profileData.yearOfStudy}</p>
          </div>
        )}

        {accountType === "client" && (
          <div>
            <p>Email: {profileData.email}</p>
            <p>Skills: {profileData.skills.join(", ")}</p>
          </div>
        )}

        <p>Phone: {profileData.phone}</p>
        <p>Social Links:</p>
        <p>LinkedIn: {profileData.linkedin}</p>
        <p>Instagram: {profileData.instagram}</p>
        <p>Facebook: {profileData.facebook}</p>
      </div>
    </Layout>
  );
}

export default ProfilePage;

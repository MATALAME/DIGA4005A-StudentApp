import React, { useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase";
import { setupChatBetweenUsers } from "../firebaseUtils";
import { useParams, useNavigate } from "react-router-dom";
import { MapPin } from "lucide-react";
import { useJobContext } from "../Context/JobContext";
import Layout from "../Components/Layout";
import "../Styling/JobDetails.css";

import LocationIcon from "../images/LocationIcon.png"

const JobDetails = () => {
  const { jobId } = useParams();
  const { jobs } = useJobContext();
  const navigate = useNavigate();
  const [isApplied, setIsApplied] = useState(false);

  const job = jobs.find((j) => j.id === jobId);
  if (!job) return <p>Job not found.</p>;

  const handleApplyClick = () => {
    navigate("/application"); 
  };

  const handleContactClick = async () => {
    const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));
    if (!loggedInUser) {
      alert("You must be logged in to contact this user.");
      return;
    }
  
    const userRef = doc(db, "users", job.userId);
    const snap = await getDoc(userRef);
    if (!snap.exists()) {
      alert("Cannot contact this user: they have never logged in.");
      return;
    }
  
    const otherUser = { id: snap.id, ...snap.data() };
  
    try {
      await setupChatBetweenUsers(loggedInUser, otherUser);
      navigate(`/chat/${otherUser.id}`, { state: { otherUser } });
    } catch (error) {
      console.error("Error opening chat:", error);
      alert("Failed to start chat. Check permissions or try again.");
    }
  };
  
  

  return (
    <Layout>
      <div className="job-details-page">
        <div className="job-details-wrapper">
          <button className="details-back-button" onClick={() => navigate("/Home")}>
            Back
          </button>

          <div className="job-details-card">
            <img
              src={job.profileImage || `https://picsum.photos/seed/${job.id}/150`}
              alt="Profile"
              className="job-profile-image"
            />
            <h2 className="job-title">{job.jobTitle}</h2>
            <p className="job-poster">Posted by {job.username}</p>

            <div className="job-info">
              <strong>Job Info:</strong>
              <ul>
                {job.description.split("\n").map((line, idx) => (
                  <p key={idx}>{line}</p>
                ))}
              </ul>
            </div>

            <div className="job-location">
              {/* <MapPin size={18} color="black" /> */}
              <img src= {LocationIcon} className="location-icon"/>
              {job.suburb}, {job.city}
            </div>

            <p className="job-pay2">R{job.payAmount}.00</p>

            <div className="job-button-row">
              <button
                className={isApplied ? "cancel-button" : "accept-button"}
                onClick={handleApplyClick}
              >
                {isApplied ? "Cancel Application" : "Apply"}
              </button>
            </div>

            {job.userId && (
              <button className="contact-button" onClick={handleContactClick}>
                Contact
              </button>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default JobDetails;

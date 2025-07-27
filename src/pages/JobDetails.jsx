import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, MapPin } from "lucide-react"; 
import { useJobContext } from "../Context/JobContext";
import "../Styling/JobDetails.css";

const JobDetails = () => {
  const { jobId } = useParams();
  const { jobs } = useJobContext();
  const navigate = useNavigate();

  const job = jobs.find((j) => j.id.toString() === jobId);
  const [isApplied, setIsApplied] = useState(false);

  if (!job) return <p>Job not found.</p>;

  const handleApplyClick = () => {
    if (isApplied) {
      setIsApplied(false);
    } else {
      alert("Application successful");
      setIsApplied(true);
    }
  };

  const handleContactClick = () => {
    const existingChats = JSON.parse(localStorage.getItem("chats")) || [];
    const chatExists = existingChats.some((chat) => chat.username === job.username);

    if (!chatExists) {
      const newChat = { username: job.username, lastMessage: "Start chatting!" };
      localStorage.setItem("chats", JSON.stringify([...existingChats, newChat]));
    }

    navigate(`/chat/${job.username}`);
  };

  return (
    <div className="job-details-wrapper">
      {/* HEADER */}
      <header className="job-details-header">
        <button className="back-button" onClick={() => navigate(-1)}>
          <ArrowLeft size={24} color="white" />
        </button>
        <h1 className="job-details-title">JOB DETAILS</h1>
        <div className="profile-picture">
          <img src={job.profileImage || "https://picsum.photos/150"} alt="Profile" />
          
        </div>
      </header>

      {/* JOB DETAILS */}
      <div className="job-details-card">
        <img
          src={job.profileImage || "https://picsum.photos/150"}
          alt="Profile"
          className="job-profile-image"
        />

        <h2 className="job-title">{job.jobTitle}</h2>
        <p className="job-poster">Posted by {job.username}</p>

        <div className="job-info">
          <strong>Job Info:</strong>
          <ul>
            {job.description.split("\n").map((line, index) => (
              <li key={index}>{line}</li>
            ))}
          </ul>
        </div>

        <div className="job-location">
          <MapPin size={18} color="black" />
          {job.suburb}, {job.city}
        </div>

        <p className="job-pay">R{job.payAmount}.00</p>

        <div className="job-button-row">
          <button
            className={isApplied ? "cancel-button" : "accept-button"}
            onClick={handleApplyClick}
          >
            {isApplied ? "Cancel Application" : "Apply"}
          </button>
        </div>

        <button className="contact-button" onClick={handleContactClick}>
          Contact
        </button>
      </div>
    </div>
  );
};

export default JobDetails;

import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { MapPin } from "lucide-react";
import { useJobContext } from "../Context/JobContext";
import Layout from "../Components/Layout";
import "../Styling/JobDetails.css";

const JobDetails = () => {
  const { jobId } = useParams();
  const { jobs } = useJobContext();
  const navigate = useNavigate();
  const [isApplied, setIsApplied] = useState(false);

  const job = jobs.find((j) => j.id === jobId);
  if (!job) return <p>Job not found.</p>;

  const handleApplyClick = () => {
    if (!isApplied) alert("Application successful");
    setIsApplied((prev) => !prev);
  };

  const handleContactClick = () => {
    if (!job.userId) {
      alert("Cannot contact: poster is not a real user.");
      return;
    }

    
    const otherUser = {
      id: job.userId,
      name: job.username,
      email: job.email || `${job.username.replace(/\s/g, "")}@example.com`, 
    };

    navigate(`/chat/${job.userId}`, { state: { otherUser } });
  };

  return (
    <Layout>
      <div className="job-details-wrapper">
        <div className="job-details-card">
          <img
            src={job.profilePhoto || "https://picsum.photos/150"}
            alt="Profile"
            className="job-profile-image"
          />
          <h2 className="job-title">{job.jobTitle}</h2>
          <p className="job-poster">Posted by {job.username}</p>

          <div className="job-info">
            <strong>Job Info:</strong>
            <ul>
              {job.description.split("\n").map((line, idx) => (
                <li key={idx}>{line}</li>
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

          {job.userId && (
            <button className="contact-button" onClick={handleContactClick}>
              Contact
            </button>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default JobDetails;

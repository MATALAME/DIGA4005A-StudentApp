import React from "react";
import { useNavigate } from "react-router-dom";
import { MapPin } from "lucide-react"; 
import "../Styling/JobComponent.css";

const JobComponent = ({ job }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/job/${job.id}`);
  };

  return (
    <div className="job-card" onClick={handleClick}>
      <div className="job-header">
        <img
          src={job.profileImage || "https://picsum.photos/150"}
          alt="avatar"
          className="job-avatar"
        />
        <div className="job-title-section">
          <h3 className="job-title">{job.jobTitle}</h3>
          <p className="job-poster">Posted by {job.username}</p>
        </div>
      </div>

      <div className="job-body">
        <div className="job-description">
          <p>{job.description}</p>
        </div>

        <p className="job-pay">R{job.payAmount}.00</p>
      </div>

      <div className="job-location">
        <MapPin size={16} color="black" className="location-icon" /> 
        {job.suburb}, {job.city}
      </div>

      <div className="job-footer">
        {job.priority.toLowerCase() === "urgent" ? (
          <span className="priority-badge urgent">URGENT</span>
        ) : (
          <span className="priority-badge low">LOW PRIORITY</span>
        )}
        <span className="job-time">{job.timePosted}</span>
      </div>
    </div>
  );
};

export default JobComponent;

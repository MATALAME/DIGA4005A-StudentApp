import React from "react";
import { useNavigate } from "react-router-dom";
import "../Styling/JobComponent.css"; 

const JobComponent = ({ job }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/job/${job.id}`);
  };

  return (
    <div className="job-card" onClick={handleClick}>
      <h3>{job.jobTitle}</h3>
      <p>Posted by: {job.username}</p>
      <p>{job.description}</p>
      <p>
        Location: {job.suburb}, {job.city}, {job.province}
      </p>
      <p>
        Pay: R{job.payAmount} {job.currency}
      </p>
      <p>Posted: {job.timePosted}</p>
      <p>Priority: {job.priority}</p>
    </div>
  );
};

export default JobComponent;

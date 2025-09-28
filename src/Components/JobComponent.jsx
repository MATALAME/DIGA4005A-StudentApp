import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { MapPin } from "lucide-react";
import StarRating from "./StarRating";
import "../Styling/JobComponent.css";

const JobComponent = ({ job }) => {
  const navigate = useNavigate();
  const [reviewScore, setReviewScore] = useState(null);

  useEffect(() => {
    const fetchUserReviewScore = async () => {
      try {
        const response = await fetch(`http://localhost:5001/users`);
        const users = await response.json();

        console.log("Fetched users:", users);
        console.log("Job username:", job.username); 

       
        const user = users.find((user) => user.name === job.username);

        console.log("Matched user:", user); 

     
        if (user && user.profile?.reviewScore) {
          setReviewScore(user.profile.reviewScore);
        } else {
          console.log("No review score found for user:", job.username); 
        }
      } catch (error) {
        console.error("Error fetching user review score:", error);
      }
    };

    fetchUserReviewScore();
  }, [job.username]);

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
          {reviewScore !== null ? (
  <div className="review-score">
    {/*<span>Review Score:</span>*/}
    <StarRating rating={reviewScore} />
  </div>
) : (
  <p>No reviews yet</p>
)}
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

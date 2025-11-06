import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
// import { MapPin } from "lucide-react";
import StarRating from "./StarRating";
import "../Styling/JobComponent.css";
import { db } from "../firebase";
import { doc, getDoc } from "firebase/firestore";

import LocationIcon from "../images/LocationIcon.png";

const JobComponent = ({ job }) => {
  const navigate = useNavigate();
  const [reviewScore, setReviewScore] = useState(null);
  const [userLoaded, setUserLoaded] = useState(false);

  useEffect(() => {
    const fetchUserReviewScore = async () => {
      if (!job?.userId) {
        console.warn("Job has no userId:", job);
        setUserLoaded(true);
        return;
      }

      try {
        const userRef = doc(db, "users", job.userId);
        const userSnap = await getDoc(userRef);

        if (userSnap.exists()) {
          const userData = userSnap.data();
          const score = userData.reviewScore ?? null; 
          setReviewScore(score);
        } else {
          console.warn(`No user found with ID: ${job.userId}`);
        }
      } catch (error) {
        console.error("Error fetching user review score:", error);
      } finally {
        setUserLoaded(true);
      }
    };

    fetchUserReviewScore();
  }, [job.userId]);

  const handleClick = () => navigate(`/job/${job.id}`);

  return (
    <div className="job-card" onClick={handleClick}>
      <div className="job-header">
        <img
          src={job.profileImage || `https://picsum.photos/seed/${job.id}/150`} //the profile photos were the same and seed/${job.id} ensures each job gets a unique profile photo.
          alt="avatar"
          className="job-avatar"
        />
        <div className="job-title-section">
          <h3 className="job-title">{job.jobTitle || "Untitled Job"}</h3>
          <p className="job-poster">
            Posted by {job.username || "Unknown"}
          </p>
          <div className="review-score">
            {userLoaded ? (
              reviewScore !== null ? (
                <StarRating rating={reviewScore} />
              ) : (
                <p>No reviews yet</p>
              )
            ) : (
              <p>Loading reviews...</p>
            )}
          </div>
        </div>
      </div>

      <div className="job-body">
        <div className="job-description">
          <p>{job.description || "No description provided."}</p>
        </div>
        <p className="job-pay">R{job.payAmount ?? 0}.00</p>
      </div>

      <div className="job-location">
        {/* <MapPin size={16} color="black" className="location-icon" /> */}
        <img src= {LocationIcon} className="location-icon"/>
        {job.suburb || "Unknown Suburb"}, {job.city || "Unknown City"}
      </div>

      <div className="job-footer">
        <span
          className={`priority-badge ${
            job.priority?.toLowerCase() === "urgent" ? "urgent" : "low"
          }`}
        >
          {job.priority ? job.priority.toUpperCase() : "LOW PRIORITY"}
        </span>
        <span className="job-time">{job.timePosted || "Unknown time"}</span>
      </div>
    </div>
  );
};

export default JobComponent;

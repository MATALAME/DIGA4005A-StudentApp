import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { MapPin, Bookmark, BookmarkCheck } from "lucide-react";
import StarRating from "./StarRating";
import "../Styling/JobComponent.css";
import { db, auth } from "../firebase";
import { doc, getDoc, setDoc, deleteDoc } from "firebase/firestore";

const JobComponent = ({ job }) => {
  const navigate = useNavigate();
  const [reviewScore, setReviewScore] = useState(null);
  const [userLoaded, setUserLoaded] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  const loggedInUser = auth.currentUser;

  const timeAgo = (timestamp) => {
    if (!timestamp) return "Unknown time";
    const now = new Date();
    const seconds = Math.floor((now - timestamp.toDate()) / 1000);

    if (seconds < 60) return `${seconds} seconds ago`;
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes} minutes ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours} hours ago`;
    const days = Math.floor(hours / 24);
    return `${days} day${days > 1 ? "s" : ""} ago`;
  };

 
  useEffect(() => {
    const fetchUserReviewScore = async () => {
      if (!job?.userId) {
        setUserLoaded(true);
        return;
      }
      try {
        const userRef = doc(db, "users", job.userId);
        const userSnap = await getDoc(userRef);
        if (userSnap.exists()) {
          setReviewScore(userSnap.data().reviewScore ?? null);
        }
      } catch (error) {
        console.error("Error fetching user review score:", error);
      } finally {
        setUserLoaded(true);
      }
    };
    fetchUserReviewScore();
  }, [job.userId]);


  useEffect(() => {
    if (!loggedInUser) return;
    const checkSaved = async () => {
      try {
        const savedRef = doc(db, "users", loggedInUser.uid, "savedJobs", job.id);
        const snap = await getDoc(savedRef);
        setIsSaved(snap.exists());
      } catch (error) {
        console.error("Error checking saved job:", error);
      }
    };
    checkSaved();
  }, [loggedInUser, job.id]);


  const toggleSaveJob = async (e) => {
    e.stopPropagation();
    if (!loggedInUser) {
      alert("You must be logged in to save jobs.");
      return;
    }

    const savedRef = doc(db, "users", loggedInUser.uid, "savedJobs", job.id);
    try {
      if (isSaved) {
        await deleteDoc(savedRef);
        setIsSaved(false);
      } else {
        await setDoc(savedRef, { jobId: job.id, timestamp: new Date() });
        setIsSaved(true);
      }
    } catch (error) {
      console.error("Error saving/removing job:", error);
    }
  };

  const handleClick = () => navigate(`/job/${job.id}`);

  return (
    <div className="job-card" onClick={handleClick}>
      <div className="bookmark-icon" onClick={toggleSaveJob}>
        {isSaved ? <BookmarkCheck size={24} color="gold" /> : <Bookmark size={24} />}
      </div>

      <div className="job-header">
        <img
          src={job.profileImage || `https://picsum.photos/seed/${job.id}/150`}
          alt="avatar"
          className="job-avatar"
        />
        <div className="job-title-section">
          <h3 className="job-title">{job.jobTitle || "Untitled Job"}</h3>
          <p className="job-poster">Posted by {job.username || "Unknown"}</p>
          <div className="review-score">
            {userLoaded ? (
              reviewScore !== null ? <StarRating rating={reviewScore} /> : <p>No reviews yet</p>
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
        <MapPin size={16} color="black" className="location-icon" />
        {job.suburb || "Unknown Suburb"}, {job.city || "Unknown City"}
      </div>

      <div className="job-footer">
        <span className={`priority-badge ${job.priority?.toLowerCase() === "urgent" ? "urgent" : "low"}`}>
          {job.priority ? job.priority.toUpperCase() : "LOW PRIORITY"}
        </span>
        <span className="job-time">{timeAgo(job.timestamp)}</span>
      </div>
    </div>
  );
};

export default JobComponent;

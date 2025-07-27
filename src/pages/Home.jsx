import React, { useState } from "react";
import JobComponent from "../Components/JobComponent";
import { useJobContext } from "../Context/JobContext";
import "../Styling/Home.css"; 

export default function Home() {
  const { jobs } = useJobContext();

  const [selectedCategory, setSelectedCategory] = useState("All");

  const categories = [
    { name: "All", icon: "🌍" },
    { name: "Tutoring", icon: "📚" },
    { name: "Deliveries", icon: "🚚" },
    { name: "Errands", icon: "🛒" },
    { name: "Other Jobs", icon: "💼" },
  ];

  const filteredJobs =
    selectedCategory === "All"
      ? jobs
      : jobs.filter((job) => job.category === selectedCategory);

  const jobsToShow = filteredJobs.slice(0, 10);

  return (
    <div className="home-wrapper">
      {/* HEADER */}
      <header className="home-header">
        <div className="hamburger">&#9776;</div>
        <h1 className="home-title">FIND JOBS</h1>
        <div className="profile-picture">
          <img src="https://picsum.photos/150" alt="Profile" />
        </div>
      </header>

      {/* CONTENT */}
      <div className="home-content">
        {/* Filter Buttons */}
        <div className="filter-buttons">
          {categories.map((category) => (
            <button
              key={category.name}
              className={`filter-button ${
                selectedCategory === category.name ? "active" : ""
              }`}
              onClick={() => setSelectedCategory(category.name)}
            >
              <span className="filter-icon">{category.icon}</span>
              <span className="filter-text">{category.name}</span>
            </button>
          ))}
        </div>

        {/* Job Conttainer */}
        <div className="job-container">
          {jobsToShow.length === 0 ? (
            <p>Loading jobs...</p>
          ) : (
            jobsToShow.map((job) => <JobComponent key={job.id} job={job} />)
          )}
        </div>
      </div>
    </div>
  );
}

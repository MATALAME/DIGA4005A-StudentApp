import React, { useState } from "react";
import JobComponent from "../Components/JobComponent";
import { useJobContext } from "../Context/JobContext";
import "../Styling/Home.css"; 
import Layout from "../Components/Layout";

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
    <Layout>
      <div className="home-wrapper">
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

          {/* Job Container */}
          <div className="job-container">
            {jobsToShow.length === 0 ? (
              <p>Loading jobs...</p>
            ) : (
              jobsToShow.map((job) => <JobComponent key={job.id} job={job} />)
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}

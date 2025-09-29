import React, { useEffect, useState } from "react";
import JobComponent from "../Components/JobComponent";
import Layout from "../Components/Layout";
import "../Styling/Home.css";
import { useJobContext } from "../Context/JobContext";

export default function Home() {
  const { jobs } = useJobContext(); 
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [filteredJobs, setFilteredJobs] = useState([]);

  const categories = [
    { name: "All", icon: "🌍" },
    { name: "Tutoring", icon: "📚" },
    { name: "Deliveries", icon: "🚚" },
    { name: "Errands", icon: "🛒" },
    { name: "Other Jobs", icon: "💼" },
  ];

  
  useEffect(() => {
    const sortedJobs = [...jobs].sort((a, b) => {
      const tA = a.timestamp?.seconds || 0; 
      const tB = b.timestamp?.seconds || 0;
      return tB - tA; 
    });

    const filtered =
      selectedCategory === "All"
        ? sortedJobs
        : sortedJobs.filter((job) => job.category === selectedCategory);

    setFilteredJobs(filtered);
  }, [jobs, selectedCategory]);

  return (
    <Layout>
      <div className="home-wrapper">
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

          <div className="home-title">
            <h2>FIND JOBS</h2>
          </div>

          {/* Job Container */}
          <div className="job-container">
            {filteredJobs.length === 0 ? (
              <p>No jobs available.</p>
            ) : (
              filteredJobs.map((job) => (
                <JobComponent key={job.id} job={job} />
              ))
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}

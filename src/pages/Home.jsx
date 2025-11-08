import React, { useEffect, useState } from "react";
import JobComponent from "../Components/JobComponent";
import Layout from "../Components/Layout";
import "../Styling/Home.css";
import { useJobContext } from "../Context/JobContext";

import Headline from "../images/HeaderGraphic.png";
import WideHeadline from "../images/WideHeaderGraphic.png";

export default function Home() {
  const { jobs } = useJobContext(); 
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [visibleCount, setVisibleCount] = useState(10);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  const categories = [
    { name: "All", icon: "🌍" },
    { name: "Tutoring", icon: "📕" },
    { name: "Deliveries", icon: "🚚" },
    { name: "Errands", icon: "🛒" },
    { name: "Other Jobs", icon: "💼" },
  ];

  const headlineImage = windowWidth < 768 ? Headline : WideHeadline;

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const filteredJobs = selectedCategory === "All"
    ? [...jobs].sort((a,b) => (b.timestamp?.seconds || 0) - (a.timestamp?.seconds || 0))
    : [...jobs].filter(job => job.category === selectedCategory)
          .sort((a,b) => (b.timestamp?.seconds || 0) - (a.timestamp?.seconds || 0));

  const visibleJobs = filteredJobs.slice(0, visibleCount);

  const handleLoadMore = () => {
    setVisibleCount(prev => prev + 10);
  };

  return (
    <Layout>
      <div className="headline-container">
        <img src={headlineImage} alt="Headline-graphic" className="headline-img" />
      </div>

      <div className="home-wrapper">
        <div className="home-content">
          <div className="filter-buttons">
            {categories.map(category => (
              <button
                key={category.name}
                className={`filter-button ${selectedCategory === category.name ? "active" : ""}`}
                onClick={() => {
                  setSelectedCategory(category.name);
                  setVisibleCount(10); 
                }}
              >
                <span className="filter-icon">{category.icon}</span>
                <span className="filter-text">{category.name}</span>
              </button>
            ))}
          </div>

          <div className="home-title">
            <h2>FIND JOBS 🔍</h2>
          </div>

          <div className="job-container">
            {visibleJobs.length === 0 ? (
              <p>No jobs available.</p>
            ) : (
              visibleJobs.map(job => <JobComponent key={job.id} job={job} />)
            )}
          </div>

          {visibleCount < filteredJobs.length && (
            <div style={{ display: "flex", justifyContent: "center", margin: "20px 0" }}>
              <button className="load-more-button" onClick={handleLoadMore}>
                Load More
              </button>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}

import React from "react";

const Explore = () => {
  const randomData = Array.from({ length: 12 }, (_, index) => ({
    id: index + 1,
    title: `Item ${index + 1}`,
    description: `Description for item ${index + 1}`,
  }));

  return (
    <div className="explore-container">
      <h2 className="explore-title">Explore</h2>
      <div className="explore-grid">
        {randomData.map((item) => (
          <div key={item.id} className="explore-item">
            <h3>{item.title}</h3>
            <p>{item.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Explore;
import React from "react";
import JobComponent from "../Components/JobComponent";
import { useJobContext } from "../Context/JobContext";

export default function Home() {
  const { jobs } = useJobContext();

  const jobsToShow = jobs.slice(0, 10);

  return (
    <div className="App">
      <header className="App-header">
        <h1>Welcome to Student Hustle</h1>
        <p>Your platform for student jobs and opportunities.</p>
        <div className="job-container">
          {jobsToShow.length === 0 ? (
            <p>Loading jobs...</p>
          ) : (
            jobsToShow.map((job) => <JobComponent key={job.id} job={job} />)
          )}
        </div>
      </header>
    </div>
  );
}

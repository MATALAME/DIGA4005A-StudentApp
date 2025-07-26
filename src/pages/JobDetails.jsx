import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useJobContext } from "../Context/JobContext";

const JobDetails = () => {
  const { jobId } = useParams();
  const { jobs } = useJobContext();
  const navigate = useNavigate();

  const job = jobs.find((j) => j.id.toString() === jobId);

  if (!job) {
    return <p>Job not found.</p>;
  }

  return (
    <div>
      <button onClick={() => navigate(-1)}>← Back</button>
      <h2>{job.jobTitle}</h2>
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

export default JobDetails;

import React, { createContext, useContext, useEffect, useState } from 'react';

const JobContext = createContext();

export const JobProvider = ({ children }) => {
  const [jobs, setJobs] = useState([]);

  useEffect(() => {
   
    fetch('http://localhost:5000/jobs')
      .then((res) => {
        if (!res.ok) {
          throw new Error('Failed to fetch jobs');
        }
        return res.json();
      })
      .then((data) => {
        setJobs(data);
      })
      .catch((err) => console.error('Error fetching jobs:', err));
  }, []);

  return (
    <JobContext.Provider value={{ jobs }}>
      {children}
    </JobContext.Provider>
  );
};

export const useJobContext = () => useContext(JobContext);

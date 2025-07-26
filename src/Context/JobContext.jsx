import React, { createContext, useContext, useEffect, useState } from 'react';

const JobContext = createContext();

export const JobProvider = ({ children }) => {
  const [jobs, setJobs] = useState([]);

  useEffect(() => {
   
    fetch('/data/JobData.json')
      .then(res => res.json())
      .then(data => {
    
        setJobs(data);
      })
      .catch(err => console.error('Failed to fetch jobs:', err));
  }, []);

  return (
    <JobContext.Provider value={{ jobs }}>
      {children}
    </JobContext.Provider>
  );
};


export const useJobContext = () => useContext(JobContext);

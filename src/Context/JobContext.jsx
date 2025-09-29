import React, { createContext, useContext, useEffect, useState } from "react";
import { addJobToFirestore } from "../firebaseUtils";
import { db } from "../firebase";
import { collection, onSnapshot, query, orderBy } from "firebase/firestore";

const JobContext = createContext();

export const JobProvider = ({ children }) => {
  const [realJobs, setRealJobs] = useState([]);
  const [mockJobs, setMockJobs] = useState([]);

  // Loading real jobs
  useEffect(() => {
    const col = collection(db, "jobs");
    const q = query(col, orderBy("timestamp", "desc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const jobsData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
        isMock: false,
      }));
      console.log("Real jobs fetched:", jobsData); 
      setRealJobs(jobsData);
    });
    return () => unsubscribe();
  }, []);

  // Loading mock jobs
  useEffect(() => {
    const col = collection(db, "mockJobs");
    const q = query(col, orderBy("timestamp", "desc"));
    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        if (snapshot.empty) {
          console.warn("No mock jobs found in Firestore.");
        } else {
          const jobsData = snapshot.docs.map((doc) => {
            const data = doc.data();
            return {
              id: doc.id,
              ...data,
              timestamp: data.timestamp || { seconds: 0, nanoseconds: 0 }, 
              isMock: true,
            };
          });
          console.log("Mock jobs fetched:", jobsData); 
          setMockJobs(jobsData);
        }
      },
      (error) => {
        console.error("Error fetching mock jobs:", error);
      }
    );
    return () => unsubscribe();
  }, []);

  
  const jobs = [...realJobs, ...mockJobs].sort((a, b) => {
    const tA = a.timestamp?.seconds || 0;
    const tB = b.timestamp?.seconds || 0;
    return tB - tA;
  });

  // Add new real job
  const addJob = async (newJob) => {
    try {
      const jobWithId = {
        ...newJob,
        id: newJob.id || Date.now().toString(),
        isMock: false,
      };
      await addJobToFirestore(jobWithId);
      setRealJobs((prev) => [...prev, jobWithId]);
    } catch (error) {
      console.error("Error adding job:", error);
    }
  };

  return <JobContext.Provider value={{ jobs, addJob }}>{children}</JobContext.Provider>;
};

export const useJobContext = () => useContext(JobContext);

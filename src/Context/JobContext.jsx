import React, { createContext, useContext, useEffect, useState } from "react";
import { addJobToFirestore } from "../firebaseUtils";
import { db } from "../firebase";
import { collection, onSnapshot, query, orderBy, Timestamp } from "firebase/firestore";

const JobContext = createContext();

export const JobProvider = ({ children }) => {
  const [realJobs, setRealJobs] = useState([]);
  const [mockJobs, setMockJobs] = useState([]);


  useEffect(() => {
    const col = collection(db, "jobs");
    const q = query(col, orderBy("timestamp", "desc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const jobsData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
        isMock: false,
        timestamp: doc.data().timestamp || Timestamp.now(),
      }));
      setRealJobs(jobsData);
    });
    return () => unsubscribe();
  }, []);

  // Load mock jobs
  useEffect(() => {
    const col = collection(db, "mockJobs");
    const q = query(col, orderBy("timestamp", "desc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const jobsData = snapshot.docs.map((doc) => {
        const data = doc.data();
        return {
          id: doc.id,
          ...data,
          timestamp: data.timestamp || Timestamp.now(),
          isMock: true,
        };
      });
      setMockJobs(jobsData);
    }, (error) => {
      console.error("Error fetching mock jobs:", error);
    });
    return () => unsubscribe();
  }, []);

  const jobs = [...realJobs, ...mockJobs].sort((a, b) => {
    const tA = a.timestamp?.seconds || 0;
    const tB = b.timestamp?.seconds || 0;
    return tB - tA;
  });

  const addJob = async (newJob) => {
    try {
      const jobWithId = {
        ...newJob,
        id: newJob.id || Date.now().toString(),
        isMock: false,
      };
  
      await addJobToFirestore(jobWithId);
    } catch (error) {
      console.error("Error adding job:", error);
    }
  };
  

  return <JobContext.Provider value={{ jobs, addJob }}>{children}</JobContext.Provider>;
};

export const useJobContext = () => useContext(JobContext);

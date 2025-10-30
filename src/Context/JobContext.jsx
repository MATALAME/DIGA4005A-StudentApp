import React, { createContext, useContext, useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../firebase";
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

  
  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
      // added this fix for job loading problems
      startJobListeners();
    });
  
    return () => unsubscribeAuth();
  }, []);
  
  const startJobListeners = () => {
    const jobsCol = collection(db, "jobs");
    const jobsQuery = query(jobsCol, orderBy("timestamp", "desc"));
    const unsubJobs = onSnapshot(jobsQuery, (snapshot) => {
      const jobsData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
        isMock: false,
      }));
      setRealJobs(jobsData);
    });
  
    const mockCol = collection(db, "mockJobs");
    const mockQuery = query(mockCol, orderBy("timestamp", "desc"));
    const unsubMock = onSnapshot(mockQuery, (snapshot) => {
      const mockData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
        isMock: true,
      }));
      setMockJobs(mockData);
    }, (error) => {
      console.error("Error fetching mock jobs:", error);
    });
  
    
    return () => {
      unsubJobs();
      unsubMock();
    };
  };

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

import React, { useEffect, useState } from "react";
import { db } from "../firebase";
import { collection, getDocs, doc, getDoc } from "firebase/firestore";
import JobComponent from "../Components/JobComponent";
import Layout from "../Components/Layout";
import { auth } from "../firebase";
import LoadingOverlay from "../Components/LoadingOverlay";

const SavedJobs = () => {
  const [savedJobs, setSavedJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  const loggedInUser = auth.currentUser;

  useEffect(() => {
    const fetchSavedJobs = async () => {
      if (!loggedInUser) return;

      try {
        const savedRef = collection(db, "users", loggedInUser.uid, "savedJobs");
        const savedSnap = await getDocs(savedRef);
        const jobsArray = [];

        for (const savedDoc of savedSnap.docs) {
          const jobRef = doc(db, "jobs", savedDoc.data().jobId);
          const jobSnap = await getDoc(jobRef);
          if (jobSnap.exists()) {
            jobsArray.push({ id: jobSnap.id, ...jobSnap.data() });
          }
        }

        setSavedJobs(jobsArray);
      } catch (error) {
        console.error("Error fetching saved jobs:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSavedJobs();
  }, [loggedInUser]);

  if (!loggedInUser) return <p>Please log in to see your saved jobs.</p>;
  if (loading) return <LoadingOverlay text="Loading saved jobs..." />;

  return (
    <Layout>
      <h2>Saved Jobs</h2>
      {savedJobs.length === 0 ? (
        <p>You have no saved jobs.</p>
      ) : (
        savedJobs.map((job) => <JobComponent key={job.id} job={job} />)
      )}
    </Layout>
  );
};

export default SavedJobs;

// This was used to add timestamps to mock jobs in firestore (for proper syntax)
import { useEffect } from "react";
import { db } from "../firebase";
import { collection, getDocs, setDoc, doc, serverTimestamp } from "firebase/firestore";

export default function UploadMockJobTimestamps() {
  useEffect(() => {
    const addTimestamps = async () => {
      try {
        const mockJobsCol = collection(db, "mockJobs");
        const snapshot = await getDocs(mockJobsCol);

        for (const docSnap of snapshot.docs) {
          const data = docSnap.data();
          if (!data.timestamp) {
            await setDoc(
              doc(db, "mockJobs", docSnap.id),
              { timestamp: serverTimestamp() },
              { merge: true }
            );
            console.log(`Timestamp added to mock job ID: ${docSnap.id}`);
          }
        }

        console.log("All mock jobs now have timestamps!");
      } catch (error) {
        console.error("Error adding timestamps to mock jobs:", error);
      }
    };

    addTimestamps();
  }, []);

  return <p>Updating mock jobs with timestamps… check console for progress.</p>;
}

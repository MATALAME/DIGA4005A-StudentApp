import { doc, setDoc, collection, serverTimestamp } from "firebase/firestore";
import { db } from "./firebase";

/**
 * Add a new user to Firestore (for chat and online status)
 * @param {object} user - { name, email, accountType, id }
 */
export const addUserToFirestore = async (user) => {
  if (!user?.id) return;

  const userRef = doc(db, "users", user.id); 

  try {
    await setDoc(
      userRef,
      {
        name: user.name || "Unnamed",
        email: user.email || "Unknown",
        accountType: user.accountType || "student",
        online: true,
        lastActive: serverTimestamp(),
      },
      { merge: true }
    );
    console.log("User added to Firestore:", user.id);

    // Start heartbeat for online status (the hearbeat is just periodic checks, like a "tick") 
    startUserHeartbeat(user.id);
  } catch (error) {
    console.error("Error adding user to Firestore:", error);
  }
};

/**
 * Update online status for a user 
 * @param {string} userId
 * @param {boolean} status
 */
export const setUserOnlineStatus = async (userId, status = true) => {
  if (!userId) return;

  const userRef = doc(db, "users", userId);

  try {
    await setDoc(
      userRef,
      { online: status, lastActive: serverTimestamp() },
      { merge: true }
    );
  } catch (error) {
    console.error("Error setting user online status:", error);
  }
};

/**
 * Heartbeat system updates lastActive every 10 seconds
 * @param {string} userId
 */
export const startUserHeartbeat = (userId) => {
  if (!userId) return;
  const userRef = doc(db, "users", userId);

  const interval = setInterval(async () => {
    try {
   
      await setDoc(userRef, { lastActive: serverTimestamp(), online: true }, { merge: true });
    } catch (error) {
      console.error("Error updating heartbeat:", error);
    }
  }, 10000);

  // Changes user status to offline when they close tab
  const handleBeforeUnload = async () => {
    clearInterval(interval);
    try {
      await setDoc(userRef, { online: false, lastActive: serverTimestamp() }, { merge: true });
    } catch (error) {
      console.error("Error setting offline on unload:", error);
    }
  };

  window.addEventListener("beforeunload", handleBeforeUnload);

  return () => {
    clearInterval(interval);
    window.removeEventListener("beforeunload", handleBeforeUnload);
  };
};

/**
 * Sends a notification when a message is sent
 * @param {object} sender - { id, name, email }
 * @param {object} receiver - { id, name, email }
 * @param {string} messageText
 */
export const sendNotification = async (sender, receiver, messageText) => {
  if (!sender?.id || !receiver?.id) return;

  try {
    const notificationsRef = collection(db, "notifications", receiver.id, "messages");
    const notificationDoc = doc(notificationsRef);

    await setDoc(notificationDoc, {
      senderId: sender.id,
      senderName: sender.name,
      message: messageText,
      read: false,
      timestamp: serverTimestamp(),
    });

    console.log(`Notification sent to ${receiver.id} from ${sender.id}`);
  } catch (error) {
    console.error("Error sending notification:", error);
  }
};

/**
 * Adding a new job to Firestore that way it can be done automatically one signup and we dont need manually add it
 * @param {object} job 
 */
export const addJobToFirestore = async (job) => {
  if (!job?.id) return;

  const jobRef = doc(db, "jobs", job.id); 

  try {
    await setDoc(
      jobRef,
      {
        ...job,
        timestamp: serverTimestamp(), // Adds timestamp when the job was created, this is NEEDED for users/jobs to be disaplayed correctly
      },
      { merge: true }
    );
    console.log("Job added to Firestore:", job.id);
  } catch (error) {
    console.error("Error adding job to Firestore:", error);
  }
};

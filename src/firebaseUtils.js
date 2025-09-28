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

    // Start heartbeat for online status (periodic checks)
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
 * Heartbeat system: updates lastActive every 10 seconds
 * @param {string} userId
 */
export const startUserHeartbeat = (userId) => {
  if (!userId) return;
  const userRef = doc(db, "users", userId);

  const interval = setInterval(async () => {
    try {
      await setDoc(userRef, { lastActive: serverTimestamp() }, { merge: true });
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
 * Sends a notification automatically when a message is sent
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

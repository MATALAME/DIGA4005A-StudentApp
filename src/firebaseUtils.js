import { doc, setDoc, collection, serverTimestamp, getDoc } from "firebase/firestore";
import { db } from "./firebase";

/**
 * 
 * @param {object} user - 
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

    startUserHeartbeat(user.id);
  } catch (error) {
    console.error("Error adding user to Firestore:", error);
  }
};

/**
 * 
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
 * 
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
 * 
 * @param {object} sender 
 * @param {object} receiver 
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
 * 
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
        timestamp: serverTimestamp(), 
      },
      { merge: true }
    );
    console.log("Job added to Firestore with timestamp:", job.id);
  } catch (error) {
    console.error("Error adding job to Firestore:", error);
  }
};

/**
 *
 * @param {Object} loggedInUser 
 * @param {Object} otherUser 
 * @returns {Promise<string>} 
 */
export const setupChatBetweenUsers = async (user1, user2) => {
  if (!user1?.email || !user2?.email) throw new Error("Invalid users");

  const chatId = [user1.email, user2.email].sort().join("_");
  const chatDocRef = doc(db, "chats", chatId);
  const chatSnap = await getDoc(chatDocRef);

  if (!chatSnap.exists()) {
    await setDoc(chatDocRef, {
      participants: [user1.email, user2.email],
      createdAt: serverTimestamp(),
      lastMessage: "",
      lastUpdated: serverTimestamp(),
    });
  }

  return chatId;
};

import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "../Components/Layout";
import { collection, onSnapshot, doc, updateDoc, getDoc } from "firebase/firestore";
import { db } from "../firebase";
import "../Styling/Notifications.css";

export default function Notifications() {
  const [notifications, setNotifications] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));
    if (!loggedInUser) return;

    const notificationsRef = collection(db, "notifications", loggedInUser.id, "messages");

    const unsubscribe = onSnapshot(notificationsRef, (snapshot) => {
      const fetchedNotifications = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setNotifications(fetchedNotifications);
    });

    return () => unsubscribe();
  }, []);

  const handleNotificationClick = async (notification) => {
    const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));
    const notificationRef = doc(
      db,
      "notifications",
      loggedInUser.id,
      "messages",
      notification.id
    );

    await updateDoc(notificationRef, { read: true });

    // Fetching the sender's full user data
    const senderRef = doc(db, "users", notification.senderId);
    const senderSnap = await getDoc(senderRef);

    let otherUser = { id: notification.senderId };
    if (senderSnap.exists()) {
      otherUser = { id: senderSnap.id, ...senderSnap.data() };
    }

    navigate(`/chat/${otherUser.id}`, { state: { otherUser } });
  };

  return (
    <Layout>
      <div className="notifications-page">
        <h2>Notifications</h2>
        {notifications.length === 0 ? (
          <p>No notifications yet.</p>
        ) : (
          <ul className="notifications-list">
            {notifications.map((notification) => (
              <li
                key={notification.id}
                className={`notification-item ${notification.read ? "read" : "unread"}`}
                onClick={() => handleNotificationClick(notification)}
              >
                <p>
                  <strong>{notification.senderName}</strong> sent you a message.
                </p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </Layout>
  );
}

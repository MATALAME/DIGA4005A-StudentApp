import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "../Components/Layout";
import { collection, onSnapshot } from "firebase/firestore";
import { db } from "../firebase";
import { setupChatBetweenUsers } from "../firebaseUtils";
import "../Styling/AllUsers.css";

export default function AllUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));
    if (!loggedInUser) return;

    const usersRef = collection(db, "users");

    const unsubscribe = onSnapshot(usersRef, (snapshot) => {
      const fetchedUsers = snapshot.docs
        .map((doc) => {
          const data = doc.data();
          if (!data.name || !data.email) return null;

          const lastActive = data.lastActive?.toDate?.() || new Date(0);
          const isOnline = new Date() - lastActive < 30000;

          return {
            id: doc.id,
            name: data.name,
            email: data.email,
            accountType: data.accountType || "student",
            online: isOnline,
            profileImage: data.profileImage || `https://picsum.photos/seed/${doc.id}/150`
          };
        })
        .filter((user) => user && user.id !== loggedInUser.id);

      setUsers(fetchedUsers);
      setLoading(false);
    }, (error) => {
      console.error("Error fetching users:", error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (loading) {
    return (
      <Layout>
        <div className="all-users">
          <p>Loading users...</p>
        </div>
      </Layout>
    );
  }

  const handleUserClick = async (user) => {
    const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));
    if (!loggedInUser) return;

    try {
      await setupChatBetweenUsers(loggedInUser, user);
      navigate(`/chat/${user.id}`, { state: { otherUser: user } });
    } catch (error) {
      console.error("Failed to open chat:", error);
    }
  };

  return (
    <Layout>
      <div className="all-users">
        <h2>Inbox 📨</h2>
        {users.length === 0 ? (
          <p>No users found.</p>
        ) : (
          <ul className="user-list">
            {users.map((user) => (
              <li
                key={user.id}
                className="user-item"
                onClick={() => handleUserClick(user)}
              >
                <div className="user-avatar-section">
                  <img
                    src={user.profileImage || `https://picsum.photos/seed/${user.id}/150`}
                    alt={user.name}
                    className="user-avatar"
                  />
                  {user.online && <span className="online-dot"></span>}
                </div>
                <div className="user-info">
                  <p>
                    <strong>{user.name}</strong> ({user.email})
                  </p>
                  <p className="user-account-type">{user.accountType}</p>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </Layout>
  );
}

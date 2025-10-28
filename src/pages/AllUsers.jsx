import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "../Components/Layout";
import { collection, onSnapshot } from "firebase/firestore";
import { db } from "../firebase";
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

  return (
    <Layout>
      <div className="all-users">
        <h2>All Users</h2>
        {users.length === 0 ? (
          <p>No users found.</p>
        ) : (
          <ul className="user-list">
            {users.map((user) => (
              <li
                key={user.id}
                className="user-item"
                onClick={() =>
                  navigate(`/chat/${user.id}`, { state: { otherUser: user } })
                }
              >
                <p>
                  <strong>{user.name}</strong> ({user.email})
                  {user.online && <span className="online-dot"></span>}
                </p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </Layout>
  );
}

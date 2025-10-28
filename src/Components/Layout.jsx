import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "./Sidebar";
import "../Styling/Layout.css";
import { collection, onSnapshot } from "firebase/firestore";
import { db } from "../firebase";
import { Bell } from "lucide-react";

export default function Layout({ children }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));
    if (!loggedInUser) return;
  
    const notificationsRef = collection(db, "notifications", loggedInUser.id, "messages"); 
  
    const unsubscribe = onSnapshot(notificationsRef, (snapshot) => {
      const newNotifications = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setNotifications(newNotifications);
    });
  
    return () => unsubscribe();
  }, []);
  

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <div className="app-layout">
    
      <header className="home-header">
        <div className="hamburger" onClick={() => setIsMenuOpen(!isMenuOpen)}>
          &#9776;
        </div>

        <h1 className="home-title">Student Hustle</h1>

        <div className="header-icons">
         
          <div className="notification-bell" onClick={() => navigate("/notifications")}>
            <Bell size={24} />
            {unreadCount > 0 && <span className="notification-dot">{unreadCount}</span>}
          </div>

         
          <div className="profile-picture">
            <img src="https://picsum.photos/150" alt="Profile" />
          </div>
        </div>
      </header>

   
      <Sidebar isMenuOpen={isMenuOpen} setIsMenuOpen={setIsMenuOpen} />

      
      <main className={`page-content ${isMenuOpen ? "overlay" : ""}`}>{children}</main>
    </div>
  );
}

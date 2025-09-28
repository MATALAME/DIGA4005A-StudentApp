import React, { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { ArrowLeft, Send } from "lucide-react";
import { db } from "../firebase";
import {
  collection,
  addDoc,
  query,
  orderBy,
  onSnapshot,
  serverTimestamp,
} from "firebase/firestore";
import "../Styling/ChatPage.css";

const ChatPage = () => {
  const navigate = useNavigate();
  const { id } = useParams(); 
  const location = useLocation();
  const stateOtherUser = location.state?.otherUser;

  const [loggedInUser, setLoggedInUser] = useState(null);
  const [otherUser, setOtherUser] = useState(stateOtherUser || null);
  const [messages, setMessages] = useState([]);
  const [userMessage, setUserMessage] = useState("");

  // Fetches logged-in user
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("loggedInUser"));
    if (user) setLoggedInUser(user);
    else navigate("/signup");
  }, [navigate]);

 
  useEffect(() => {
    if (!otherUser && id) {
      fetch(`http://localhost:5001/users/${id}`)
        .then((res) => res.json())
        .then((data) => setOtherUser(data))
        .catch(console.error);
    }
  }, [id, otherUser]);

  // Set up chat listener
  useEffect(() => {
    if (!loggedInUser || !otherUser) return;

    const chatId = [loggedInUser.email, otherUser.email].sort().join("_");
    const messagesRef = collection(db, "chats", chatId, "messages");
    const q = query(messagesRef, orderBy("timestamp", "asc"));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      setMessages(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
    });

    return () => unsubscribe();
  }, [loggedInUser, otherUser]);

  const handleSendMessage = async () => {
    if (!userMessage.trim() || !loggedInUser || !otherUser) return;

    try {
      const chatId = [loggedInUser.email, otherUser.email].sort().join("_");
      const messagesRef = collection(db, "chats", chatId, "messages");

      // Adds message to Firestore (its on the firebase ddatabase section)
      await addDoc(messagesRef, {
        text: userMessage.trim(),
        sender: loggedInUser.email,
        senderName: loggedInUser.name,
        receiver: otherUser.email,
        timestamp: serverTimestamp(),
      });

      
      const notificationsRef = collection(db, "notifications", otherUser.email, "messages");
      await addDoc(notificationsRef, {
        senderId: loggedInUser.email,
        senderName: loggedInUser.name,
        text: userMessage.trim(),
        read: false,
        timestamp: serverTimestamp(),
      });

      setUserMessage("");
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  if (!loggedInUser || !otherUser) {
    return <p>Loading chat...</p>;
  }

  return (
    <div className="chat-page">
      {/* HEADER */}
      <header className="chat-header">
        <button className="back-button" onClick={() => navigate(-1)}>
          <ArrowLeft size={24} color="white" />
        </button>
        <h1 className="chat-title">{otherUser.name}</h1>
        <div className="profile-picture">
          <img src={"https://picsum.photos/150"} alt="Profile" />
        </div>
      </header>

      {/* MESSAGES */}
      <div className="chat-messages">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`chat-bubble-wrapper ${
              message.sender === loggedInUser.email ? "right" : "left"
            }`}
          >
            <img
              src={
                message.sender === loggedInUser.email
                  ? "https://picsum.photos/150"
                  : "https://picsum.photos/151"
              }
              alt={message.sender}
              className="chat-avatar"
            />
            <div
              className={`chat-bubble ${
                message.sender === loggedInUser.email ? "sent" : "received"
              }`}
            >
              {message.text}
            </div>
          </div>
        ))}
      </div>

      {/* INPUT */}
      <div className="chat-input-wrapper">
        <input
          type="text"
          value={userMessage}
          onChange={(e) => setUserMessage(e.target.value)}
          placeholder="Type your message..."
          className="chat-input"
        />
        <button onClick={handleSendMessage} className="chat-send-button">
          <Send size={18} color="white" />
        </button>
      </div>
    </div>
  );
};

export default ChatPage;

import React, { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { ArrowLeft, Send } from "lucide-react";
import { db } from "../firebase";
import {
  collection,
  addDoc,
  doc,
  onSnapshot,
  query,
  orderBy,
  serverTimestamp,
  getDoc
} from "firebase/firestore";
import { sendNotification } from "../firebaseUtils"; 
import "../Styling/ChatPage.css";

const ChatPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { id } = useParams(); 
  const [loggedInUser, setLoggedInUser] = useState(null);
  const [otherUser, setOtherUser] = useState(location.state?.otherUser || null); 
  const [messages, setMessages] = useState([]);
  const [userMessage, setUserMessage] = useState("");

 
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("loggedInUser"));
    if (!user) navigate("/signup");
    else setLoggedInUser(user);
  }, [navigate]);

 
  useEffect(() => {
    const fetchOtherUser = async () => {
      if (!id || otherUser) return;
      const userRef = doc(db, "users", id);
      const snap = await getDoc(userRef);
      if (snap.exists()) setOtherUser({ id: snap.id, ...snap.data() });
    };
    fetchOtherUser();
  }, [id, otherUser]);

  
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

    const chatId = [loggedInUser.email, otherUser.email].sort().join("_");
    const messagesRef = collection(db, "chats", chatId, "messages");

    await addDoc(messagesRef, {
      text: userMessage.trim(),
      sender: loggedInUser.email,
      senderName: loggedInUser.name,
      receiver: otherUser.email,
      timestamp: serverTimestamp(),
    });

    
    await sendNotification(loggedInUser, otherUser, userMessage.trim());

    setUserMessage("");
  };

  if (!loggedInUser || !otherUser) return <p>Loading chat...</p>;

  return (
    <div className="chat-page">
      <header className="chat-header">
        <button className="back-button" onClick={() => navigate(-1)}>
          <ArrowLeft size={24} color="white" />
        </button>
        <h1 className="chat-title">{otherUser.name}</h1>
        <div className="profile-picture">
          <img src={"https://picsum.photos/150"} alt="Profile" />
        </div>
      </header>

      <div className="chat-messages">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`chat-bubble-wrapper ${
              msg.sender === loggedInUser.email ? "right" : "left"
            }`}
          >
            <img
              src={
                msg.sender === loggedInUser.email
                  ? "https://picsum.photos/150"
                  : "https://picsum.photos/151"
              }
              alt={msg.sender}
              className="chat-avatar"
            />
            <div
              className={`chat-bubble ${
                msg.sender === loggedInUser.email ? "sent" : "received"
              }`}
            >
              {msg.text}
            </div>
          </div>
        ))}
      </div>

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

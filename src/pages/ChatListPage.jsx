import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import "../Styling/ChatListPage.css";

const ChatListPage = () => {
  const navigate = useNavigate();
  const [contacts, setContacts] = useState([]);

  useEffect(() => {
    const storedChats = JSON.parse(localStorage.getItem("chats")) || [];
    setContacts(storedChats);
  }, []);

  const handleContactClick = (username) => {
    navigate(`/chat/${username}`);
  };

  return (
    <div className="chatlist-page">
      {/* HEADER */}
      <header className="chatlist-header">
        <button className="back-button" onClick={() => navigate(-1)}>
          <ArrowLeft size={24} color="white" />
        </button>
        <h2 className="chatlist-title">Your Chats</h2>
      </header>

      {/* CONTACT LIST */}
      {contacts.length === 0 ? (
        <p className="no-chats-message">No chats yet. Start contacting people!</p>
      ) : (
        <div className="contact-list">
          {contacts.map((contact, index) => (
            <div
              key={index}
              className="contact-card"
              onClick={() => handleContactClick(contact.username)}
            >
              <img
                src= {contact.profileImage || "https://picsum.photos/150"}
                alt={contact.username}
                className="contact-avatar"
              />
              <div className="contact-info">
                <h3 className="contact-username">{contact.username}</h3>
                <p className="contact-last-message">{contact.lastMessage}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ChatListPage;
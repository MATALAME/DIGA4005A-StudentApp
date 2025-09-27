import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Send } from "lucide-react";
import "../Styling/ChatPage.css";

const ChatPage = () => {
  const { username } = useParams();
  const navigate = useNavigate();

  const [messages, setMessages] = useState([]);
  const [userMessage, setUserMessage] = useState("");

  useEffect(() => {
    // Load chats from localStorage
    const storedChats = JSON.parse(localStorage.getItem("chats")) || [];
    const chat = storedChats.find((chat) => chat.username === username);

    if (chat) {
      setMessages(chat.messages || []);
    } else {
      // Initialize a new chat if it doesn't exist
      const newChat = { username, messages: [], lastMessage: "" };
      localStorage.setItem("chats", JSON.stringify([...storedChats, newChat]));
    }
  }, [username]);

  const handleSendMessage = () => {
    if (userMessage.trim()) {
      const newMessages = [
        ...messages,
        { sender: "You", text: userMessage },
        {
          sender: username,
          text: "Thank you for your message. I'll get back to you soon!",
        },
      ];

      setMessages(newMessages);

      // Update chats in localStorage
      const storedChats = JSON.parse(localStorage.getItem("chats")) || [];
      const updatedChats = storedChats.map((chat) =>
        chat.username === username
          ? { ...chat, messages: newMessages, lastMessage: userMessage }
          : chat
      );

      // If the chat doesn't exist, add it
      if (!storedChats.find((chat) => chat.username === username)) {
        updatedChats.push({
          username,
          messages: newMessages,
          lastMessage: userMessage,
        });
      }

      localStorage.setItem("chats", JSON.stringify(updatedChats));
      setUserMessage("");
    }
  };

  return (
    <div className="chat-page">
      {/* HEADER */}
      <header className="chat-header">
        <button className="back-button" onClick={() => navigate(-1)}>
          <ArrowLeft size={24} color="white" />
        </button>
        <h1 className="chat-title">{username}</h1>
        <div className="profile-picture">
          <img src={"https://picsum.photos/150"} alt="Profile" />
        </div>
      </header>

      {/* MESSAGES */}
      <div className="chat-messages">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`chat-bubble-wrapper ${
              message.sender === "You" ? "right" : "left"
            }`}
          >
            <img
              src={
                message.sender === "You"
                  ? "https://picsum.photos/150"
                  : "https://picsum.photos/151"
              }
              alt={message.sender}
              className="chat-avatar"
            />
            <div
              className={`chat-bubble ${
                message.sender === "You" ? "sent" : "received"
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

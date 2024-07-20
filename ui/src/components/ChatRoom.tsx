import "@fortawesome/fontawesome-free/css/all.min.css";
import React, { useEffect, useRef, useState } from "react";
import io from "socket.io-client";
import apiClient from "../utils/apiClient";

const socket = io(process.env.REACT_APP_SOCKET_URL as string);

interface Message {
  sender: {
    nickname: string;
    id: number;
  };
  message: string;
}

interface ChatRoomProps {
  roomId: number;
  userId: number;
}

const ChatRoom: React.FC<ChatRoomProps> = ({ roomId, userId }) => {
  const [message, setMessage] = useState<string>("");
  const [messages, setMessages] = useState<Message[]>([]);
  const messagesEndRef = useRef<HTMLDivElement | null>(null); // Reference to the end of messages container

  useEffect(() => {
    socket.emit("joinRoom", { roomId });

    const fetchMessages = () => {
      apiClient.get(`/chat/rooms/${roomId}/messages`).then((response) => {
        setMessages(response.data);
        console.log("Fetched messages:", response.data);
      });
    };

    fetchMessages(); // Initial fetch

    socket.on("receiveMessage", (newMessage: Message) => {
      console.log("Received new message:", newMessage);
      setMessages((prevMessages) => {
        const updatedMessages = [...prevMessages, newMessage];
        console.log("Updated messages:", updatedMessages);
        return updatedMessages;
      });
    });

    return () => {
      socket.disconnect();
    };
  }, [roomId]);

  useEffect(() => {
    // Scroll to bottom whenever messages change
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  const sendMessage = () => {
    if (message.trim()) {
      // Emit the message to the socket
      socket.emit("sendMessage", { roomId, senderId: userId, message });

      // Save the message to the server
      apiClient
        .post(`/chat/rooms/${roomId}/messages`, { senderId: userId, message })
        .then(() => {
          // Clear the input field
          setMessage("");

          // Refresh messages to ensure the latest message is displayed
          apiClient.get(`/chat/rooms/${roomId}/messages`).then((response) => {
            setMessages(response.data);
            console.log("Messages refreshed:", response.data);
          });
        })
        .catch((error) => {
          console.error("Error saving message:", error);
        });
    }
  };

  return (
    <div
      style={{
        bottom: 0,
        right: 0,
        width: "400px",
        height: "300px",
        backgroundColor: "#fff",
        border: "1px solid #ddd",
        boxShadow: "0 0 10px rgba(0, 0, 0, 0.1)",
        zIndex: 1000,
        display: "flex",
        flexDirection: "column",
      }}
    >
      <div
        style={{
          flex: 1,
          overflowY: "scroll",
          padding: "10px",
          msOverflowStyle: "none",
          scrollbarWidth: "none",
        }}
      >
        {messages.map((msg, index) => (
          <div
            key={index}
            style={{
              display: "flex",
              justifyContent:
                msg.sender.id === userId ? "flex-end" : "flex-start",
              marginBottom: "10px",
            }}
          >
            <div
              style={{
                maxWidth: "70%",
                padding: "8px 12px",
                borderRadius: "10px",
                backgroundColor:
                  msg.sender.id === userId ? "#d1ffd6" : "#f1f1f1",
                textAlign: "left",
                wordBreak: "break-word",
              }}
            >
              <strong>{msg.sender.nickname}</strong>: {msg.message}
            </div>
          </div>
        ))}
        {/* This div is used to scroll to the bottom */}
        <div ref={messagesEndRef} />
      </div>
      <div
        style={{
          borderTop: "1px solid #ddd",
          padding: "10px",
          display: "flex",
          alignItems: "center",
        }}
      >
        <button
          onClick={() =>
            apiClient.get(`/chat/rooms/${roomId}/messages`).then((response) => {
              setMessages(response.data);
              console.log("Messages refreshed:", response.data);
            })
          }
          style={{
            width: "40px",
            height: "40px",
            padding: "5px",
            marginRight: "10px",
            backgroundColor: "#007bff",
            color: "#fff",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "20px",
          }}
        >
          <i className="fas fa-sync-alt"></i>
        </button>
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="메시지를 입력하세요"
          style={{ flex: 1, padding: "5px" }}
        />
        <button
          onClick={sendMessage}
          style={{ width: "70px", padding: "5px", marginLeft: "10px" }}
        >
          전송
        </button>
      </div>
    </div>
  );
};

export default ChatRoom;

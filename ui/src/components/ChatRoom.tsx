import "@fortawesome/fontawesome-free/css/all.min.css";
import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import io from "socket.io-client";
import apiClient from "../utils/apiClient";

const socket = io(process.env.REACT_APP_SOCKET_URL as string);

interface Message {
  sender: {
    nickname: string;
    id: number;
    profileimage: string;
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
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    socket.emit("joinRoom", { roomId });

    const fetchMessages = () => {
      apiClient.get(`/chat/rooms/${roomId}/messages`).then((response) => {
        setMessages(response.data);
        console.log("Fetched messages:", response.data);
      });
    };

    fetchMessages();

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
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  const sendMessage = () => {
    if (message.trim()) {
      socket.emit("sendMessage", { roomId, senderId: userId, message });

      apiClient
        .post(`/chat/rooms/${roomId}/messages`, { senderId: userId, message })
        .then(() => {
          setMessage("");

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

  const handleProfileClick = (userId: number) => {
    navigate(`/users/${userId}`);
  };

  return (
    <div
      style={{
        bottom: 0,
        right: 0,
        width: "360px",
        height: "460px",
        backgroundColor: "#fff",
        border: "1px solid #ddd",
        boxShadow: "0 0 10px rgba(0, 0, 0, 0.1)",
        zIndex: 1000,
        display: "flex",
        flexDirection: "column",
        marginTop: "20px",
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
              flexDirection: msg.sender.id === userId ? "row-reverse" : "row",
              marginBottom: "10px",
              alignItems: "flex-end",
            }}
          >
            {msg.sender.id !== userId && (
              <>
                <img
                  src={`${apiClient.defaults.baseURL}/${msg.sender.profileimage}`}
                  alt="Profile"
                  style={{
                    width: "40px",
                    height: "40px",
                    borderRadius: "50%",
                    marginRight: "10px",
                    cursor: "pointer",
                  }}
                  onClick={() => handleProfileClick(msg.sender.id)}
                />
                <div
                  style={{
                    maxWidth: "70%",
                    padding: "8px 12px",
                    borderRadius: "10px",
                    backgroundColor: "#f1f1f1",
                    textAlign: "left",
                    wordBreak: "break-word",
                  }}
                >
                  <div>{msg.message}</div>
                </div>
              </>
            )}
            {msg.sender.id === userId && (
              <div
                style={{
                  maxWidth: "70%",
                  padding: "8px 12px",
                  borderRadius: "10px",
                  backgroundColor: "#d1ffd6",
                  textAlign: "left",
                  wordBreak: "break-word",
                }}
              >
                {msg.message}
              </div>
            )}
          </div>
        ))}

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
            backgroundColor: "transparent",
            color: "black",
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
          style={{ flex: 1, padding: "5px", borderRadius: "5px" }}
        />
        <button
          onClick={sendMessage}
          style={{
            width: "70px",
            padding: "5px",
            marginLeft: "10px",
            border: "none",
            color: "#fff",
            fontWeight: "bold",
            backgroundColor: "#7db26b",
            borderRadius: "5px",
          }}
        >
          전송
        </button>
      </div>
    </div>
  );
};

export default ChatRoom;

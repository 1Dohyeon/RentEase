import "@fortawesome/fontawesome-free/css/all.min.css";
import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import io from "socket.io-client";
import apiClient from "../utils/apiClient";

const socket = io(process.env.REACT_APP_SOCKET_URL as string);

interface Message {
  sender: {
    nickname: string;
    senderId: number;
    profileimage: string;
  };
  message: string;
}

interface ChatRoomProps {
  roomId: number;
  userId: number;
  articleId: number;
}

const ChatRoom: React.FC<ChatRoomProps> = ({ roomId, userId }) => {
  const [message, setMessage] = useState<string>("");
  const [messages, setMessages] = useState<Message[]>([]);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    socket.emit("joinRoom", { chatRoomId: roomId });

    socket.on("existingMessages", (existingMessages: Message[]) => {
      setMessages(existingMessages);
    });

    socket.on("newMessage", (newMessage: Message) => {
      setMessages((prevMessages) => [...prevMessages, newMessage]);
    });

    return () => {
      socket.emit("leaveRoom", { chatRoomId: roomId });
      socket.off("existingMessages");
      socket.off("newMessage");
    };
  }, [roomId]);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  const sendMessage = () => {
    if (message.trim()) {
      socket.emit("sendMessage", {
        chatRoomId: roomId,
        senderId: userId,
        message,
      });
      setMessage("");
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
        }}
      >
        {messages.map((msg, index) => {
          const isCurrentUser = msg.sender?.senderId === userId; // 안전하게 senderId 확인
          return (
            <div
              key={index}
              style={{
                display: "flex",
                flexDirection: isCurrentUser ? "row-reverse" : "row",
                marginBottom: "10px",
                alignItems: "center",
              }}
            >
              {!isCurrentUser && msg.sender && (
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
                  onClick={() => handleProfileClick(msg.sender.senderId)}
                />
              )}
              <div
                style={{
                  maxWidth: "70%",
                  padding: "8px 12px",
                  borderRadius: "10px",
                  backgroundColor: isCurrentUser ? "#d1ffd6" : "#f1f1f1",
                  textAlign: "left",
                  wordBreak: "break-word",
                  alignSelf: "flex-start",
                }}
              >
                <div>{msg.message}</div>
              </div>
            </div>
          );
        })}

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

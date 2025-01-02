import React, { useContext, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import io from "socket.io-client";
import { AuthContext } from "../contexts/AuthContext";
import apiClient from "../utils/apiClient";
import "./ChatRoom.css";

const socket = io(process.env.REACT_APP_SOCKET_URL as string);

interface Message {
  sender: {
    nickname: string;
    id: number;
    profileimage: string;
  };
  message: string;
}

interface SendMessage {
  senderId: number;
  message: string;
}

interface ChatRoomProps {
  roomId: number;
  articleId: number;
}

const ChatRoom: React.FC<ChatRoomProps> = ({ roomId }) => {
  const [message, setMessage] = useState<string>("");
  const [messages, setMessages] = useState<Message[]>([]);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const navigate = useNavigate();
  const {
    userId: loginUser,
    isLoggedIn,
    nickname,
    profileImage,
  } = useContext(AuthContext); // 여기서 한 번만 호출

  useEffect(() => {
    socket.emit("joinRoom", { chatRoomId: roomId });

    socket.on("existingMessages", (existingMessages: Message[]) => {
      // 기존 메시지 구조가 일치하도록 처리
      setMessages(existingMessages);
    });

    socket.on("newMessage", (newMessage: Message) => {
      console.log("새로운 메시지:", newMessage);
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
        sender: {
          id: loginUser,
          nickname: nickname,
          profileimage: profileImage,
        },
        message,
      });
      setMessage(""); // 메시지 전송 후 초기화
    }
  };

  const handleProfileClick = (senderId: number | undefined) => {
    if (!senderId) {
      console.error("Invalid senderId:", senderId);
      return;
    }
    navigate(`/users/${senderId}`);
  };

  return (
    <div className="chat-room">
      <div className="chat-room-messages">
        {messages.map((msg, index) => {
          const isCurrentUser = msg.sender?.id === loginUser;
          console.log(
            "로그인 사용자 ID:",
            loginUser,
            "메시지 보낸 사람 ID:",
            msg.sender?.id
          );
          return (
            <div
              key={index}
              className={`chat-message ${isCurrentUser ? "reverse" : ""}`}
            >
              {!isCurrentUser && msg.sender && (
                <img
                  src={`${apiClient.defaults.baseURL}/${msg.sender.profileimage}`}
                  alt="Profile"
                  onClick={() => handleProfileClick(msg.sender.id)}
                />
              )}
              <div
                className={`chat-message-box ${
                  isCurrentUser ? "current-user" : "other-user"
                }`}
              >
                <div>{msg.message}</div>
              </div>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>
      <div className="chat-room-input">
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="메시지를 입력하세요"
          style={{ flex: 1, padding: "5px", borderRadius: "5px" }}
        />
        <button onClick={sendMessage}>전송</button>
      </div>
    </div>
  );
};

export default ChatRoom;

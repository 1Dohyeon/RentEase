import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import ChatRoom from "../components/ChatRoom";
import Header from "../components/Header";
import apiClient from "../utils/apiClient";
import "./UserChatroomPage.css";

interface ChatRoom {
  id: number;
  user1: {
    id: number;
    nickname: string;
    profileimage: string;
  };
  user2: {
    id: number;
    nickname: string;
    profileimage: string;
  };
}

const UserChatroomPage: React.FC = () => {
  const { userId } = useParams<{ userId: string }>();
  const [chatRooms, setChatRooms] = useState<ChatRoom[]>([]);
  const [selectedChatRoomId, setSelectedChatRoomId] = useState<number | null>(
    null
  );
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchChatRooms = async () => {
      try {
        const response = await apiClient.get<ChatRoom[]>(
          `/chat/rooms/users/${userId}`
        );
        setChatRooms(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching chat rooms:", error);
        setLoading(false);
      }
    };

    fetchChatRooms();
  }, [userId]);

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <div className="user-chatroom-page">
      <Header />
      <div className="empty-box"></div>
      <div className="chatroom-content">
        {chatRooms.length > 0 ? (
          chatRooms.map((room) => {
            const chatPartner =
              room.user1.id.toString() === userId ? room.user2 : room.user1;
            return (
              <div
                key={room.id}
                className="chatroom-item"
                onClick={() => setSelectedChatRoomId(room.id)}
              >
                <img
                  src={`${apiClient.defaults.baseURL}/${chatPartner.profileimage}`}
                  alt="Profile"
                  className="chatroom-profile-image"
                />
                <div className="chatroom-nickname">{chatPartner.nickname}</div>
              </div>
            );
          })
        ) : (
          <div className="no-chatrooms">No chat rooms available</div>
        )}
      </div>
      {selectedChatRoomId && (
        <div className="chatroom-modal">
          <div className="chatroom-modal-content">
            <button
              onClick={() => setSelectedChatRoomId(null)}
              className="close-chatroom-modal"
            >
              &times;
            </button>
            <ChatRoom roomId={selectedChatRoomId} userId={parseInt(userId!)} />
          </div>
        </div>
      )}
    </div>
  );
};

export default UserChatroomPage;

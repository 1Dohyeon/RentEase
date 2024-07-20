import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import ChatRoom from "../components/ChatRoom";
import Header from "../components/Header";
import apiClient from "../utils/apiClient";
import "./UserChatroomPage.css";

interface ChatRoomData {
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
  article: {
    id: number;
    title: string;
    mainImage: string;
  } | null; // article can be null
}

const UserChatroomPage: React.FC = () => {
  const { userId } = useParams<{ userId: string }>();
  const [chatRooms, setChatRooms] = useState<ChatRoomData[]>([]);
  const [selectedChatRoomId, setSelectedChatRoomId] = useState<number | null>(
    null
  );
  const [selectedArticleId, setSelectedArticleId] = useState<number | null>(
    null
  );
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchChatRooms = async () => {
      try {
        const response = await apiClient.get<ChatRoomData[]>(
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

  const handleChatRoomClick = (roomId: number, articleId: number) => {
    setSelectedChatRoomId(roomId);
    setSelectedArticleId(articleId);
  };

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
            // Verify if article exists before accessing its properties
            const article = room.article;
            const chatPartner =
              room.user1.id.toString() === userId ? room.user2 : room.user1;

            return (
              <div
                key={room.id}
                className="chatroom-item"
                onClick={() => handleChatRoomClick(room.id, article?.id || 0)}
              >
                <img
                  src={`${apiClient.defaults.baseURL}/${
                    article?.mainImage || "default-image.png"
                  }`}
                  alt="Article Main"
                  className="chatroom-main-image"
                />
                <div className="chatroom-title">
                  {article?.title || "No Title"}
                </div>
              </div>
            );
          })
        ) : (
          <div className="no-chatrooms">No chat rooms available</div>
        )}
      </div>
      {selectedChatRoomId !== null && selectedArticleId !== null && (
        <div className="chatroom-modal">
          <div className="chatroom-modal-content">
            <button
              onClick={() => {
                setSelectedChatRoomId(null);
                setSelectedArticleId(null);
              }}
              className="close-chatroom-modal"
            >
              &times;
            </button>
            <ChatRoom
              roomId={selectedChatRoomId}
              userId={parseInt(userId!)}
              articleId={selectedArticleId} // Pass the selectedArticleId here
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default UserChatroomPage;

import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Header from "../components/Header";
import MyArticlesComponent from "../components/MyArticlesComponent";
import MyBookmarkComponent from "../components/MyBookmarkComponenet";
import MyReviewsComponent from "../components/MyReviewsComponent";
import "./MyPage.css"; // CSS 파일을 import

interface User {
  id: number;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  nickname: string;
  profileimage?: string;
  addresses: { city: string; district: string }[];
}

const MyPage: React.FC = () => {
  const { userId } = useParams<{ userId: string }>();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedTab, setSelectedTab] = useState<
    "articles" | "reviews" | "bookmarks"
  >("articles");

  const navigate = useNavigate();

  const apiBaseUrl = process.env.REACT_APP_API_BASE_URL;

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get<User>(`${apiBaseUrl}/users/${userId}`);
        setUser(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching user data:", error);
        setLoading(false);
      }
    };

    fetchUserData();
  }, [userId, apiBaseUrl]);

  const handleChatLinkClick = () => {
    navigate(`/users/${userId}/chattings`);
  };

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  if (!user) {
    return <div className="not-found">User not found</div>;
  }

  return (
    <div className="mypage">
      <Header />
      <div className="profile-section">
        <div className="profile-image-container">
          {user.profileimage ? (
            <img
              src={`${apiBaseUrl}/${user.profileimage}`}
              alt="Profile"
              className="profile-image"
            />
          ) : (
            "프로필 이미지가 없습니다."
          )}
        </div>
        <div className="profile-info">
          <h3>{user.nickname}</h3>
          {user.addresses.length > 0 && (
            <div className="address-list">
              {user.addresses.map((address, index) => (
                <span key={index}>
                  {address.city} {address.district}
                  {index !== user.addresses.length - 1 && "/"}
                </span>
              ))}
            </div>
          )}
          <div className="chat-link" onClick={handleChatLinkClick}>
            채팅 {">"}
          </div>
        </div>
      </div>

      <div className="tab-section">
        <div
          onClick={() => setSelectedTab("articles")}
          className={`tab-item ${selectedTab === "articles" ? "active" : ""}`}
        >
          게시글
        </div>
        <div
          onClick={() => setSelectedTab("reviews")}
          className={`tab-item ${selectedTab === "reviews" ? "active" : ""}`}
        >
          후기
        </div>
        <div
          onClick={() => setSelectedTab("bookmarks")}
          className={`tab-item ${selectedTab === "bookmarks" ? "active" : ""}`}
        >
          북마크
        </div>
      </div>
      <div className="tab-contents">
        {" "}
        {selectedTab === "articles" && <MyArticlesComponent userId={user.id} />}
        {selectedTab === "reviews" && <MyReviewsComponent userId={user.id} />}
        {selectedTab === "bookmarks" && (
          <MyBookmarkComponent userId={user.id} />
        )}
      </div>
    </div>
  );
};

export default MyPage;

import axios from "axios";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Header from "../components/Header";
import MyArticlesComponent from "../components/MyArticlesComponent";
import MyBookmarkComponent from "../components/MyBookmarkComponenet";
import MyReviewsComponent from "../components/MyReviewsComponent";

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

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return <div>User not found</div>;
  }

  return (
    <div>
      <Header />
      <div
        style={{
          width: "840px",
          margin: "0 auto",
        }}
      >
        <div
          style={{
            width: "100%",
            height: "250px",
            display: "flex",
            alignItems: "center",
            padding: "0 20px",
            paddingTop: "70px",
            borderBottom: "1px solid #e5e5e5",
          }}
        >
          <div
            style={{
              width: "160px",
              height: "160px",
              backgroundColor: "#d2d2d2",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {user.profileimage ? (
              <img
                src={`${apiBaseUrl}/${user.profileimage}`}
                alt="Profile"
                style={{ maxWidth: "100%", maxHeight: "100%" }}
              />
            ) : (
              "No Image"
            )}
          </div>
          <div
            style={{
              height: "160px",
              marginLeft: "10px",
            }}
          >
            <h3>{user.nickname}</h3>
            {user.addresses.length > 0 && (
              <div>
                {user.addresses.map((address, index) => (
                  <span key={index}>
                    {address.city} {address.district}
                    {index !== user.addresses.length - 1 && "/"}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <div
        style={{
          maxWidth: "840px",
          margin: "0 auto",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            padding: "0 20px",
            height: "50px",
          }}
        >
          <div
            onClick={() => setSelectedTab("articles")}
            style={{
              width: "33%",
              textAlign: "center",
              padding: "10px 0",
              fontWeight: "600",
              color: selectedTab === "articles" ? "#7DB26B" : "#aaaaaa",
              borderBottom:
                selectedTab === "articles" ? "2px solid #7DB26B" : "none",
              cursor: "pointer",
            }}
          >
            게시글
          </div>
          <div
            onClick={() => setSelectedTab("reviews")}
            style={{
              width: "33%",
              textAlign: "center",
              padding: "10px 0",
              fontWeight: "600",
              color: selectedTab === "reviews" ? "#7DB26B" : "#aaaaaa",
              borderBottom:
                selectedTab === "reviews" ? "2px solid #7DB26B" : "none",
              cursor: "pointer",
            }}
          >
            후기
          </div>
          <div
            onClick={() => setSelectedTab("bookmarks")}
            style={{
              width: "33%",
              textAlign: "center",
              padding: "10px 0",
              fontWeight: "600",
              color: selectedTab === "bookmarks" ? "#7DB26B" : "#aaaaaa",
              borderBottom:
                selectedTab === "bookmarks" ? "2px solid #7DB26B" : "none",
              cursor: "pointer",
            }}
          >
            북마크
          </div>
        </div>
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

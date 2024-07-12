import axios from "axios";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Header from "../components/Header";

interface User {
  id: number;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  nickname: string;
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
  }, [userId]);

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
          maxWidth: "840px",
          height: "250px",
          margin: "0 auto",
          display: "flex",
          alignItems: "center",
          padding: "0 20px",
          paddingTop: "50px",
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
          }}
        ></div>
        <div
          style={{
            height: "160px",
          }}
        >
          <h3
            style={{
              marginLeft: "10px",
            }}
          >
            {user.nickname}
          </h3>
          {user.addresses.length > 0 && (
            <div style={{ marginLeft: "10px" }}>
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
      <div
        style={{
          maxWidth: "840px",
          height: "250px",
          margin: "0 auto",
        }}
      >
        <div
          style={{
            width: "100%",
            height: "50px",
            display: "flex",
            justifyContent: "space-between",
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
        <div>이곳에 컨텐츠</div>
      </div>
    </div>
  );
};

export default MyPage;

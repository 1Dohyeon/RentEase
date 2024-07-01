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
  addresses: { city: string; district: string }[]; // 주소 객체 타입 수정
}

const MyPage: React.FC = () => {
  const { userId } = useParams(); // userId 파라미터 가져오기
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const apiBaseUrl = process.env.REACT_APP_API_BASE_URL;

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get<User>(`${apiBaseUrl}/users/${userId}`);
        setUser(response.data); // 사용자 정보 설정
        setLoading(false); // 로딩 상태 변경
      } catch (error) {
        console.error("Error fetching user data:", error);
        setLoading(false); // 로딩 상태 변경
      }
    };

    fetchUserData(); // 데이터 가져오기 함수 호출
  }, [userId]); // userId가 변경될 때마다 useEffect가 실행됨

  if (loading) {
    return <div>Loading...</div>; // 로딩 중일 때 표시할 UI
  }

  if (!user) {
    return <div>User not found</div>; // 사용자 정보가 없을 경우 표시할 UI
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
          borderRadius: "10px",
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
                  {/* 마지막 주소가 아니면 '/' 추가 */}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MyPage;

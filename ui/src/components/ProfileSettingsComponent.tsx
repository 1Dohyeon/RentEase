import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import apiClient from "../utils/apiClient";
import "./ProfileSettingsComponent.css";

interface Address {
  id: number;
  city: string;
  district: string;
}

interface Profile {
  id: number;
  nickname: string;
  username: string;
  createdAt: string;
  updatedAt: string;
  addresses: Address[];
}

const ProfileSettingsComponent: React.FC = () => {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [nickname, setNickname] = useState("");
  const [username, setUsername] = useState("");
  const [addresses, setAddresses] = useState<Address[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await apiClient.get("/settings/profile");
        setProfile(response.data);
        setNickname(response.data.nickname);
        setUsername(response.data.username);
        setAddresses(response.data.addresses);
      } catch (error) {
        console.error("프로필 데이터 로딩 오류:", error);
      }
    };

    fetchProfile();
  }, []);

  const handleNicknameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNickname(e.target.value);
  };

  const handleUsernameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUsername(e.target.value);
  };

  const handleSubmit = async () => {
    const updatedProfileData = {
      nickname,
      username,
    };

    try {
      const response = await apiClient.patch(
        "/settings/profile",
        updatedProfileData
      );

      alert("프로필 수정이 완료되었습니다.");
      setProfile(response.data);
    } catch (error: any) {
      console.error("프로필 수정 오류:", error);
      let errorMessage = "프로필 수정 중 오류가 발생했습니다.";

      if (error.response && error.response.data) {
        const { error: serverError } = error.response.data;
        errorMessage = `${serverError}`;
      }

      alert(errorMessage);
    }
  };

  const handleAddressButtonClick = () => {
    navigate("/settings/profile/address");
  };

  if (!profile) {
    return <div>로딩 중...</div>;
  }

  return (
    <div>
      <div className="profile-settings">
        <h2>프로필 수정</h2>
        <form>
          <h3>프로필 이미지 수정</h3>
          <div>
            <div
              className="imgContainer"
              style={{
                width: "200px",
                height: "200px",
                backgroundColor: "#d2d2d2",
                margin: "20px 0",
                textAlign: "center",
              }}
            >
              {/* 이미지 들어갈 자리 */}
            </div>
            <button
              type="submit"
              style={{
                padding: "10px 20px",
                backgroundColor: "#7DB26B",
                color: "white",
                textDecoration: "none",
                border: "none",
                borderRadius: "5px",
                cursor: "pointer",
                fontWeight: "600",
                margin: "0 20px",
                marginBottom: "30px",
              }}
            >
              프로필 이미지 설정
            </button>
          </div>
        </form>
        <hr></hr>
        <form onSubmit={(e) => e.preventDefault()}>
          <div>
            <h3 style={{ marginBottom: "10px" }}>정보 수정</h3>
            <label htmlFor="nickname">닉네임</label>
            <input
              type="text"
              id="nickname"
              value={nickname}
              onChange={handleNicknameChange}
            />
          </div>
          <div>
            <label htmlFor="username">사용자명</label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={handleUsernameChange}
            />
          </div>
          <button
            type="submit"
            onClick={handleSubmit}
            style={{
              padding: "10px 20px",
              backgroundColor: "#7DB26B",
              color: "white",
              textDecoration: "none",
              border: "none",
              borderRadius: "5px",
              cursor: "pointer",
              fontWeight: "600",
              marginTop: "20px",
            }}
          >
            프로필 수정 완료
          </button>
        </form>
      </div>
      <div
        style={{
          width: "650px",
          margin: "0 auto",
          display: "flex",
          justifyContent: "end",
        }}
      >
        <button
          onClick={handleAddressButtonClick}
          style={{
            padding: "10px 20px",
            backgroundColor: "#7DB26B",
            color: "white",
            textDecoration: "none",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
            fontWeight: "600",
            marginTop: "20px",
          }}
        >
          주소 설정하러 가기 {">"}
        </button>
      </div>
    </div>
  );
};

export default ProfileSettingsComponent;

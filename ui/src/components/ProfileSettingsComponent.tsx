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
  profileimage: string;
}

const ProfileSettingsComponent: React.FC = () => {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [nickname, setNickname] = useState("");
  const [username, setUsername] = useState("");
  const [profileImage, setProfileImage] = useState<File | null>(null);
  const [profileImagePreview, setProfileImagePreview] = useState<string | null>(
    null
  );
  const [addresses, setAddresses] = useState<Address[]>([]);
  const navigate = useNavigate();

  const apiBaseUrl = process.env.REACT_APP_API_BASE_URL;

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await apiClient.get("/settings/profile");
        setProfile(response.data);
        setNickname(response.data.nickname);
        setUsername(response.data.username);
        setAddresses(response.data.addresses);
        setProfileImagePreview(`${apiBaseUrl}/${response.data.profileimage}`);
      } catch (error) {
        console.error("프로필 데이터 로딩 오류:", error);
      }
    };

    fetchProfile();
  }, [apiBaseUrl]);

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

  const handleNicknameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNickname(e.target.value);
  };

  const handleUsernameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUsername(e.target.value);
  };

  const handleProfileImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      setProfileImage(file);

      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleProfileImageSubmit = async () => {
    if (!profileImage) {
      alert("이미지를 선택해주세요.");
      return;
    }

    const formData = new FormData();
    formData.append("file", profileImage);

    try {
      const response = await apiClient.patch(
        "/settings/profile/profile-image",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      alert("프로필 이미지가 업데이트되었습니다.");
      setProfile(response.data);
      setProfileImagePreview(`${apiBaseUrl}/${response.data.profileimage}`);
    } catch (error: any) {
      console.error("프로필 이미지 업데이트 오류:", error);
      let errorMessage = "프로필 이미지 업데이트 중 오류가 발생했습니다.";

      if (error.response && error.response.data) {
        const { error: serverError } = error.response.data;
        errorMessage = `${serverError}`;
      }

      alert(errorMessage);
    }
  };

  const handleDeleteProfileImage = async () => {
    try {
      await apiClient.delete("/settings/profile/profile-image");

      alert("프로필 이미지가 삭제되었습니다.");
      setProfile((prevProfile) => ({
        ...prevProfile!,
        profileimage: "",
      }));
      setProfileImagePreview(null); // 이미지 미리 보기 상태 초기화
    } catch (error: any) {
      console.error("프로필 이미지 삭제 오류:", error);
      let errorMessage = "프로필 이미지 삭제 중 오류가 발생했습니다.";

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
        <form
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <h3>프로필 이미지 설정</h3>
          <div
            className="imgContainer"
            style={{
              width: "200px",
              height: "200px",
              backgroundColor: "#d2d2d2",
              marginTop: "20px",
              textAlign: "center",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {profileImagePreview ? (
              <img
                src={profileImagePreview}
                alt="프로필 이미지"
                style={{ maxWidth: "100%", maxHeight: "100%" }}
              />
            ) : (
              "이미지 없음"
            )}
          </div>
          <div style={{ textAlign: "center" }}>
            {profile.profileimage && (
              <button
                type="button"
                className="deleteButton"
                onClick={handleDeleteProfileImage}
                style={{
                  color: "red",
                  fontSize: "14px",
                  cursor: "pointer",
                  border: "none",
                  backgroundColor: "transparent",
                  marginBottom: "20px",
                }}
              >
                프로필 이미지 삭제
              </button>
            )}
            <br></br>
            <input
              type="file"
              onChange={handleProfileImageChange}
              accept="image/*"
              id="profileImageInput"
            />
            <br />
            <button
              type="button"
              onClick={handleProfileImageSubmit}
              className="profileButton"
              style={{
                padding: "10px 20px",
                backgroundColor: "#7DB26B",
                color: "white",
                textDecoration: "none",
                borderRadius: "5px",
                cursor: "pointer",
                fontWeight: "600",
                border: "none",
              }}
            >
              프로필 이미지 설정
            </button>
          </div>
        </form>

        <hr />
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

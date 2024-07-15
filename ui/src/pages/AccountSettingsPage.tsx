import React, { useContext, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Header from "../components/Header";
import { AuthContext } from "../contexts/AuthContext";
import apiClient from "../utils/apiClient";

interface Address {
  id: number;
  city: string;
  district: string;
}

interface UserAccount {
  id: number;
  email: string;
  username: string;
  nickname: string;
  updatedAt: string;
  addresses: Address[];
}

const AccountSettingsPage: React.FC = () => {
  const [accountInfo, setAccountInfo] = useState<UserAccount | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const { logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/articles");
  };

  useEffect(() => {
    const fetchAccountInfo = async () => {
      try {
        const response = await apiClient.get("/settings/account");
        setAccountInfo(response.data);
        setLoading(false);
      } catch (error) {
        setError("Failed to fetch account information");
        setLoading(false);
      }
    };

    fetchAccountInfo();
  }, []);

  const handleDeleteAccount = async () => {
    const confirmDelete = window.confirm("계정을 정말로 삭제하시겠습니까?");
    if (confirmDelete) {
      try {
        await apiClient.patch("/settings/account/delete-user");
        alert("계정이 성공적으로 삭제되었습니다.");
        handleLogout(); // 계정 삭제 후 로그아웃 및 페이지 이동
      } catch (error) {
        alert("계정 삭제에 실패하였습니다.");
      }
    }
  };

  if (loading) {
    return (
      <div>
        <Header />
        <div
          style={{
            width: "100%",
            height: "100px",
          }}
        ></div>
        <div
          style={{
            maxWidth: "480px",
            margin: "0 auto",
            border: "1px solid #e5e5e5",
            borderRadius: "10px",
            padding: "10px",
            textAlign: "center",
          }}
        >
          Loading...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div>
        <Header />
        <div
          style={{
            width: "100%",
            height: "100px",
          }}
        ></div>
        <div
          style={{
            maxWidth: "480px",
            margin: "0 auto",
            border: "1px solid #e5e5e5",
            borderRadius: "10px",
            padding: "10px",
            textAlign: "center",
            color: "red",
          }}
        >
          {error}
        </div>
      </div>
    );
  }

  return (
    <div>
      <Header />
      <div
        style={{
          width: "100%",
          height: "100px",
        }}
      ></div>
      <div
        style={{
          maxWidth: "480px",
          margin: "0 auto",
          border: "1px solid #e5e5e5",
          borderRadius: "10px",
          padding: "10px",
        }}
      >
        <div>
          {" "}
          <div
            style={{
              textDecoration: "none",
              fontSize: "20px",
              fontWeight: "bold",
              border: "none",
              borderRadius: "5px",
              color: "#3A3A3A",
              display: "block",
              cursor: "default",
            }}
          >
            이메일
          </div>
          <div style={{ marginBottom: "10px" }}>
            <small> {accountInfo?.email}</small>
          </div>
        </div>

        <Link
          to="/settings/account/password"
          style={{
            textDecoration: "none",
            fontSize: "20px",
            fontWeight: "bold",
            border: "none",
            borderRadius: "5px",
            color: "#3A3A3A",
            cursor: "pointer",
            marginBottom: "10px",
            display: "block",
          }}
        >
          비밀번호 변경
        </Link>
        <button
          onClick={handleDeleteAccount}
          style={{
            textDecoration: "none",
            color: "#FF6347",
            display: "inline-block",
            textAlign: "center",
            border: "none",
            background: "none",
            cursor: "pointer",
            fontSize: "20px",
            fontWeight: "600",
            margin: "0",
            padding: "0",
          }}
        >
          계정탈퇴
        </button>
      </div>
    </div>
  );
};

export default AccountSettingsPage;

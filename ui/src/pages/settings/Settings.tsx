import React, { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import Header from "../../components/Header";
import { AuthContext } from "../../contexts/AuthContext";

const Settings: React.FC = () => {
  const { logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/articles");
  };

  return (
    <div>
      <Header />
      <div
        style={{
          maxWidth: "480px",
          margin: "0 auto",
          marginTop: "10px",
          border: "1px solid #e5e5e5",
          borderRadius: "10px",
          padding: "10px",
        }}
      >
        <Link
          to="/settings/profile"
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
          프로필 설정
        </Link>
        <Link
          to="/settings/account"
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
          계정 설정
        </Link>
        <button
          onClick={handleLogout}
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
          로그아웃
        </button>
      </div>
    </div>
  );
};

export default Settings;

import React, { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../contexts/AuthContext";

const Header: React.FC = () => {
  const { userId, isLoggedIn, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/articles");
  };

  return (
    <header
      style={{
        maxWidth: "100%",
        height: "70px",
        backgroundColor: "#ffffff",
        boxShadow: "0 1px 4px rgba(0, 0, 0, 0.1)",
      }}
    >
      <div
        style={{
          maxWidth: "840px",
          height: "100%", // 헤더의 높이와 맞춤
          margin: "0 auto",
          display: "flex",
          alignItems: "center",
          padding: "0 20px",
          justifyContent: "space-between",
        }}
      >
        <h2 style={{ margin: 0 }}>
          {" "}
          {/* h2 태그의 margin을 0으로 설정 */}
          <Link
            to="/articles"
            style={{ textDecoration: "none", color: "#7DB26B" }}
          >
            RentEase
          </Link>
        </h2>
        <div>
          {isLoggedIn ? (
            <>
              <Link
                to={`/users/${userId}`}
                style={{
                  textDecoration: "none",
                  color: "#7DB26B",
                  display: "inline-block",
                  width: "100px",
                  height: "30px",
                  textAlign: "center",
                  marginRight: "10px",
                }}
              >
                마이페이지
              </Link>
              <Link
                to="/settings"
                style={{
                  textDecoration: "none",
                  color: "#7DB26B",
                  display: "inline-block",
                  width: "100px",
                  height: "30px",
                  textAlign: "center",
                  marginRight: "10px",
                }}
              >
                설정
              </Link>
              <button
                onClick={handleLogout}
                style={{
                  textDecoration: "none",
                  color: "#7DB26B",
                  display: "inline-block",
                  width: "80px",
                  height: "30px",
                  textAlign: "center",
                  border: "none",
                  background: "none",
                  cursor: "pointer",
                  fontSize: "16px",
                }}
              >
                로그아웃
              </button>
            </>
          ) : (
            <>
              <Link
                to="/auth/register"
                style={{
                  textDecoration: "none",
                  color: "#7DB26B",
                  display: "inline-block",
                  width: "80px",
                  height: "30px",
                  textAlign: "center",
                  marginRight: "10px",
                }}
              >
                회원가입
              </Link>
              <Link
                to="/auth/login"
                style={{
                  textDecoration: "none",
                  fontWeight: "600",
                  color: "#ffffff",
                  display: "inline-block",
                  width: "78px",
                  height: "28px",
                  textAlign: "center",
                  paddingTop: "2px",
                  border: "1px solid #7DB26B",
                  borderRadius: "10px",
                  backgroundColor: "#7DB26B",
                }}
              >
                로그인
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;

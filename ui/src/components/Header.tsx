import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../contexts/AuthContext";

const Header: React.FC = () => {
  const { userId, isLoggedIn } = useContext(AuthContext);

  return (
    <header
      style={{
        width: "100vw",
        height: "70px",
        position: "fixed",
        margin: "0",
        boxShadow: "0 1px 4px rgba(0, 0, 0, 0.1)",
        backgroundColor: "#fdfdfd",
      }}
    >
      <div
        style={{
          width: "840px",
          height: "100%",
          margin: "0 auto",
          display: "flex",
          alignItems: "center",
          padding: "0 20px",
          justifyContent: "space-between",
        }}
      >
        <h2 style={{ margin: 0 }}>
          {" "}
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
                  height: "30px",
                  textAlign: "center",
                  marginRight: "30px",
                  fontWeight: "600",
                  marginTop: "10px",
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

                  height: "30px",
                  textAlign: "center",
                  fontWeight: "600",
                }}
              >
                설정
              </Link>
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
                  fontWeight: "600",
                  marginTop: "10px",
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

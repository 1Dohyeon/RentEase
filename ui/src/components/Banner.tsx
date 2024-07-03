import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../contexts/AuthContext";

const Banner: React.FC = () => {
  const { isLoggedIn } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleWriteButtonClick = () => {
    if (isLoggedIn) {
      navigate("/articles/write");
    } else {
      const confirmLogin = window.confirm(
        "로그인 후에 이용할 수 있습니다. 로그인 페이지로 이동하시겠습니까?"
      );
      if (confirmLogin) {
        navigate("/auth/login");
      }
    }
  };

  return (
    <div
      style={{
        width: "100%",
        height: "300px",
        backgroundColor: "#d2d2d2",
        position: "relative",
      }}
    >
      <div
        style={{
          maxWidth: "840px",
          margin: "0 auto",
          position: "absolute",
          bottom: "20px",
          display: "flex",
          justifyContent: "center",
          width: "100%",
        }}
      >
        <button
          onClick={handleWriteButtonClick}
          style={{
            padding: "10px 20px",
            backgroundColor: "#7DB26B",
            color: "white",
            textDecoration: "none",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
            fontWeight: "600",
          }}
        >
          게시글 작성
        </button>
      </div>
    </div>
  );
};

export default Banner;

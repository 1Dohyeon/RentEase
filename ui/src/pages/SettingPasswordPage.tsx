import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import apiClient from "../utils/apiClient";

const SettingPasswordPage: React.FC = () => {
  const navigate = useNavigate();
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [error, setError] = useState("");

  const handlePasswordChange = () => {
    if (oldPassword === "" || newPassword === "") {
      setError("모든 필드를 입력해주세요.");
      return;
    }

    const confirmChange = window.confirm("비밀번호를 변경하시겠습니까?");

    if (!confirmChange) {
      return; // 변경 취소
    }

    const requestData = {
      oldPassword: oldPassword,
      newPassword: newPassword,
    };

    apiClient
      .patch("/settings/account/password", requestData)
      .then((response) => {
        // 패스워드 변경 성공 시 처리
        console.log("비밀번호 변경 성공:", response.data);
        alert("비밀번호가 성공적으로 변경되었습니다.");
        navigate("/"); // 변경 후 메인 페이지로 이동 또는 다른 페이지로 리다이렉트
      })
      .catch((error) => {
        // 패스워드 변경 실패 시 처리
        console.error("비밀번호 변경 실패:", error);
        let errorMessage = "비밀번호 변경 중 오류가 발생했습니다.";

        if (error.response && error.response.data) {
          const { message } = error.response.data;
          errorMessage = message; // 서버에서 반환하는 오류 메시지
        }

        setError(errorMessage);
      });
  };

  return (
    <div>
      <Header />
      <div style={{ width: "100%", height: "100px" }}></div>
      <div
        style={{
          maxWidth: "420px",
          margin: "0 auto",
          border: "1px solid #e5e5e5",
          borderRadius: "10px",
          padding: "20px",
        }}
      >
        <h2 style={{ marginBottom: "20px", textAlign: "center" }}>
          패스워드 변경
        </h2>
        {error && <p style={{ color: "red" }}>{error}</p>}
        <div style={{ marginBottom: "20px" }}>
          <p>기존 비밀번호</p>
          <input
            type="password"
            value={oldPassword}
            onChange={(e) => setOldPassword(e.target.value)}
            style={{ width: "100%", height: "40px", borderRadius: "15px" }}
          />
        </div>
        <div style={{ marginBottom: "20px" }}>
          <p>새 비밀번호</p>
          <input
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            style={{ width: "100%", height: "40px", borderRadius: "15px" }}
          />
        </div>
        <button
          onClick={handlePasswordChange}
          style={{
            padding: "10px 20px",
            backgroundColor: "#7DB26B",
            color: "white",
            textDecoration: "none",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
            fontWeight: "600",
            marginRight: "20px",
          }}
        >
          변경하기
        </button>
      </div>
    </div>
  );
};

export default SettingPasswordPage;

import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../../components/Header";

const Register: React.FC = () => {
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [nickname, setNickname] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [isPasswordMatch, setIsPasswordMatch] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const apiBaseUrl = process.env.REACT_APP_API_BASE_URL;

  useEffect(() => {
    setIsPasswordMatch(password === passwordConfirm);
  }, [password, passwordConfirm]);

  const handleEmailChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(event.target.value);
  };

  const handleUsernameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setUsername(event.target.value);
  };

  const handleNicknameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setNickname(event.target.value);
  };

  const handlePasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(event.target.value);
  };

  const handlePasswordConfirmChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setPasswordConfirm(event.target.value);
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!isPasswordMatch) {
      return;
    }
    setError(null);

    try {
      const response = await axios.post(`${apiBaseUrl}/auth/register`, {
        email,
        username,
        nickname,
        password,
      });

      const { nickname: registeredNickname } = response.data;

      // 회원가입 성공 시, 로그인 페이지로 이동
      navigate("/auth/login", { state: { nickname: registeredNickname } });
    } catch (err: any) {
      if (err.response) {
        const errorMessage = err.response.data.message;
        setError(errorMessage);
      } else {
        setError("회원가입 중 오류가 발생했습니다.");
      }
    }
  };

  return (
    <div>
      <Header />
      <div
        style={{
          width: "480px",
          margin: "0 auto",
        }}
      >
        <h2
          style={{
            textAlign: "center",
            padding: "10px",
            paddingTop: "100px",
            color: "#3A3A3A",
          }}
        >
          회원가입
        </h2>
        <form
          onSubmit={handleSubmit}
          style={{
            width: "353px",
            margin: "0 auto",
          }}
        >
          <div style={{ padding: "5px 0px" }}>
            <label htmlFor="email" style={{ display: "block" }}>
              이메일
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={handleEmailChange}
              required
              style={{
                width: "353px",
                height: "40px",
                borderRadius: "10px",
                border: "1px solid",
              }}
            />
          </div>
          <div style={{ padding: "5px 0px" }}>
            <label htmlFor="username" style={{ display: "block" }}>
              이름
            </label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={handleUsernameChange}
              required
              style={{
                width: "353px",
                height: "40px",
                borderRadius: "10px",
                border: "1px solid",
              }}
            />
          </div>
          <div style={{ padding: "5px 0px" }}>
            <label htmlFor="nickname" style={{ display: "block" }}>
              닉네임
            </label>
            <input
              type="text"
              id="nickname"
              value={nickname}
              onChange={handleNicknameChange}
              required
              style={{
                width: "353px",
                height: "40px",
                borderRadius: "10px",
                border: "1px solid",
              }}
            />
          </div>
          <div style={{ padding: "5px 0px" }}>
            <label htmlFor="password" style={{ display: "block" }}>
              비밀번호
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={handlePasswordChange}
              required
              style={{
                width: "353px",
                height: "40px",
                borderRadius: "10px",
                border: "1px solid",
              }}
            />
          </div>
          <div style={{ padding: "5px 0px" }}>
            <label htmlFor="passwordConfirm" style={{ display: "block" }}>
              비밀번호 확인
            </label>
            <input
              type="password"
              id="passwordConfirm"
              value={passwordConfirm}
              onChange={handlePasswordConfirmChange}
              required
              style={{
                width: "353px",
                height: "40px",
                borderRadius: "10px",
                border: "1px solid",
              }}
            />
          </div>
          {!isPasswordMatch && (
            <p style={{ color: "red" }}>Passwords do not match</p>
          )}
          {error && <p style={{ color: "red" }}>{error}</p>}
          <button
            type="submit"
            disabled={!isPasswordMatch}
            style={{
              cursor: "pointer",
              margin: "10px 0px",
              backgroundColor: "#7DB26B",
              width: "360px",
              height: "40px",
              borderRadius: "20px",
              border: "none",
              color: "#fdfdfd",
              fontSize: "16px",
              fontWeight: "600",
            }}
          >
            회원가입
          </button>
        </form>
      </div>
    </div>
  );
};

export default Register;

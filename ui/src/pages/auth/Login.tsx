import axios from "axios";
import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../../components/Header";
import { AuthContext } from "../../contexts/AuthContext";

const Login: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);

  const apiBaseUrl = process.env.REACT_APP_API_BASE_URL;

  const handleEmailChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(event.target.value);
  };

  const handlePasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(event.target.value);
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);

    try {
      const response = await axios.post(
        `${apiBaseUrl}/auth/login`,
        {
          email,
          password,
        },
        { withCredentials: true }
      );
      const { jwt, loginUser } = response.data;
      login(loginUser.nickname, loginUser.id, jwt); // AuthProvider의 login 함수 호출

      // 성공적으로 로그인된 경우, /articles로 이동
      navigate("/articles");
    } catch (err: any) {
      if (err.response) {
        const errorMessage = err.response.data.message;
        setError(
          Array.isArray(errorMessage) ? errorMessage.join(", ") : errorMessage
        );
      } else {
        setError("로그인 중 오류가 발생했습니다.");
      }
    }
  };

  return (
    <div>
      <Header />
      <div style={{ width: "480px", margin: "0 auto" }}>
        <h2
          style={{
            textAlign: "center",
            padding: "10px",
            paddingTop: "100px",
            color: "#3A3A3A",
          }}
        >
          로그인
        </h2>
        <form
          onSubmit={handleSubmit}
          style={{ width: "353px", margin: "0 auto" }}
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
          {error && <div style={{ color: "red" }}>{error}</div>}
          <button
            type="submit"
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
            로그인
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;

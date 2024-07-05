import axios from "axios";
import React, { ReactNode, createContext, useEffect, useState } from "react";

interface AuthContextType {
  userId: number | null;
  setUserId: (userId: number | null) => void;
  nickname: string | null;
  setNickname: (nickname: string | null) => void;
  isLoggedIn: boolean;
  login: (nickname: string, userId: number, jwt: string) => void;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType>({
  userId: null,
  setUserId: () => {},
  nickname: null,
  setNickname: () => {},
  isLoggedIn: false,
  login: () => {},
  logout: () => {},
});

const apiClient = axios.create({
  baseURL: process.env.REACT_APP_API_BASE_URL,
});

export const AuthProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [nickname, setNickname] = useState<string | null>(null);
  const [userId, setUserId] = useState<number | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);

  useEffect(() => {
    const token = sessionStorage.getItem("jwt");
    const storedUserId = sessionStorage.getItem("userId"); // 세션 스토리지에서 userId 가져오기
    if (token && storedUserId) {
      // 토큰이 있을 경우 로그인 상태를 유지합니다.
      setIsLoggedIn(true);
      setUserId(Number(storedUserId)); // userId를 세션 스토리지에서 가져와 설정
    } else {
      setIsLoggedIn(false);
    }
  }, []);

  const login = (nickname: string, userId: number, jwt: string) => {
    // 세션 스토리지에 jwt와 userId 저장
    sessionStorage.setItem("jwt", jwt);
    sessionStorage.setItem("userId", userId.toString());
    setNickname(nickname);
    setUserId(userId);
    setIsLoggedIn(true);
  };

  const logout = () => {
    setNickname(null);
    setUserId(null);
    setIsLoggedIn(false);
    // 세션 스토리지에서 jwt와 userId 삭제
    sessionStorage.removeItem("jwt");
    sessionStorage.removeItem("userId");
  };

  return (
    <AuthContext.Provider
      value={{
        nickname,
        setNickname,
        userId,
        setUserId,
        isLoggedIn,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

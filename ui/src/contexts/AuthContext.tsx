import React, { ReactNode, createContext, useEffect, useState } from "react";

interface AuthContextType {
  userId: number | null;
  setUserId: (userId: number | null) => void;
  nickname: string | null;
  setNickname: (nickname: string | null) => void;
  profileimage: string | null;
  setProfileimage: (profileImage: string | null) => void;
  isLoggedIn: boolean;
  login: (
    userId: number,
    nickname: string,
    profileImage: string,
    jwt: string
  ) => void;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType>({
  userId: null,
  setUserId: () => {},
  nickname: null,
  setNickname: () => {},
  profileimage: null,
  setProfileimage: () => {},
  isLoggedIn: false,
  login: () => {},
  logout: () => {},
});

export const AuthProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [nickname, setNickname] = useState<string | null>(null);
  const [userId, setUserId] = useState<number | null>(null);
  const [profileimage, setProfileimage] = useState<string | null>(null); // profileImage 상태 추가
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);

  useEffect(() => {
    const token = sessionStorage.getItem("jwt");
    const storedUserId = sessionStorage.getItem("userId");
    const storedProfileImage = sessionStorage.getItem("profileImage"); // profileImage 불러오기
    if (token && storedUserId) {
      setIsLoggedIn(true);
      setUserId(Number(storedUserId));
      setProfileimage(storedProfileImage); // profileImage 설정
    } else {
      setIsLoggedIn(false);
    }
  }, []);

  const login = (
    userId: number,
    nickname: string,
    profileImage: string,
    jwt: string
  ) => {
    sessionStorage.setItem("jwt", jwt);
    sessionStorage.setItem("userId", userId.toString());
    sessionStorage.setItem("profileImage", profileImage); // profileImage 세션에 저장
    setNickname(nickname);
    setUserId(userId);
    setProfileimage(profileImage); // profileImage 설정
    setIsLoggedIn(true);
  };

  const logout = () => {
    setNickname(null);
    setUserId(null);
    setProfileimage(null); // 로그아웃 시 profileImage도 초기화
    setIsLoggedIn(false);
    sessionStorage.removeItem("jwt");
    sessionStorage.removeItem("userId");
    sessionStorage.removeItem("profileImage"); // profileImage 세션에서 삭제
  };

  return (
    <AuthContext.Provider
      value={{
        nickname,
        setNickname,
        userId,
        setUserId,
        profileimage, // profileImage 추가
        setProfileimage,
        isLoggedIn,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

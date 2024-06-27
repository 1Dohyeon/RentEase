import React, { ReactNode, createContext, useState } from "react";

interface AuthContextType {
  userId: number | null;
  setUserId: (userId: number | null) => void;

  nickname: string | null;
  setNickname: (nickname: string | null) => void;

  isLoggedIn: boolean;
  login: (nickname: string, userId: number) => void;
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

export const AuthProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [nickname, setNickname] = useState<string | null>(null);
  const [userId, setUserId] = useState<number | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);

  const login = (nickname: string, userId: number) => {
    setNickname(nickname);
    setUserId(userId);
    setIsLoggedIn(true);
  };

  const logout = () => {
    setNickname(null);
    setUserId(null);
    setIsLoggedIn(false);
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

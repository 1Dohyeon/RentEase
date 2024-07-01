import React from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import ArticleDetailPage from "./pages/ArticleDetailPage";
import ArticlesPage from "./pages/ArticlesPage";
import MyPage from "./pages/MyPage";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import Settings from "./pages/settings/Settings";

const App: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/articles" />} />
      <Route path="/articles" element={<ArticlesPage />} />
      <Route path="/articles/:id" element={<ArticleDetailPage />} />
      <Route path="/auth/login" element={<Login />} />
      <Route path="/auth/register" element={<Register />} />
      <Route path="/users/:userId" element={<MyPage />} />
      <Route path="/settings" element={<Settings />} />
    </Routes>
  );
};

export default App;

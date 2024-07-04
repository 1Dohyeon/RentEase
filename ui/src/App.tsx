import React from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import ArticleDetailPage from "./pages/ArticleDetailPage";
import ArticleEditPage from "./pages/ArticleEditPage";
import ArticleWritePage from "./pages/ArticleWrtiePage";
import ArticlesPage from "./pages/ArticlesPage";
import CategoryArticlesPage from "./pages/CategoryArticlePage";
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
      <Route path="/articles/write" element={<ArticleWritePage />} />
      <Route path="/articles/edit/:id" element={<ArticleEditPage />} />
      <Route path="/auth/login" element={<Login />} />
      <Route path="/auth/register" element={<Register />} />
      <Route path="/users/:userId" element={<MyPage />} />
      <Route path="/settings" element={<Settings />} />
      <Route path="/articles/category" element={<CategoryArticlesPage />} />
    </Routes>
  );
};

export default App;

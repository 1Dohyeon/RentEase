import React from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import AccountSettingsPage from "./pages/AccountSettingsPage";
import AddressSettingsPage from "./pages/AddressSettingsPage";
import ArticleDetailPage from "./pages/ArticleDetailPage";
import ArticleEditImageSettingPage from "./pages/ArticleEditImageSettingPage";
import ArticleEditPage from "./pages/ArticleEditPage";
import ArticleImageSettingPage from "./pages/ArticleImageSettingPage";
import ArticleWritePage from "./pages/ArticleWrtiePage";
import ArticlesPage from "./pages/ArticlesPage";
import CategoryArticlesPage from "./pages/CategoryArticlePage";
import MyPage from "./pages/MyPage";
import ProfileSettingsPage from "./pages/ProfileSettingsPage";
import SettingPasswordPage from "./pages/SettingPasswordPage";
import UserChatroomPage from "./pages/UserChatroomPage";
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
      <Route
        path="/articles/write/:articleId/main-image"
        element={<ArticleImageSettingPage />}
      />
      <Route path="/articles/edit/:articleId" element={<ArticleEditPage />} />
      <Route
        path="/articles/edit/:articleId/main-image"
        element={<ArticleEditImageSettingPage />}
      />
      <Route path="/auth/login" element={<Login />} />
      <Route path="/auth/register" element={<Register />} />
      <Route path="/users/:userId" element={<MyPage />} />
      <Route path="/users/:userId/chattings" element={<UserChatroomPage />} />
      <Route path="/settings" element={<Settings />} />
      <Route path="/articles/category" element={<CategoryArticlesPage />} />
      <Route path="/settings/profile" element={<ProfileSettingsPage />} />
      <Route
        path="/settings/profile/address"
        element={<AddressSettingsPage />}
      />
      <Route path="/settings/account" element={<AccountSettingsPage />} />
      <Route
        path="/settings/account/password"
        element={<SettingPasswordPage />}
      />
    </Routes>
  );
};

export default App;

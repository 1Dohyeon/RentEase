import React from "react";
import Header from "../components/Header";
import SettingArticleImageFormComponent from "../components/SettingArticleImageFormComponent";

const ArticleImageSettingPage: React.FC = () => {
  return (
    <div>
      <Header />
      <div style={{ width: "100%", height: "70px" }}></div>
      <div style={{ width: "600px", margin: "0 auto" }}>
        <SettingArticleImageFormComponent />
      </div>
    </div>
  );
};

export default ArticleImageSettingPage;

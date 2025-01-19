import React from "react";
import Header from "../components/Header";
import SettingEditArticleImageFormComponent from "../components/SettingEditArticleImageFormComponent";

const ArticleEditImageSettingPage: React.FC = () => {
  return (
    <div>
      <Header />
      <div style={{ width: "100%", height: "70px" }}></div>
      <div style={{ width: "600px", margin: "0 auto" }}>
        <SettingEditArticleImageFormComponent />
      </div>
    </div>
  );
};

export default ArticleEditImageSettingPage;

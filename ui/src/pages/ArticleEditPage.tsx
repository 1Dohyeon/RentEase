import React from "react";
import EditArticleFormComponent from "../components/EditArticleFormComponent";
import Header from "../components/Header";

const ArticleEditPage: React.FC = () => {
  return (
    <div>
      <Header />
      <div style={{ width: "100%", height: "100px" }}></div>
      <div style={{ width: "600px", margin: "0 auto" }}>
        <EditArticleFormComponent />
      </div>
    </div>
  );
};

export default ArticleEditPage;

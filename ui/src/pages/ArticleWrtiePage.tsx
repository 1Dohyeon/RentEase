import React from "react";
import Header from "../components/Header";
import WriteArticleFormComponent from "../components/WrtieArticleFormComponent";

const ArticleWritePage: React.FC = () => {
  return (
    <div>
      <Header />
      <div style={{ width: "100%", height: "100px" }}></div>
      <div style={{ width: "600px", margin: "0 auto" }}>
        <WriteArticleFormComponent />
      </div>
    </div>
  );
};

export default ArticleWritePage;

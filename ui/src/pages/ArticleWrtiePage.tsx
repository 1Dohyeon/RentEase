import React from "react";
import Header from "../components/Header";

const ArticleWritePage: React.FC = () => {
  return (
    <div>
      <Header />
      <div
        style={{
          width: "100%",
          height: "70px",
        }}
      ></div>
      <h1>게시글 작성</h1>
      {/* 게시글 작성 폼 */}
    </div>
  );
};

export default ArticleWritePage;

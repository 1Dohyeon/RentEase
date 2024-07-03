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
      <div
        style={{
          width: "840px",
          margin: "0 auto",
        }}
      >
        <h1>게시글 작성</h1>
        {/* 게시글 작성 폼 */}
      </div>
    </div>
  );
};

export default ArticleWritePage;

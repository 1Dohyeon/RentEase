import React from "react";
import ArticlesContainer from "../components/ArticlesContainer";
import Header from "../components/Header";

const ArticlesPage: React.FC = () => {
  return (
    <div>
      <Header />
      <div
        style={{
          maxWidth: "100%",
          margin: "0 auto",
        }}
      >
        <div
          style={{
            width: "100%",
            height: "300px",
            backgroundColor: "#d2d2d2",
            paddingTop: "70px",
          }}
        ></div>
        <ArticlesContainer />
      </div>
    </div>
  );
};

export default ArticlesPage;

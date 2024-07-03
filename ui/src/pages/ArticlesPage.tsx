import React from "react";
import ArticlesContainer from "../components/ArticlesContainer";
import Banner from "../components/Banner";
import Header from "../components/Header";

const ArticlesPage: React.FC = () => {
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
          maxWidth: "100%",
          margin: "0 auto",
        }}
      >
        <Banner />
        <ArticlesContainer />
      </div>
    </div>
  );
};

export default ArticlesPage;

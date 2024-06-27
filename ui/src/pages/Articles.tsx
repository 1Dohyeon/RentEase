import React from "react";
import Header from "../components/Header";

const Articles: React.FC = () => {
  return (
    <div>
      <Header />
      <div
        style={{
          maxWidth: "840px",
          margin: "0 auto",
        }}
      >
        <div
          style={{
            width: "100%",
            height: "250px",
            backgroundColor: "#d2d2d2",
          }}
        ></div>
      </div>
    </div>
  );
};

export default Articles;

import React, { useState } from "react";
import ArticlesContainer from "../components/ArticlesContainer";
import Banner from "../components/Banner";
import CategoriesList from "../components/CategoriesList";
import Header from "../components/Header";

const ArticlesPage: React.FC = () => {
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(
    null
  );

  const handleCategoryClick = (categoryId: number) => {
    setSelectedCategoryId(categoryId);
  };

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
        <CategoriesList onCategoryClick={handleCategoryClick} />
        <ArticlesContainer selectedCategoryId={selectedCategoryId} />
      </div>
    </div>
  );
};

export default ArticlesPage;

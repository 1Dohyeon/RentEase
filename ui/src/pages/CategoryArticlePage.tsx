import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import ArticlesContainer from "../components/ArticlesContainer";
import Banner from "../components/Banner";
import CategoriesList from "../components/CategoriesList";
import Header from "../components/Header";

const CategoryArticlesPage: React.FC = () => {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const categoryId = searchParams.get("categoryId");
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(
    categoryId ? parseInt(categoryId) : null
  );

  const handleCategoryClick = (categoryId: number) => {
    setSelectedCategoryId(categoryId);
  };

  useEffect(() => {
    // categoryId가 변경될 때마다 selectedCategoryId 업데이트
    if (categoryId) {
      setSelectedCategoryId(parseInt(categoryId));
    } else {
      setSelectedCategoryId(null);
    }
  }, [categoryId]);

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

export default CategoryArticlesPage;

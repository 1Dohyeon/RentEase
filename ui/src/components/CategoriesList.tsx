import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

interface Category {
  id: number;
  title: string;
}

interface CategoriesListProps {
  onCategoryClick: (categoryId: number) => void;
}

const CategoriesList: React.FC<CategoriesListProps> = ({ onCategoryClick }) => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const listRef = useRef<HTMLUListElement>(null);
  const navigate = useNavigate(); // useNavigate 훅 사용

  const apiBaseUrl = process.env.REACT_APP_API_BASE_URL;

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = () => {
    fetch(`${apiBaseUrl}/categories`)
      .then((response) => response.json())
      .then((data) => {
        setCategories(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching categories:", error);
        setLoading(false);
      });
  };

  const handleCategoryClick = (categoryId: number) => {
    onCategoryClick(categoryId);
    navigate(`/articles/category?categoryId=${categoryId}`); // 카테고리 클릭 시 URL 변경
  };

  const handleScrollLeft = () => {
    if (listRef.current) {
      listRef.current.scrollBy({ left: -200, behavior: "smooth" });
    }
  };

  const handleScrollRight = () => {
    if (listRef.current) {
      listRef.current.scrollBy({ left: 200, behavior: "smooth" });
    }
  };

  if (loading) {
    return <div>Loading categories...</div>;
  }

  return (
    <div
      style={{
        width: "640px",
        margin: "0 auto",
        position: "relative",
        marginTop: "40px",
      }}
    >
      <button
        onClick={handleScrollLeft}
        style={{
          position: "absolute",
          left: "0",
          top: "40%",
          transform: "translateY(-50%)",
          backgroundColor: "transparent",
          border: "none",
          fontSize: "24px",
          cursor: "pointer",
          zIndex: 1,
          color: "#7DB26B",
          fontWeight: "600",
        }}
      >
        {"< "}
      </button>
      <div
        style={{
          overflow: "hidden",
          width: "100%",
        }}
      >
        <ul
          ref={listRef}
          style={{
            listStyleType: "none",
            display: "flex",
            padding: 0,
            margin: 0,
            alignItems: "center",
            justifyContent: "flex-start",
            scrollBehavior: "smooth",
            overflowX: "hidden",
            scrollSnapType: "x mandatory",
          }}
        >
          {categories.map((category) => (
            <li
              key={category.id}
              style={{
                flex: "0 0 auto",
                width: "200px",
                height: "200px",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                marginRight: "15px",
                position: "relative",
                scrollSnapAlign: "start",
              }}
            >
              <div
                key={category.id}
                style={{
                  width: "150px",
                  height: "150px",
                  borderRadius: "50%",
                  backgroundColor: "#c0c0c0",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: "pointer",
                }}
                onClick={() => handleCategoryClick(category.id)}
              >
                <span style={{ textAlign: "center" }}>{category.title}</span>
              </div>
            </li>
          ))}
        </ul>
      </div>
      <button
        onClick={handleScrollRight}
        style={{
          position: "absolute",
          right: "0",
          top: "40%",
          transform: "translateY(-50%)",
          backgroundColor: "transparent",
          border: "none",
          fontSize: "24px",
          cursor: "pointer",
          zIndex: 1,
          color: "#7DB26B",
          fontWeight: "600",
        }}
      >
        {">"}
      </button>
    </div>
  );
};

export default CategoriesList;

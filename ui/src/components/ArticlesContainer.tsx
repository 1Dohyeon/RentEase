import React, { useEffect, useState } from "react";
import apiClient from "../utils/apiClient";
import Article from "./Article";

interface Address {
  id: number;
  city: string;
  district: string;
}

interface Category {
  id: number;
  title: string;
}

interface Author {
  id: number;
  nickname: string;
}

interface ArticleData {
  id: number;
  createdTimeSince: string | null;
  title: string;
  dailyprice: string;
  currency: string;
  addresses: Address[];
  categories: Category[];
  author: Author;
}

interface ArticlesContainerProps {
  selectedCategoryId: number | null;
}

const ArticlesContainer: React.FC<ArticlesContainerProps> = ({
  selectedCategoryId,
}) => {
  const [articles, setArticles] = useState<ArticleData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const apiBaseUrl = process.env.REACT_APP_API_BASE_URL;

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        let api = `${apiBaseUrl}/articles`;
        if (selectedCategoryId !== null) {
          api += `/category?categoryId=${selectedCategoryId}`;
        }
        const response = await apiClient.get<ArticleData[]>(api);
        setArticles(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching articles:", error);
        setLoading(false);
      }
    };

    fetchArticles();
  }, [selectedCategoryId]);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div
      style={{
        maxWidth: "840px",
        margin: "0 auto",
        display: "flex",
        justifyContent: "space-between",
        flexWrap: "wrap",
      }}
    >
      {articles.map((article) => (
        <Article key={article.id} {...article} />
      ))}
    </div>
  );
};

export default ArticlesContainer;

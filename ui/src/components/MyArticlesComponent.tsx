import React, { useEffect, useState } from "react";
import apiClient from "../utils/apiClient";
import Article from "./Article";

interface Address {
  id: number;
  city: string;
  district: string;
}

interface ArticleData {
  id: number;
  title: string;
  dailyprice: string;
  currency: string;
  mainImage?: string;
  addresses: Address[];
}

interface MyArticlesComponentProps {
  userId: number;
}

const MyArticlesComponent: React.FC<MyArticlesComponentProps> = ({
  userId,
}) => {
  const [articles, setArticles] = useState<ArticleData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const apiBaseUrl = process.env.REACT_APP_API_BASE_URL;

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const response = await apiClient.get(
          `${apiBaseUrl}/users/${userId}/articles`
        );
        setArticles(response.data.articles);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching articles:", error);
        setLoading(false);
      }
    };

    fetchArticles();
  }, [userId]);

  if (loading) {
    return <div>Loading articles...</div>;
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
        <Article
          key={article.id}
          id={article.id}
          title={article.title}
          dailyprice={article.dailyprice}
          mainImage={article.mainImage}
          currency={article.currency}
          addresses={article.addresses}
        />
      ))}
    </div>
  );
};

export default MyArticlesComponent;

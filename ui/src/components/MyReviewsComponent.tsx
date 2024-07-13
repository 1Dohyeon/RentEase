import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import apiClient from "../utils/apiClient";
import "./MyReviewsComponent.css"; // CSS 파일 import
import Review from "./Review";

interface ReviewWriter {
  id: number;
  nickname: string;
}

interface ArticleData {
  id: number;
  title: string;
}

interface ReviewData {
  id: number;
  createdTimeSince: string;
  content: string;
  numofstars: number;
  writer: ReviewWriter;
  article: ArticleData;
}

interface MyReviewsComponentProps {
  userId: number;
}

const MyReviewsComponent: React.FC<MyReviewsComponentProps> = ({ userId }) => {
  const [reviews, setReviews] = useState<ReviewData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const apiBaseUrl = process.env.REACT_APP_API_BASE_URL;

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const response = await apiClient.get(
          `${apiBaseUrl}/users/${userId}/reviews`
        );
        setReviews(response.data.reviews);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching reviews:", error);
        setLoading(false);
      }
    };

    fetchReviews();
  }, [userId]);

  if (loading) {
    return <div>Loading reviews...</div>;
  }

  return (
    <div>
      {reviews.map((review) => (
        <div key={review.id} style={{ marginBottom: "20px" }}>
          <Review review={review} />
          <div
            style={{
              marginTop: "10px",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <strong className="ellipsis">게시글: {review.article.title}</strong>
            <Link
              to={`/articles/${review.article.id}`}
              className="article-link"
            >
              게시글로 이동 &gt;
            </Link>
          </div>
        </div>
      ))}
    </div>
  );
};

export default MyReviewsComponent;

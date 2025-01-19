import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import apiClient from "../utils/apiClient";
import MyReviewComponent from "./MyReviewComponent";
import "./MyReviewsComponent.css"; // CSS 파일 import

interface ReviewWriter {
  id: number;
  nickname: string;
  profileimage?: string;
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
    <div style={{ marginTop: "20px" }}>
      {reviews.map((review) => (
        <div
          key={review.id}
          style={{
            marginBottom: "20px",
            borderRadius: "15px",
            border: "1px solid #e5e5e5",
            padding: "10px 20px",
          }}
        >
          <div
            style={{
              width: "90%",
              margin: "0 auto",
              marginTop: "10px",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              borderBottom: "1px solid #e5e5e5",
              padding: "10px 0px",
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
          <MyReviewComponent review={review} />
        </div>
      ))}
    </div>
  );
};

export default MyReviewsComponent;

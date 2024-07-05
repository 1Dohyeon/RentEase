// ReviewsContainer.tsx
import React, { useEffect, useState } from "react";
import apiClient from "../utils/apiClient";
import Review from "./Review";
import StarRating from "./StarRating";

interface ReviewWriter {
  id: number;
  nickname: string;
}

interface ReviewData {
  id: number;
  createdTimeSince: string;
  content: string;
  numofstars: number;
  writer: ReviewWriter;
}

interface ReviewsContainerProps {
  articleId: number;
  avgnumofstars: number;
}

const ReviewsContainer: React.FC<ReviewsContainerProps> = ({
  articleId,
  avgnumofstars,
}) => {
  const [reviews, setReviews] = useState<ReviewData[]>([]);
  const [loading, setLoading] = useState(true);

  const apiBaseUrl = process.env.REACT_APP_API_BASE_URL;

  useEffect(() => {
    fetchReviews();
  }, [articleId]);

  const fetchReviews = () => {
    apiClient
      .get(`${apiBaseUrl}/reviews?articleId=${articleId}`)
      .then((response) => {
        setReviews(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching reviews:", error);
        setLoading(false);
      });
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div style={{ maxWidth: "840px", margin: "0 auto" }}>
      {/* 별점 */}
      <div style={{ fontSize: "20px", display: "flex", alignItems: "center" }}>
        {avgnumofstars === 0 ? (
          <p>아직 후기가 없습니다.</p>
        ) : (
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              width: "100%",
              marginBottom: "20px",
            }}
          >
            <div style={{ display: "flex" }}>
              {" "}
              <span>전체 평점 {avgnumofstars}</span>
              <StarRating rating={avgnumofstars} />
            </div>

            <span style={{ marginLeft: "10px" }}>후기 {reviews.length}개</span>
          </div>
        )}
      </div>
      {reviews.length === 0 ? (
        <p>아직 후기가 없습니다.</p>
      ) : (
        reviews.map((review) => <Review key={review.id} review={review} />)
      )}
    </div>
  );
};

export default ReviewsContainer;

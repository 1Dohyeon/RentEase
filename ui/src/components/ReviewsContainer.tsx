import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../contexts/AuthContext";
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
  const [newReviewContent, setNewReviewContent] = useState("");
  const [newReviewStars, setNewReviewStars] = useState(0);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const { isLoggedIn } = useContext(AuthContext);
  const navigate = useNavigate();

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

  const handleReviewSubmit = () => {
    if (newReviewContent === "" || newReviewStars === 0) {
      alert("별점과 리뷰 내용을 모두 작성해주세요.");
      return;
    }

    const reviewData = {
      content: newReviewContent,
      numofstars: newReviewStars,
    };

    apiClient
      .post(`${apiBaseUrl}/reviews/write?articleId=${articleId}`, reviewData)
      .then(() => {
        fetchReviews();
        setNewReviewContent("");
        setNewReviewStars(0);
        setIsReviewModalOpen(false);
      })
      .catch((error) => {
        console.error("Error submitting review:", error);
      });
  };

  const handleReviewButtonClick = () => {
    if (isLoggedIn) {
      setIsReviewModalOpen(true);
    } else {
      const confirmLogin = window.confirm(
        "로그인을 해주세요. 로그인 페이지로 이동하시겠습니까?"
      );
      if (confirmLogin) {
        navigate("/auth/login");
      }
    }
  };

  const handleStarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewReviewStars(parseInt(e.target.value));
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
              <span>전체 평점 {avgnumofstars}</span>
              <StarRating rating={avgnumofstars} />
            </div>

            <span style={{ marginLeft: "10px" }}>후기 {reviews.length}개</span>
          </div>
        )}
      </div>

      {/* 리뷰 작성 버튼 */}
      <button
        onClick={handleReviewButtonClick}
        style={{
          padding: "10px 20px",
          backgroundColor: "#7DB26B",
          color: "white",
          textDecoration: "none",
          border: "none",
          borderRadius: "5px",
          cursor: "pointer",
          fontWeight: "600",
          marginRight: "20px",
        }}
      >
        리뷰 작성하기
      </button>

      {/* 리뷰 작성 모달 */}
      {isReviewModalOpen && (
        <div
          style={{
            position: "fixed",
            top: "20%",
            left: "50%",
            transform: "translateX(-50%)",
            background: "white",
            padding: "20px",
            boxShadow: "0 0 10px rgba(0,0,0,0.5)",
          }}
        >
          <h3>리뷰 작성</h3>
          <textarea
            value={newReviewContent}
            onChange={(e) => setNewReviewContent(e.target.value)}
            placeholder="리뷰 내용을 작성해주세요"
            style={{ width: "100%", height: "100px", marginBottom: "10px" }}
          />
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginBottom: "10px",
            }}
          >
            {[1, 2, 3, 4, 5].map((star) => (
              <label key={star}>
                <input
                  type="radio"
                  name="rating"
                  value={star}
                  checked={newReviewStars === star}
                  onChange={handleStarChange}
                />
                {star}점
              </label>
            ))}
          </div>
          <button onClick={handleReviewSubmit}>제출</button>
          <button onClick={() => setIsReviewModalOpen(false)}>취소</button>
        </div>
      )}

      {reviews.length === 0 ? (
        <p>아직 후기가 없습니다.</p>
      ) : (
        reviews.map((review) => <Review key={review.id} review={review} />)
      )}
    </div>
  );
};

export default ReviewsContainer;

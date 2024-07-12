import React from "react";
import { useNavigate } from "react-router-dom";
import StarRating from "./StarRating";

interface ReviewWriter {
  id: number;
  nickname: string;
}

interface ReviewProps {
  review: {
    id: number;
    createdTimeSince: string;
    content: string;
    numofstars: number;
    writer: ReviewWriter;
  };
}

const Review: React.FC<ReviewProps> = ({ review }) => {
  const navigate = useNavigate();

  const handleNicknameClick = () => {
    navigate(`/users/${review.writer.id}`);
  };

  return (
    <div style={{ padding: "20px 0" }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "5px",
        }}
      >
        <div
          onClick={handleNicknameClick}
          style={{ display: "flex", alignItems: "center", cursor: "pointer" }}
        >
          <div
            style={{
              width: "30px",
              height: "30px",
              backgroundColor: "#d2d2d2",
              marginRight: "5px",
              borderRadius: "15px",
            }}
          ></div>
          <div>{review.writer.nickname}</div>
        </div>
        <div style={{ fontSize: "12px", color: "#888" }}>
          {review.createdTimeSince}
        </div>
      </div>
      <StarRating rating={review.numofstars} />
      <p style={{ marginTop: "15px" }}>{review.content}</p>
    </div>
  );
};

export default Review;

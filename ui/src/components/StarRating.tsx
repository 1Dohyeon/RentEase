import { faStar, faStarHalfAlt } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";

// Props 타입 정의
interface StarRatingProps {
  rating: number;
}

const StarRating: React.FC<StarRatingProps> = ({ rating }) => {
  // 별 개수를 정수 부분과 소수 부분으로 나누기
  const fullStars = Math.floor(rating);
  const halfStar = rating - fullStars >= 0.5;
  const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);

  return (
    <div style={{ display: "flex", alignItems: "center" }}>
      {Array(fullStars)
        .fill(0)
        .map((_, i) => (
          <FontAwesomeIcon
            key={i}
            icon={faStar}
            style={{ color: "black", marginRight: "2px" }}
          />
        ))}
      {halfStar && (
        <FontAwesomeIcon
          icon={faStarHalfAlt}
          style={{ color: "black", marginRight: "2px" }}
        />
      )}
      {/* {Array(emptyStars)
        .fill(0)
        .map((_, i) => (
          <FontAwesomeIcon
            key={i}
            icon={faStar}
            style={{
              color: "white",
              marginRight: "2px",
              border: "1px sold black",
            }}
          />
        ))} */}
    </div>
  );
};

export default StarRating;

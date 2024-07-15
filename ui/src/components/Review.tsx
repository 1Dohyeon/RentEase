import React, { useContext, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../contexts/AuthContext";
import apiClient from "../utils/apiClient";
import StarRating from "./StarRating";

interface ReviewWriter {
  id: number | null;
  nickname: string | null;
}

interface ReviewProps {
  review: {
    id: number;
    createdTimeSince: string;
    content: string;
    numofstars: number;
    writer: ReviewWriter | null;
  };
}

const Review: React.FC<ReviewProps> = ({ review }) => {
  const { userId, isLoggedIn } = useContext(AuthContext);
  const navigate = useNavigate();
  const [menuVisible, setMenuVisible] = useState<boolean>(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const currentUserID = userId; // 예시로 현재 사용자의 ID를 하드코딩

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [newContent, setNewContent] = useState(review.content);
  const [newStars, setNewStars] = useState(review.numofstars);

  // 사용자 프로필 클릭시 사용자 프로필 페이지로 이동
  const handleNicknameClick = () => {
    // 탈퇴한 사용자라면 클릭해도 아무일이 일어나지 않음
    if (review.writer?.id === 0) {
      return;
    }

    navigate(`/users/${review.writer?.id}`);
  };

  const toggleMenu = () => {
    setMenuVisible(!menuVisible);
  };

  const handleEdit = () => {
    setIsEditModalOpen(true);
  };

  const handleDelete = () => {
    // Delete 기능 구현
    const confirmDelete = window.confirm("리뷰를 삭제하시겠습니까?");
    if (confirmDelete) {
      // 삭제 확인 후 API 요청 보내기
      apiClient
        .patch(`/reviews/${review.id}`)
        .then(() => {
          window.location.reload();
        })
        .catch((error) => {
          alert("알 수 없는 이유로 삭제에 실패하였습니다.");
        });
    }
  };

  const handleReport = () => {
    // Report 기능 구현
    console.log("Report clicked for review ID:", review.id);
  };

  const handleSaveEdit = () => {
    // 수정 저장 기능 구현
    if (newContent === "" || newStars === 0) {
      alert("별점과 리뷰 내용을 모두 작성해주세요.");
      return;
    }

    const reviewData = {
      content: newContent,
      numofstars: newStars,
    };

    apiClient
      .patch(`/reviews/${review.id}/edit`, reviewData)
      .then(() => {
        setIsEditModalOpen(false);
        alert("리뷰가 수정되었습니다.");
        window.location.reload();
      })
      .catch((error) => {
        console.error("Error editing review:", error);
        alert("리뷰 수정에 실패하였습니다.");
      });
  };

  useEffect(() => {
    setNewContent(review.content);
    setNewStars(review.numofstars);
  }, [review.content, review.numofstars]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMenuVisible(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div style={{ padding: "20px 0", position: "relative" }}>
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
          <div>{review.writer?.nickname}</div>
        </div>
        <div style={{ display: "flex", alignItems: "center" }}>
          <div style={{ fontSize: "12px", color: "#888", marginRight: "10px" }}>
            {review.createdTimeSince}
          </div>
          <div
            onClick={toggleMenu}
            style={{
              cursor: "pointer",
              fontSize: "20px",
              padding: "0 5px",
            }}
          >
            &#8942;
          </div>
          {menuVisible && (
            <div
              ref={menuRef}
              style={{
                position: "absolute",
                top: "30px",
                right: "20px",
                backgroundColor: "#f9f9f9",
                boxShadow: "0px 0px 5px rgba(0,0,0,0.1)",
                borderRadius: "4px",
                zIndex: 10,
                padding: "5px",
                display: "flex",
                flexDirection: "column",
              }}
            >
              {review.writer?.id === currentUserID &&
                isLoggedIn && ( // 작성자와 현재 사용자 ID 비교
                  <>
                    <div
                      onClick={handleEdit}
                      style={{ cursor: "pointer", padding: "5px 10px" }}
                    >
                      수정
                    </div>
                    <div
                      onClick={handleDelete}
                      style={{ cursor: "pointer", padding: "5px 10px" }}
                    >
                      삭제
                    </div>
                  </>
                )}
              {review.writer?.id !== currentUserID && ( // 작성자와 현재 사용자 ID 다를 때
                <div
                  onClick={handleReport}
                  style={{ cursor: "pointer", padding: "5px 10px" }}
                >
                  신고
                </div>
              )}
            </div>
          )}
        </div>
      </div>
      <StarRating rating={review.numofstars} />
      <p style={{ marginTop: "15px" }}>{review.content}</p>

      {isEditModalOpen && (
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
          <h3>리뷰 수정</h3>
          <textarea
            value={newContent}
            onChange={(e) => setNewContent(e.target.value)}
            placeholder="리뷰 내용을 수정해주세요"
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
                  checked={newStars === star}
                  onChange={(e) => setNewStars(parseInt(e.target.value))}
                />
                {star}점
              </label>
            ))}
          </div>
          <button onClick={handleSaveEdit}>저장</button>
          <button onClick={() => setIsEditModalOpen(false)}>취소</button>
        </div>
      )}
    </div>
  );
};

export default Review;

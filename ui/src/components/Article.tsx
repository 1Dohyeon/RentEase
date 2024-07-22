import React, { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../contexts/AuthContext";
import apiClient from "../utils/apiClient"; // apiClient 임포트

interface Address {
  id: number;
  city: string;
  district: string;
}

interface ArticleProps {
  id: number;
  title: string;
  dailyprice: string;
  currency: string;
  mainImage?: string;
  addresses: Address[];
}

const Article: React.FC<ArticleProps> = ({
  id,
  title,
  dailyprice,
  currency,
  mainImage,
  addresses,
}) => {
  const getCurrencySymbol = (currency: string) => {
    switch (currency) {
      case "KRW":
        return "₩";
      case "USD":
        return "$";
      case "JPY":
        return "¥";
      default:
        return "";
    }
  };

  // 하트 상태 관리
  const [isBookmarked, setIsBookmarked] = useState(false);
  const { userId, isLoggedIn } = useContext(AuthContext);

  // 사용자의 북마크 목록
  const [userBookmarkIds, setUserBookmarkIds] = useState<number[]>([]);

  // 페이지 로드 시 사용자의 북마크 목록 가져오기
  useEffect(() => {
    if (isLoggedIn) {
      apiClient
        .get(`/users/${userId}/bookmarks`)
        .then((response) => {
          const bookmarkedArticleIds = response.data.bookmark.articles.map(
            (article: any) => article.id
          );
          setUserBookmarkIds(bookmarkedArticleIds);
        })
        .catch((error) => {
          console.error("사용자의 북마크 목록을 가져오는 중 오류 발생:", error);
        });
    }
  }, [userId, isLoggedIn]);

  // 게시글이 사용자의 북마크 목록에 있는지 확인
  useEffect(() => {
    if (isLoggedIn && userBookmarkIds.includes(id)) {
      setIsBookmarked(true);
    } else {
      setIsBookmarked(false);
    }
  }, [id, userBookmarkIds, isLoggedIn]);

  // 하트 클릭 이벤트 핸들러
  const handleBookmarkClick = (event: React.MouseEvent<SVGSVGElement>) => {
    event.stopPropagation(); // 이벤트 전파 방지

    // 로그인 여부 체크
    if (!isLoggedIn) {
      alert("로그인 후 이용할 수 있습니다.");
      return;
    }

    // 북마크 상태 업데이트
    const updatedBookmarkIds = [...userBookmarkIds];
    if (isBookmarked) {
      // 북마크 취소 요청
      apiClient
        .patch(`/bookmarks/${userId}/remove/${id}`)
        .then((response) => {
          console.log("북마크 취소 성공:", response.data);
          updatedBookmarkIds.splice(updatedBookmarkIds.indexOf(id), 1); // 배열에서 해당 ID 제거
          setUserBookmarkIds(updatedBookmarkIds);
          setIsBookmarked(false); // 상태 업데이트
        })
        .catch((error) => {
          console.error("북마크 취소 실패:", error);
        });
    } else {
      // 북마크 추가 요청
      apiClient
        .patch(`/bookmarks/${userId}/add/${id}`)
        .then((response) => {
          console.log("북마크 추가 성공:", response.data);
          updatedBookmarkIds.push(id); // 배열에 해당 ID 추가
          setUserBookmarkIds(updatedBookmarkIds);
          setIsBookmarked(true); // 상태 업데이트
        })
        .catch((error) => {
          console.error("북마크 추가 실패:", error);
        });
    }
  };

  // apiBaseUrl 설정
  const apiBaseUrl = process.env.REACT_APP_API_BASE_URL;

  return (
    <div
      style={{
        width: "270px",
        height: "370px",
        marginTop: "10px",
        cursor: "pointer",
        position: "relative", // 추가: 하트 아이콘을 위한 position 설정
      }}
    >
      <div
        className="img_container"
        style={{
          width: "270px",
          height: "250px",
          backgroundColor: "#d2d2d2",
          borderRadius: "10px",
          position: "relative", // 추가: 하트 아이콘을 위한 position 설정
        }}
      >
        {/* 하트 아이콘 */}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          width="24"
          height="24"
          style={{
            position: "absolute",
            top: "10px",
            right: "10px",
            fill: isBookmarked ? "hotpink" : "none", // 북마크 여부에 따라 색상 변경
            stroke: "white", // 테두리 색상 흰색으로 변경
            strokeWidth: "1.5",
            strokeLinecap: "round",
            strokeLinejoin: "round",
            cursor: "pointer",
          }}
          onClick={handleBookmarkClick} // 클릭 이벤트 핸들러 추가
        >
          <path
            stroke="white"
            d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
          />
        </svg>
        {/* mainImage 표시 */}
        {mainImage && (
          <img
            src={`${apiBaseUrl}/${mainImage}`}
            alt="mainImage"
            style={{
              width: "100%",
              height: "100%",
              borderRadius: "10px",
              objectFit: "cover",
            }}
          />
        )}
      </div>
      <Link
        to={`/articles/${id}`}
        style={{ textDecoration: "none", color: "inherit" }}
      >
        <p
          style={{
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
            fontSize: "18px",
            marginTop: "5px",
          }}
        >
          {title}
        </p>
        <p
          style={{
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
            textOverflow: "ellipsis",
            marginTop: "2px",
          }}
        >
          {addresses.map((address, index) => (
            <span key={index} style={{ fontSize: "14px" }}>
              {address.city} {address.district}
              {index < addresses.length - 1 ? ", " : ""}
            </span>
          ))}
        </p>
        <p
          style={{
            fontSize: "18px",
            marginTop: "3px",
            fontWeight: "bold",
          }}
        >
          {getCurrencySymbol(currency)}
          {parseInt(dailyprice, 10).toLocaleString()}/일
        </p>
      </Link>
    </div>
  );
};

export default Article;

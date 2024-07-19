import React, { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Header from "../components/Header";
import ReviewsContainer from "../components/ReviewsContainer";
import StarRating from "../components/StarRating";
import { AuthContext } from "../contexts/AuthContext";
import apiClient from "../utils/apiClient";

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
  profileimage?: string;
}

interface Article {
  id: number;
  createdTimeSince: string | null;
  title: string;
  content: string;
  dailyprice: string;
  weeklyprice: string | null;
  monthlyprice: string | null;
  currency: string;
  avgnumofstars: number;
  addresses: Address[];
  categories: Category[];
  author: Author;
  mainImage?: string;
}

const ArticleDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [article, setArticle] = useState<Article | null>(null);
  const [loading, setLoading] = useState(true);
  const { userId, isLoggedIn } = useContext(AuthContext);
  const navigate = useNavigate();

  const apiBaseUrl = process.env.REACT_APP_API_BASE_URL;

  useEffect(() => {
    fetchArticle();
  }, []);

  const fetchArticle = () => {
    fetch(`${apiBaseUrl}/articles/${id}`)
      .then((response) => response.json())
      .then((data) => {
        const articleData = {
          ...data,
          createdTimeSince: data.createdTimeSince || "N/A",
        };
        setArticle(articleData);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching article:", error);
        setLoading(false);
      });
  };

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

  const handleDeleteArticle = () => {
    const confirmDelete = window.confirm("게시글을 삭제하시겠습니까?");
    if (confirmDelete) {
      apiClient
        .patch(`/articles/delete/${id}`)
        .then((response) => {
          alert("게시글이 삭제되었습니다.");
          navigate("/articles");
        })
        .catch((error) => {
          console.error("Error deleting article:", error);
          alert("게시글 삭제에 실패했습니다.");
        });
    }
  };

  const handleNicknameClick = () => {
    navigate(`/users/${article?.author.id}`);
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!article) {
    return <div>Article not found</div>;
  }

  return (
    <div>
      <Header />
      <div style={{ maxWidth: "840px", margin: "0 auto", padding: "20px" }}>
        <div
          style={{
            width: "100%",
            height: "70px",
          }}
        ></div>
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <p
            style={{
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
              maxWidth: "calc(100% - 180px)",
              fontSize: "26px",
            }}
          >
            {/* 제목 둬도 됨 */}
          </p>
          {isLoggedIn && userId === article.author.id && (
            <div>
              <button
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
                onClick={() =>
                  navigate(`/articles/edit/${id}`, { state: { article } })
                }
              >
                수정
              </button>
              <button
                style={{
                  padding: "10px 20px",
                  color: "#FF6347",
                  textDecoration: "none",
                  backgroundColor: "#fdfdfd",
                  border: "none",
                  borderRadius: "5px",
                  cursor: "pointer",
                  fontWeight: "600",
                }}
                onClick={handleDeleteArticle}
              >
                삭제
              </button>
            </div>
          )}
        </div>
        {/* 이미지 섹션 추가 */}
        <div
          style={{
            display: "flex",
            gap: "10px",
            marginTop: "20px",
            marginBottom: "20px",
          }}
        >
          <div
            style={{
              width: "50%",
              paddingTop: "50%",
              backgroundColor: "#d2d2d2",
              borderRadius: "10px",
              position: "relative",
            }}
          >
            <div
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
              }}
            >
              {/* mainImage 표시 */}
              {article.mainImage && (
                <img
                  src={`${apiBaseUrl}/${article.mainImage}`}
                  alt="Article main"
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    borderRadius: "10px",
                  }}
                />
              )}
            </div>
          </div>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              width: "50%",
            }}
          >
            <div
              style={{
                display: "flex",
                gap: "10px",
                marginBottom: "10px",
              }}
            >
              {[...Array(2)].map((_, index) => (
                <div
                  key={index}
                  style={{
                    width: "50%",
                    paddingTop: "50%",
                    backgroundColor: "#e5e5e5",
                    borderRadius: "10px",
                    position: "relative",
                  }}
                >
                  <div
                    style={{
                      position: "absolute",
                      top: 0,
                      left: 0,
                      right: 0,
                      bottom: 0,
                    }}
                  ></div>
                </div>
              ))}
            </div>
            <div
              style={{
                display: "flex",
                gap: "10px",
              }}
            >
              {[...Array(2)].map((_, index) => (
                <div
                  key={index}
                  style={{
                    width: "50%",
                    paddingTop: "50%",
                    backgroundColor: "#e5e5e5",
                    borderRadius: "10px",
                    position: "relative",
                  }}
                >
                  <div
                    style={{
                      position: "absolute",
                      top: 0,
                      left: 0,
                      right: 0,
                      bottom: 0,
                    }}
                  ></div>
                </div>
              ))}
            </div>
          </div>
        </div>
        {/* 카테고리 */}
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <div style={{ width: "85%" }}>
            {article.categories.map((category) => (
              <span key={category.id}>#{category.title}</span>
            ))}
          </div>
          <small>{article.createdTimeSince}</small>
        </div>
        {/* 제목 */}
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <div style={{ width: "85%" }}>
            <p style={{ fontSize: "26px" }}>{article.title}</p>
          </div>
        </div>
        {/* 위치 */}
        <div style={{ width: "85%" }}>
          {article.addresses.map((address, index) => (
            <span key={index} style={{ fontSize: "16px" }}>
              {address.city} {address.district}
              {index < article.addresses.length - 1 ? ", " : ""}
            </span>
          ))}
        </div>
        {/* 별점 */}
        <div
          style={{ fontSize: "20px", display: "flex", alignItems: "center" }}
        >
          <StarRating rating={article.avgnumofstars} />
          {article.avgnumofstars == 0 ? (
            <p>아직 후기가 없습니다.</p>
          ) : (
            <p>{article.avgnumofstars}</p>
          )}
        </div>
        <hr style={{ margin: "30px 0px" }}></hr>
        {/* 작성자 프로필 */}
        <div
          onClick={handleNicknameClick}
          style={{
            display: "flex",
            alignItems: "center",
            marginBottom: "10px",
            cursor: "pointer",
          }}
        >
          <div
            style={{
              width: "40px",
              height: "40px",
              backgroundColor: "#d2d2d2",
              marginRight: "5px",
              overflow: "hidden",
              borderRadius: "50%",
            }}
          >
            {article.author.profileimage && (
              <img
                src={`${apiBaseUrl}/${article.author.profileimage}`}
                alt="게시글 작성자"
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  borderRadius: "10px",
                }}
              />
            )}
          </div>
          <p>{article.author.nickname}</p>
        </div>
        {/* 가격 */}
        <div
          style={{
            borderBottom: "1px solid #ddd",
            margin: "30px 0px",
            paddingBottom: "30px",
          }}
        >
          <p>
            {getCurrencySymbol(article.currency)}
            {parseInt(article.dailyprice, 10).toLocaleString()}/일
          </p>
          {article.weeklyprice && (
            <p>
              {getCurrencySymbol(article.currency)}
              {parseInt(article.weeklyprice, 10).toLocaleString()}/주
            </p>
          )}
          {article.monthlyprice && (
            <p>
              {getCurrencySymbol(article.currency)}
              {parseInt(article.monthlyprice, 10).toLocaleString()}/월
            </p>
          )}
        </div>
        <p
          style={{
            borderBottom: "1px solid #ddd",
            margin: "30px 0px",
            paddingBottom: "30px",
          }}
        >
          {article.content}
        </p>
        <ReviewsContainer
          articleId={article.id}
          avgnumofstars={article.avgnumofstars}
        />
      </div>
    </div>
  );
};

export default ArticleDetailPage;

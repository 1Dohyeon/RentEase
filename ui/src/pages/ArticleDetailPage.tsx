import React, { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Header from "../components/Header";
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
  addresses: Address[];
  categories: Category[];
  author: Author;
}

const ArticleDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [article, setArticle] = useState<Article | null>(null);
  const [loading, setLoading] = useState(true);
  const { userId, isLoggedIn } = useContext(AuthContext);
  const navigate = useNavigate(); // useNavigate 훅 사용

  const apiBaseUrl = process.env.REACT_APP_API_BASE_URL;

  useEffect(() => {
    fetchArticle();
  }, []);

  const fetchArticle = () => {
    fetch(`${apiBaseUrl}/articles/${id}`)
      .then((response) => response.json())
      .then((data) => {
        // 기본값을 설정합니다.
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
          navigate("/articles"); // 삭제 후에 articles 페이지로 이동
        })
        .catch((error) => {
          console.error("Error deleting article:", error);
          alert("게시글 삭제에 실패했습니다.");
        });
    }
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
        <h1>{article.title}</h1>
        {isLoggedIn && userId === article.author.id && (
          <div style={{ marginBottom: "20px", marginTop: "20px" }}>
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
              onClick={() => console.log("Edit")}
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
              onClick={handleDeleteArticle} // 삭제 버튼 클릭 시 처리 함수 호출
            >
              삭제
            </button>
          </div>
        )}
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
              paddingTop: "50%", // 1:1 aspect ratio
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
            ></div>
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
                    paddingTop: "50%", // 1:1 aspect ratio
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
                    paddingTop: "50%", // 1:1 aspect ratio
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
        <h4>{article.title}</h4>
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
        <div>
          {article.addresses.map((address, index) => (
            <small key={index}>
              {address.city} {address.district}
              {index < article.addresses.length - 1 ? ", " : ""}
            </small>
          ))}
        </div>
        <div>
          {article.categories.map((category) => (
            <span key={category.id}>{category.title}</span>
          ))}
        </div>
        <p>{article.author.nickname}</p>
        <p>{article.createdTimeSince}</p>
        <p>{article.content}</p>
      </div>
    </div>
  );
};

export default ArticleDetailPage;

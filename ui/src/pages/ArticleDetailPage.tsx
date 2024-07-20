import React, { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import ChatRoom from "../components/ChatRoom";
import Header from "../components/Header";
import ReviewsContainer from "../components/ReviewsContainer";
import StarRating from "../components/StarRating";
import { AuthContext } from "../contexts/AuthContext";
import apiClient from "../utils/apiClient";
import "./ArticleDetailPage.css";

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
  const [chatRoomId, setChatRoomId] = useState<number | null>(null);
  const [isChatModalOpen, setIsChatModalOpen] = useState<boolean>(false);
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

  const startChat = () => {
    if (!isLoggedIn) {
      alert("로그인 후 이용할 수 있습니다.");
      return;
    }

    apiClient
      .post("/chat/rooms", {
        user1Id: userId,
        user2Id: article?.author.id,
        articleId: article?.id, // Pass articleId here
      })
      .then((response) => {
        setChatRoomId(response.data.id);
        setIsChatModalOpen(true);
      })
      .catch((error) => {
        console.error("Error starting chat:", error);
      });
  };

  const closeChatModal = () => {
    setIsChatModalOpen(false);
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
      <div className="content-container">
        <div className="spacer"></div>

        <div className="header-actions">
          <p className="article-title">{article.title}</p>
          {isLoggedIn && userId === article.author.id && (
            <div className="action-buttons">
              <button
                className="edit-button"
                onClick={() =>
                  navigate(`/articles/edit/${article.id}`, {
                    state: { article },
                  })
                }
              >
                수정
              </button>
              <button className="delete-button" onClick={handleDeleteArticle}>
                삭제
              </button>
            </div>
          )}
          {isLoggedIn && userId !== article.author.id && (
            <button className="chat-button" onClick={startChat}>
              채팅하기
            </button>
          )}
        </div>

        <div className="image-section">
          <div className="main-image-container">
            <div className="main-image">
              {article.mainImage && (
                <img
                  src={`${apiBaseUrl}/${article.mainImage}`}
                  alt="Article main"
                  className="main-image-content"
                />
              )}
            </div>
          </div>
          <div className="additional-images">
            <div className="image-row">
              {[...Array(2)].map((_, index) => (
                <div key={index} className="additional-image"></div>
              ))}
            </div>
            <div className="image-row">
              {[...Array(2)].map((_, index) => (
                <div key={index} className="additional-image"></div>
              ))}
            </div>
          </div>
        </div>

        <div className="category-time">
          <div className="categories">
            {article.categories.map((category) => (
              <span key={category.id}>#{category.title}</span>
            ))}
          </div>
          <small>{article.createdTimeSince}</small>
        </div>

        <div className="title-section">
          <p className="article-title-large">{article.title}</p>
        </div>

        <div className="address-section">
          {article.addresses.map((address, index) => (
            <span key={index} className="address">
              {address.city} {address.district}
              {index < article.addresses.length - 1 ? ", " : ""}
            </span>
          ))}
        </div>

        <div className="rating-section">
          <StarRating rating={article.avgnumofstars} />
          {article.avgnumofstars === 0 ? (
            <p>아직 후기가 없습니다.</p>
          ) : (
            <p>{article.avgnumofstars}</p>
          )}
        </div>

        <hr className="separator" />

        <div className="author-section" onClick={handleNicknameClick}>
          <div className="author-profile">
            {article.author.profileimage && (
              <img
                src={`${apiBaseUrl}/${article.author.profileimage}`}
                alt="게시글 작성자"
                className="author-profile-image"
              />
            )}
          </div>
          <p className="author-nickname">{article.author.nickname}</p>
        </div>

        <div className="price-section">
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

        <p className="content">{article.content}</p>

        <ReviewsContainer
          articleId={article.id}
          avgnumofstars={article.avgnumofstars}
        />

        {isChatModalOpen && chatRoomId !== null && (
          <div className="chat-modal">
            <div className="chat-modal-content">
              <button onClick={closeChatModal} className="chat-modal-close">
                &times;
              </button>
              <ChatRoom
                roomId={chatRoomId}
                userId={userId!}
                articleId={article.id}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ArticleDetailPage;

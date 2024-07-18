import React, { useContext, useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { AuthContext } from "../contexts/AuthContext";
import "../styles/WriteArticleFormComponent.css";
import apiClient from "../utils/apiClient";

interface Category {
  id: number;
  title: string;
}

interface Address {
  id: number;
  city: string;
  district: string;
}

interface Article {
  id: number;
  title: string;
  content: string;
  dailyprice: string;
  weeklyprice: string;
  monthlyprice: string;
  currency: string;
  mainImage?: string;
  categories: Category[];
  addresses: Address[];
}

const SettingArticleImageFormComponent: React.FC = () => {
  const { isLoggedIn, userId } = useContext(AuthContext);
  const { articleId } = useParams<{ articleId: string }>();
  const location = useLocation() as { state: { article: Article } };
  const [article, setArticle] = useState<Article | null>(
    location.state?.article || null
  );
  const [mainImage, setMainImage] = useState<File | null>(null);
  const [mainImagePreview, setMainImagePreview] = useState<string | null>(null);
  const [selectedAddresses, setSelectedAddresses] = useState<number[]>([]);
  const [userArticles, setUserArticles] = useState<number[]>([]); // 사용자가 작성한 articleId 목록
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoggedIn) {
      navigate("/error");
    }

    const fetchUserArticles = async () => {
      try {
        const response = await apiClient.get(`/users/${userId}/articlesAll`);
        const userArticleIds = response.data.articles.map(
          (article: any) => article.id
        );

        setUserArticles(userArticleIds);

        // 현재 페이지의 articleId가 사용자가 작성한 articleId 목록에 포함되어 있는지 확인
        const numArticleId = articleId ? parseInt(articleId) : null;
        const isUserArticle = numArticleId
          ? userArticleIds.includes(numArticleId)
          : false;

        console.log(numArticleId);
        console.log(isUserArticle);

        // 사용자가 작성한 게시글이 아닌 경우 404 페이지로 리디렉션
        if (!isUserArticle) {
          navigate("/error");
        }
      } catch (error) {
        console.error("사용자 게시글 데이터 로딩 오류:", error);
      }
    };

    fetchUserArticles();
  }, [userId]);

  useEffect(() => {
    if (location.state?.article) {
      setArticle(location.state.article);
      if (location.state.article.mainImage) {
        setMainImagePreview(location.state.article.mainImage);
      }
      setSelectedAddresses(
        location.state.article.addresses.map((addr) => addr.id)
      );
    }
  }, [location.state]);

  const handleMainImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      setMainImage(file);

      const reader = new FileReader();
      reader.onloadend = () => {
        setMainImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleGetBack = () => {
    navigate("/articles/write", { state: { article } });
  };

  const handleSubmit = async () => {
    if (!articleId || !mainImage) {
      return;
    }

    const formData = new FormData();
    formData.append("file", mainImage);

    try {
      const response = await apiClient.patch(
        `/articles/${articleId}/main-image`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.status === 200) {
        alert("게시글 작성이 완료되었습니다.");
        navigate(`/articles/${articleId}`);
      } else {
        alert("메인 이미지 업로드에 실패했습니다.");
      }
    } catch (error) {
      console.error("메인 이미지 업로드 오류:", error);
      alert("메인 이미지 업로드 중 오류가 발생했습니다.");
    }
  };

  return (
    <div>
      <form className="article-form" onSubmit={(e) => e.preventDefault()}>
        <h3 style={{ marginTop: "20px" }}>메인 이미지 설정</h3>
        <div
          style={{
            width: "200px",
            height: "200px",
            backgroundColor: "#d2d2d2",
          }}
        >
          {mainImagePreview && (
            <div>
              <img
                src={mainImagePreview}
                alt="메인 이미지"
                style={{ maxWidth: "100%", maxHeight: "200px" }}
              />
            </div>
          )}
        </div>
        <div style={{ textAlign: "center" }}>
          <input
            type="file"
            onChange={handleMainImageChange}
            accept="image/*"
            id="mainImageInput"
          />
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
          }}
        >
          <button
            type="button"
            onClick={handleGetBack}
            style={{
              padding: "10px 20px",
              backgroundColor: "#7DB26B",
              color: "white",
              textDecoration: "none",
              border: "none",
              borderRadius: "5px",
              cursor: "pointer",
              fontWeight: "600",
            }}
          >
            {"<"} 이전 단계로
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            style={{
              padding: "10px 20px",
              backgroundColor: "#7DB26B",
              color: "white",
              textDecoration: "none",
              border: "none",
              borderRadius: "5px",
              cursor: "pointer",
              fontWeight: "600",
            }}
          >
            게시글 작성 완료
          </button>
        </div>
      </form>
    </div>
  );
};

export default SettingArticleImageFormComponent;

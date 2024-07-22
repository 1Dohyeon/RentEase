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
  weeklyprice: string | null;
  monthlyprice: string | null;
  currency: string;
  mainImage?: string;
  categories: Category[];
  addresses: Address[];
}

const SettingEditArticleImageFormComponent: React.FC = () => {
  const { isLoggedIn, userId } = useContext(AuthContext);
  const { articleId } = useParams<{ articleId: string }>();
  const location = useLocation() as {
    state: { article: Article; mainImage: File | null };
  };
  const [article, setArticle] = useState<Article | null>(null);
  const [mainImage, setMainImage] = useState<File | null>(
    location.state?.mainImage || null
  );
  const [mainImagePreview, setMainImagePreview] = useState<string | null>(
    location.state?.mainImage
      ? URL.createObjectURL(location.state.mainImage)
      : null
  );
  const [selectedAddresses, setSelectedAddresses] = useState<number[]>([]);
  const [userArticles, setUserArticles] = useState<number[]>([]); // 사용자가 작성한 articleId 목록
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoggedIn) {
      navigate("/error");
    }

    const fetchArticle = async () => {
      try {
        const response = await apiClient.get(`/articles/${articleId}`);
        const fetchedArticle: Article = response.data;

        setArticle(fetchedArticle);

        // 기존의 mainImage 값이 있다면 설정
        if (fetchedArticle.mainImage) {
          setMainImagePreview(fetchedArticle.mainImage);
        }

        setSelectedAddresses(fetchedArticle.addresses.map((addr) => addr.id));
      } catch (error) {
        console.error("게시글 데이터 로딩 오류:", error);
        navigate("/error");
      }
    };

    fetchArticle();
  }, [isLoggedIn, navigate, articleId]);

  const handleMainImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      setMainImage(file);

      // 파일을 미리보기 형식으로 변환
      setMainImagePreview(URL.createObjectURL(file));
    }
  };

  const handleGetBack = () => {
    navigate(`/articles/edit/${articleId}`, { state: { article } });
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

  if (!article) {
    return <div>Loading...</div>;
  }

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
          {!mainImagePreview && article?.mainImage && (
            <div
              style={{
                backgroundColor: "#d2d2d2",
                width: "200px",
                height: "200px",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <p>기존 이미지:</p>
              <img
                src={article.mainImage}
                alt="메인 이미지"
                style={{ maxWidth: "100%", maxHeight: "200px" }}
              />
            </div>
          )}
          {!mainImagePreview && !article?.mainImage && (
            <div
              style={{
                backgroundColor: "#d2d2d2",
                width: "200px",
                height: "200px",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <p>기존 이미지 없음</p>
            </div>
          )}
        </div>
        {/* 삭제버튼 */}
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
            marginTop: "20px",
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

export default SettingEditArticleImageFormComponent;

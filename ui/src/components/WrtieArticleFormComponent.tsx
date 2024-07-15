import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
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
  categories: Category[];
  addresses: Address[];
}

const WriteArticleFormComponent: React.FC = () => {
  const location = useLocation();
  const existingArticle = (location.state as { article: Article } | undefined)
    ?.article;
  const [title, setTitle] = useState(
    existingArticle ? existingArticle.title : ""
  );
  const [content, setContent] = useState(
    existingArticle ? existingArticle.content : ""
  );
  const [dailyPrice, setDailyPrice] = useState(
    existingArticle ? existingArticle.dailyprice : ""
  );
  const [monthlyPrice, setMonthlyPrice] = useState(
    existingArticle ? existingArticle.monthlyprice : ""
  );
  const [weeklyPrice, setWeeklyPrice] = useState(
    existingArticle ? existingArticle.weeklyprice : ""
  );
  const [currency, setCurrency] = useState(
    existingArticle ? existingArticle.currency : "KRW"
  );
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<number[]>(
    existingArticle
      ? existingArticle.categories.map((cat: Category) => cat.id)
      : []
  );
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [selectedAddresses, setSelectedAddresses] = useState<number[]>(
    existingArticle
      ? existingArticle.addresses.map((addr: Address) => addr.id)
      : []
  );
  const navigate = useNavigate(); // useNavigate 훅 사용

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await apiClient.get("/categories");
        setCategories(response.data);
      } catch (error) {
        console.error("카테고리 데이터 로딩 오류:", error);
      }
    };

    const fetchAddresses = async () => {
      try {
        const response = await apiClient.get("/settings/profile/address");
        setAddresses(response.data);

        // 사용자 주소가 설정되어 있지 않으면 설정 페이지로 이동
        if (!response.data.length) {
          setNoAddressPrompt(true); // 사용자 주소 없음을 나타내는 상태 업데이트
        }
      } catch (error) {
        console.error("주소 데이터 로딩 오류:", error);
      }
    };

    fetchCategories();
    fetchAddresses();
  }, []);

  const [noAddressPrompt, setNoAddressPrompt] = useState(false);

  const handleCategoryChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const categoryId = parseInt(event.target.value, 10);
    if (event.target.checked) {
      setSelectedCategories([...selectedCategories, categoryId]);
    } else {
      setSelectedCategories(
        selectedCategories.filter((id) => id !== categoryId)
      );
    }
  };

  const handleAddressChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    addressId: number
  ) => {
    if (event.target.checked) {
      setSelectedAddresses([...selectedAddresses, addressId]);
    } else {
      setSelectedAddresses(selectedAddresses.filter((id) => id !== addressId));
    }
  };

  const handleAddressSetup = () => {
    navigate("/settings/profile/address");
  };

  const handleSubmit = async () => {
    const articleData = {
      title,
      content,
      dailyprice: parseFloat(dailyPrice),
      weeklyprice: parseFloat(weeklyPrice),
      monthlyprice: parseFloat(monthlyPrice),
      currency,
      addresses: selectedAddresses.map((id) =>
        addresses.find((addr) => addr.id === id)
      ),
      categories: selectedCategories.map((id) =>
        categories.find((cat) => cat.id === id)
      ),
    };

    try {
      let response;
      if (existingArticle) {
        response = await apiClient.patch(
          `/articles/edit/${existingArticle.id}`,
          articleData
        );
        navigate(-1);
      } else {
        response = await apiClient.post("/articles/write", articleData);
        const newArticleId = response.data.id; // 새로 작성된 게시글의 ID
        navigate(`/articles/${newArticleId}`); // 새로 작성된 게시글 페이지로 이동
      }

      if (!response) {
        throw new Error("게시글 작성에 실패했습니다.");
      }

      alert(
        existingArticle
          ? "게시글 수정이 완료되었습니다."
          : "게시글 작성이 완료되었습니다."
      );
    } catch (error) {
      console.error("게시글 작성 오류:", error);
    }
  };

  return (
    <div>
      <form className="article-form" onSubmit={(e) => e.preventDefault()}>
        <div>
          <input
            type="text"
            id="title"
            value={title}
            placeholder="제목을 입력해주세요."
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>

        <h3 style={{ marginTop: "20px" }}>가격 설정</h3>
        <div className="price-inputs">
          <div>
            <label htmlFor="dailyprice">일일 가격</label>
            <input
              type="number"
              id="dailyprice"
              value={dailyPrice}
              onChange={(e) => setDailyPrice(e.target.value)}
            />
          </div>
          <div>
            <label htmlFor="weeklyprice">주간 가격(선택)</label>
            <input
              type="number"
              id="weeklyprice"
              value={weeklyPrice}
              onChange={(e) => setWeeklyPrice(e.target.value)}
            />
          </div>
          <div>
            <label htmlFor="monthlyprice">월간 가격(선택)</label>
            <input
              type="number"
              id="monthlyprice"
              value={monthlyPrice}
              onChange={(e) => setMonthlyPrice(e.target.value)}
            />
          </div>
          <div>
            <label htmlFor="currency">통화</label>
            <select
              id="currency"
              value={currency}
              onChange={(e) => setCurrency(e.target.value)}
            >
              <option value="KRW">KRW</option>
              <option value="USD">USD</option>
              <option value="JPY">JPY</option>
            </select>
          </div>
        </div>

        <h3 style={{ marginTop: "20px" }}>카테고리 설정</h3>
        <div className="category-selection">
          {categories.map((category) => (
            <div key={category.id}>
              <input
                type="checkbox"
                id={`category-${category.id}`}
                value={category.id}
                checked={selectedCategories.includes(category.id)}
                onChange={handleCategoryChange}
              />
              <label htmlFor={`category-${category.id}`}>
                {category.title}
              </label>
            </div>
          ))}
        </div>

        <h3 style={{ marginTop: "20px" }}>주소 설정</h3>
        <div className="address-selection">
          {/* 주소 설정 섹션 */}
          {noAddressPrompt ? (
            <div>
              사용자 주소가 없습니다.{" "}
              <button
                onClick={handleAddressSetup}
                style={{
                  backgroundColor: "#7DB26B",
                  color: "white",
                  border: "none",
                  padding: "5px 10px",
                  borderRadius: "5px",
                  cursor: "pointer",
                }}
              >
                설정하러 가기
              </button>
            </div>
          ) : (
            addresses.map((address) => (
              <div key={address.id}>
                <input
                  type="checkbox"
                  id={`address-${address.id}`}
                  value={address.id}
                  checked={selectedAddresses.includes(address.id)}
                  onChange={(e) => handleAddressChange(e, address.id)}
                />
                <label htmlFor={`address-${address.id}`}>
                  {address.city} {address.district}
                </label>
              </div>
            ))
          )}
        </div>

        <h3 style={{ marginTop: "20px" }}>내용 작성</h3>
        <div>
          <textarea
            id="content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
          ></textarea>
        </div>
        <button
          type="submit"
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
          {existingArticle ? "게시글 수정 완료" : "게시글 작성 완료"}
        </button>
      </form>
    </div>
  );
};

export default WriteArticleFormComponent;

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

const WriteArticleFormComponent: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const initialState = location.state?.article || {
    title: "",
    content: "",
    dailyprice: "",
    weeklyprice: "",
    monthlyprice: "",
    currency: "KRW",
    categories: [],
    addresses: [],
  };

  const [title, setTitle] = useState(initialState.title);
  const [content, setContent] = useState(initialState.content);
  const [dailyPrice, setDailyPrice] = useState(initialState.dailyprice);
  const [monthlyPrice, setMonthlyPrice] = useState(initialState.monthlyprice);
  const [weeklyPrice, setWeeklyPrice] = useState(initialState.weeklyprice);
  const [currency, setCurrency] = useState(initialState.currency);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<number[]>([]);
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [selectedAddresses, setSelectedAddresses] = useState<number[]>([]);
  const [noAddressPrompt, setNoAddressPrompt] = useState(false);

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
        const fetchedAddresses = response.data;

        setAddresses(fetchedAddresses);

        if (!fetchedAddresses.length) {
          setNoAddressPrompt(true);
        }
      } catch (error) {
        console.error("주소 데이터 로딩 오류:", error);
      }
    };

    fetchCategories();
    fetchAddresses();
  }, []);

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
      const response = await apiClient.post("/articles/write", articleData);
      const newArticleId = response.data.id;

      // 이전 페이지로 article 데이터 전달
      navigate(`/articles/write/${newArticleId}/main-image`, {
        state: { article: articleData },
      });
    } catch (error: any) {
      console.error("게시글 작성 오류:", error);
      let errorMessage = "게시글 작성 중 오류가 발생했습니다.";

      if (error.response && error.response.data) {
        const { error: serverError } = error.response.data;
        errorMessage = `${serverError}`;
      }

      alert(errorMessage);
    }
  };

  return (
    <div>
      <h2 style={{ textAlign: "center", marginBottom: "20px" }}>게시글 작성</h2>
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
          {noAddressPrompt ? (
            <div>
              {addresses.map((address) => (
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
              ))}
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
        <div
          style={{
            display: "flex",
            justifyContent: "end",
          }}
        >
          {" "}
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
            다음 단계로 {">"} (이미지 설정)
          </button>
        </div>
      </form>
    </div>
  );
};

export default WriteArticleFormComponent;

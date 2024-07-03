import React, { useEffect, useState } from "react";
import Header from "../components/Header";
import apiClient from "../utils/apiClient"; // apiClient 가져오기

interface Category {
  id: number;
  title: string;
}

interface Address {
  id: number;
  city: string;
  district: string;
}

const ArticleWritePage: React.FC = () => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [dailyPrice, setDailyPrice] = useState("");
  const [monthlyPrice, setMonthlyPrice] = useState("");
  const [currency, setCurrency] = useState("KRW");
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<number[]>([]);
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [selectedAddresses, setSelectedAddresses] = useState<number[]>([]);

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
      } catch (error) {
        console.error("주소 데이터 로딩 오류:", error);
      }
    };

    fetchCategories();
    fetchAddresses();
  }, []); // 빈 배열을 전달하여 한 번만 호출되도록 함

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

  const handleAddressChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const addressId = parseInt(event.target.value, 10);
    if (event.target.checked) {
      setSelectedAddresses([...selectedAddresses, addressId]);
    } else {
      setSelectedAddresses(selectedAddresses.filter((id) => id !== addressId));
    }
  };

  const handleSubmit = async () => {
    const articleData = {
      title,
      content,
      dailyprice: parseFloat(dailyPrice),
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

      if (!response) {
        throw new Error("게시글 작성에 실패했습니다.");
      }

      console.log("게시글 작성이 완료되었습니다.");
    } catch (error) {
      console.error("게시글 작성 오류:", error);
    }
  };

  return (
    <div>
      <Header />
      <div style={{ width: "100%", height: "70px" }}></div>
      <div style={{ width: "840px", margin: "0 auto" }}>
        <h1>게시글 작성</h1>
        <form onSubmit={(e) => e.preventDefault()}>
          <div>
            <label htmlFor="title">제목</label>
            <input
              type="text"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>
          <div>
            <label htmlFor="content">내용</label>
            <textarea
              id="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
            ></textarea>
          </div>
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
            <label htmlFor="monthlyprice">월간 가격</label>
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
          <div>
            <label>카테고리 선택</label>
            {categories.map((category) => (
              <div key={category.id}>
                <input
                  type="checkbox"
                  id={`category-${category.id}`}
                  value={category.id}
                  onChange={handleCategoryChange}
                />
                <label htmlFor={`category-${category.id}`}>
                  {category.title}
                </label>
              </div>
            ))}
          </div>
          <div>
            <label>주소 선택</label>
            {addresses.map((address) => (
              <div key={address.id}>
                <input
                  type="checkbox"
                  id={`address-${address.id}`}
                  value={address.id}
                  onChange={handleAddressChange}
                />
                <label htmlFor={`address-${address.id}`}>
                  {address.city} {address.district}
                </label>
              </div>
            ))}
          </div>
          <button type="submit" onClick={handleSubmit}>
            게시글 작성 완료
          </button>
        </form>
      </div>
    </div>
  );
};

export default ArticleWritePage;

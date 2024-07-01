import React from "react";
import { Link } from "react-router-dom";

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

interface ArticleProps {
  id: number;
  createdAt: string;
  title: string;
  dailyprice: string;
  currency: string;
  addresses: Address[];
  categories: Category[];
  author: Author;
}

const Article: React.FC<ArticleProps> = ({
  id,
  title,
  dailyprice,
  currency,
  addresses,
  author,
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

  return (
    <Link
      to={`/articles/${id}`}
      style={{ textDecoration: "none", color: "inherit" }}
    >
      <div
        style={{
          width: "250px",
          height: "370px",
          marginTop: "35px",
          cursor: "pointer",
        }}
      >
        <div
          style={{
            width: "250px",
            height: "250px",
            backgroundColor: "#d2d2d2",
            borderRadius: "10px",
          }}
        ></div>
        <h3
          style={{
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
        >
          {title}
        </h3>
        <p>
          {getCurrencySymbol(currency)}
          {parseInt(dailyprice, 10).toLocaleString()}/일
        </p>
        <p
          style={{
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
        >
          {addresses.map((address, index) => (
            <small key={index}>
              {address.city} {address.district}
              {index < addresses.length - 1 ? ", " : ""}
            </small>
          ))}
        </p>
        <p
          style={{
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
        >
          {author.nickname}
        </p>
      </div>
    </Link>
  );
};

export default Article;

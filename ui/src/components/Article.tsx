import React from "react";
import { Link } from "react-router-dom";

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
  addresses: Address[];
}

const Article: React.FC<ArticleProps> = ({
  id,
  title,
  dailyprice,
  currency,
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

  return (
    <Link
      to={`/articles/${id}`}
      style={{ textDecoration: "none", color: "inherit" }}
    >
      <div
        style={{
          width: "270px",
          height: "370px",
          marginTop: "10px",
          cursor: "pointer",
        }}
      >
        <div
          style={{
            width: "270px",
            height: "250px",
            backgroundColor: "#d2d2d2",
            borderRadius: "10px",
          }}
        ></div>
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
      </div>
    </Link>
  );
};

export default Article;

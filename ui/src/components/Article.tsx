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
  createdTimeSince: string | null;
  title: string;
  dailyprice: string;
  currency: string;
  addresses: Address[];
  categories: Category[];
  author: Author;
}

const Article: React.FC<ArticleProps> = ({
  id,
  createdTimeSince,
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
            <p key={index} style={{ fontSize: "14px" }}>
              {address.city} {address.district}
              {index < addresses.length - 1 ? ", " : ""}
            </p>
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
          {/* <p
              style={{
                fontSize: "16PX",
              }}
            >
              /일
            </p> */}
        </p>
        {/* <p
          style={{
            fontSize: "12px",
            marginTop: "6px",
            fontWeight: "bold",
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
        >
          {author.nickname}
        </p> */}
      </div>
    </Link>
  );
};

export default Article;

import React from "react";

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
  addresses: Address[];
  categories: Category[];
  author: Author;
}

const Article: React.FC<ArticleProps> = ({
  title,
  dailyprice,
  addresses,
  author,
}) => {
  return (
    <div
      style={{
        width: "224px",
        height: "350px",
        marginTop: "20px",
        cursor: "pointer",
      }}
    >
      <div
        style={{
          width: "224px",
          height: "224px",
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
      <p>₩{parseInt(dailyprice, 10).toLocaleString()}/일</p>
      <small
        style={{
          display: "-webkit-box",
          WebkitLineClamp: 2,
          WebkitBoxOrient: "vertical",
          overflow: "hidden",
          textOverflow: "ellipsis",
        }}
      >
        {addresses.map((address, index) => (
          <span key={index}>
            {address.city} {address.district}
            {index < addresses.length - 1 ? ", " : ""}
          </span>
        ))}
      </small>
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
  );
};

export default Article;

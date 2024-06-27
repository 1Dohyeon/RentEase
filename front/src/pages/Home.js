import React from "react";
import { useNavigate } from "react-router-dom";

function Home() {
  const navigate = useNavigate();

  const handleLoginClick = () => {
    navigate("auth/login");
  };

  const handleSignupClick = () => {
    navigate("auth/signup");
  };

  return (
    <div>
      {/* 헤더 */}
      <header style={styles.header}>
        <h1>RentEase</h1>
        <nav>
          <button onClick={handleLoginClick} style={styles.button}>
            Login
          </button>
          <button onClick={handleSignupClick} style={styles.button}>
            Sign Up
          </button>
        </nav>
      </header>

      {/* 메인 섹션 */}
      <section style={styles.section}>
        <h2>Welcome to RentEase</h2>
        <p>This application helps you manage your rentals with ease.</p>
        <p>
          Explore our features and find out how we can assist you in managing
          your properties.
        </p>
      </section>

      {/* 푸터 */}
      <footer style={styles.footer}>
        <p>&copy; 2024 RentEase. All rights reserved.</p>
      </footer>
    </div>
  );
}

const styles = {
  header: {
    padding: "10px",
    backgroundColor: "#282c34",
    color: "white",
    display: "flex",
    justifyContent: "flex-end",
    alignItems: "center",
  },
  section: {
    padding: "20px",
  },
  button: {
    padding: "10px 20px",
    backgroundColor: "#007bff",
    color: "white",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    margin: "5px",
  },
  footer: {
    padding: "10px",
    backgroundColor: "#282c34",
    color: "white",
    textAlign: "center",
    position: "fixed",
    bottom: "0",
    width: "100%",
  },
};

export default Home;

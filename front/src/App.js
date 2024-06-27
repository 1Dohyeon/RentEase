import React from "react";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import About from "./pages/About"; // About 페이지 추가
import Home from "./pages/Home";
import Login from "./pages/Login"; // Login 페이지 추가
import Register from "./pages/register";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="auth/login" element={<Login />} />
        <Route path="auth/register" element={<Register />} />
        <Route path="/about" element={<About />} />
      </Routes>
    </Router>
  );
}

export default App;

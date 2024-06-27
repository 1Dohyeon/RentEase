import React from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import Articles from "./pages/Articles";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";

const App: React.FC = () => {
  console.log(process.env.REACT_APP_API_BASE_URL);
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/articles" />} />
      <Route path="/articles" element={<Articles />} />
      <Route path="/auth/login" element={<Login />} />
      <Route path="/auth/register" element={<Register />} />
    </Routes>
  );
};

export default App;

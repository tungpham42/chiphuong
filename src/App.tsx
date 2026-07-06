// src/App.tsx
import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import AdminJobs from "./pages/AdminJobs";
import "./App.css";

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* Route Public cho ứng viên */}
        <Route path="/" element={<HomePage />} />

        {/* Route Admin cho HR quản lý */}
        <Route path="/quantri" element={<AdminJobs />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;

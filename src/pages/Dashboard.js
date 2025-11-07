"use client";

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Menu, X, Bell, UserCircle } from "lucide-react";
import "bootstrap/dist/css/bootstrap.min.css";
import Sidebar from "../components/Sidebar";

export default function Dashboard() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));
  const isAdmin = user && user.roleID === 1;
  const [sidebarOpen, setSidebarOpen] = useState(true);

  if (!isAdmin) {
    return (
      <div className="d-flex flex-column align-items-center justify-content-center vh-100 bg-light text-center">
        <h3 className="text-danger mb-3 fw-semibold">
          Bạn không có quyền truy cập
        </h3>
        <button
          onClick={() => navigate("/login")}
          className="btn btn-primary px-4 py-2 shadow-sm"
        >
          Quay lại đăng nhập
        </button>
      </div>
    );
  }

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <div className="d-flex vh-100 bg-light position-relative overflow-hidden">
      <h1>Xin chào</h1>
    </div>
  );
}

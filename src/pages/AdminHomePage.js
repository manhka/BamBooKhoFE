"use client";

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Menu, X, Bell, UserCircle } from "lucide-react";
import "bootstrap/dist/css/bootstrap.min.css";
import DashboardContent from "./DashboardContent";
import Sidebar from "./Sidebar";

export default function AdminHomePage() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));
  const isAdmin = user && user.roleID === 2;
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
      <Sidebar isOpen={sidebarOpen} onLogout={handleLogout} />

      <main
        className="flex-grow-1 d-flex flex-column"
        style={{
          marginLeft: sidebarOpen ? "250px" : "0",
          transition: "margin-left 0.35s ease",
        }}
      >
        <div className="bg-white shadow-sm px-4 py-3 d-flex justify-content-between align-items-center border-bottom">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="btn btn-outline-secondary d-flex align-items-center justify-content-center"
            style={{
              width: 38,
              height: 38,
              borderRadius: "50%",
              transition: "all 0.2s",
            }}
          >
            {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </button>

          <div className="d-flex align-items-center gap-3">
            <Bell size={20} />
            <UserCircle size={24} />
          </div>
        </div>
        <div className="flex-grow-1 overflow-auto">
          <DashboardContent />
        </div>
      </main>
    </div>
  );
}

import React, { useState } from "react";
import Sidebar from "../components/Sidebar";
import { Outlet, useNavigate } from "react-router-dom";
import { Menu } from "lucide-react";

export default function AppLayout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const navigate = useNavigate();
  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/login");
  };
  return (
    <div className="d-flex" style={{ minHeight: "100vh", overflow: "hidden" }}>
      {/* ===== Sidebar ===== */}
      <Sidebar isOpen={isSidebarOpen} onLogout={handleLogout} />

      {/* ===== Main content ===== */}
      <div
        className="flex-grow-1 d-flex flex-column"
        style={{
          marginLeft: isSidebarOpen ? "270px" : "0",
          width: isSidebarOpen ? "calc(100% - 270px)" : "100%",
          transition: "all 0.35s ease",
          backgroundColor: "#ffffff",
          minHeight: "100vh",
        }}
      >
        {/* ===== Header ===== */}
        <div
          className="d-flex align-items-center p-3  "
          style={{
            position: "fixed",
            top: 0,
            height: "72px",
          }}
        >
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="btn btn-light border me-3"
          >
            <Menu size={20} />
          </button>
        </div>

        {/* ===== Nội dung chính ===== */}
        <div
          className="flex-grow-1 overflow-auto "
          style={{
            backgroundColor: "#ffffff",
          }}
        >
          <Outlet />
        </div>
      </div>
    </div>
  );
}

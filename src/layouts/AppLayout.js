import React, { useState } from "react";
import Sidebar from "../components/Sidebar";
import StaffList from "../components/staffList";
import { Outlet, useNavigate } from "react-router-dom";
import { Menu } from "lucide-react";

export default function AppLayout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [currentPage, setCurrentPage] = useState(null);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  const handleSelectPage = (page) => {
    setCurrentPage(page);
  };

  const renderPage = () => {
    if (currentPage === "staffList") return <StaffList />;
    return <Outlet />; // fallback cho các route thật
  };

  return (
    <div className="d-flex" style={{ minHeight: "100vh" }}>
      <Sidebar
        isOpen={isSidebarOpen}
        onLogout={handleLogout}
        onSelectPage={handleSelectPage}
      />

      <div
        className="flex-grow-1"
        style={{
          marginLeft: isSidebarOpen ? "270px" : "0",
          transition: "margin-left 0.35s ease",
          backgroundColor: "#f8fafc",
        }}
      >
        <div className="d-flex align-items-center p-3 shadow-sm bg-white">
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="btn btn-light border me-3"
          >
            <Menu size={20} />
          </button>
          <h5 className="mb-0 text-secondary">Hệ thống quản lý</h5>
        </div>

        <div className="p-4">{renderPage()}</div>
      </div>
    </div>
  );
}

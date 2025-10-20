import React, { useState } from "react";
import Sidebar from "../components/Sidebar";
import { Outlet } from "react-router-dom";
import { Menu } from "lucide-react";

export default function AppLayout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  return (
    <div className="d-flex" style={{ minHeight: "100vh" }}>
      {/* Sidebar */}
      <Sidebar isOpen={isSidebarOpen} />

      {/* Nội dung chính */}
      <div
        className="flex-grow-1 position-relative"
        style={{
          marginLeft: isSidebarOpen ? "270px" : "0",
          transition: "margin-left 0.35s ease",
          backgroundColor: "#f8fafc",
          minHeight: "100vh",
        }}
      >
        {/* Thanh header chứa nút toggle */}
        <div
          className="d-flex align-items-center p-3 shadow-sm bg-white"
          style={{
            position: "sticky",
            top: 0,
            zIndex: 1000,
          }}
        >
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="btn btn-light border me-3"
          >
            <Menu size={20} />
          </button>
        </div>

        {/* Khu vực nội dung */}
        <div className="p-4">
          <Outlet />
        </div>
      </div>
    </div>
  );
}

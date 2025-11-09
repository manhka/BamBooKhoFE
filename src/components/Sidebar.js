"use client";

import React, { useState } from "react";
import {
  Users,
  Settings,
  BarChart3,
  LogOut,
  ChevronDown,
  ShoppingCart,
  ArrowDownSquare, 
  ArrowUpSquare,
  History
  Layers,
  Tag,
  LogIn,
  RefreshCcw,
} from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";

export default function Sidebar({ isOpen, onLogout, onSelectPage }) {
  const [expandedMenu, setExpandedMenu] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();
  const currentPath = location.pathname;

  const menuItems = [
    {
      id: "employees",
      label: "Nhân Viên",
      icon: Users,
      submenu: [
        { label: "Tất cả nhân viên", path: "/staffList" },
        { label: "Thêm nhân viên", path: "/register" },
      ],
    },
    {
      id: "products",
      label: "Sản phẩm",
      icon: ShoppingCart,
      submenu: [
        { label: "Danh sách sản phẩm", path: "products/list" },
        { label: "Thêm sản phẩm mới", path: "products/add" },
      ],
    },
    {
      id: "activities",
      label: "Hoạt động",
      icon: FileText,
      submenu: [
        { label: "Danh sách hoạt động", path: "/activityList" }
      ],
    },
    {
      id: "statistics",
      label: "Thống kế",
      icon: BarChart3,
      submenu: [
        { label: "Bao cáo", path: "/report" },
      ],
    },
      id: "change-products",
      label: "Đổi trả sản phẩm",
      icon: RefreshCcw,
      submenu: [
        {
          label: "Khách hàng đổi trả sản phẩm",
          path: "products/customer-rechange",
        },
        {
          label: "Danh sách đổi trả hàng",
          path: "customer-return/list",
        },
      ],
    },
    {
      id: "categories",
      label: "Danh mục",
      icon: Layers,
      submenu: [
        { label: "Danh sách danh mục", path: "/categories" },
        { label: "Thêm danh mục", path: "/categories/add" },
      ],
    },
    {
      id: "brands",
      label: "Thương hiệu",
      icon: Tag,
      submenu: [
        { label: "Danh sách thương hiệu", path: "/brands" },
        { label: "Thêm thương hiệu", path: "/brands/add" },
      ],
    },
    {
      id: "settings",
      label: "Cài đặt",
      icon: Settings,
      path: "/settings",
    },

    {
      id: "import", 
      label: "Nhập Kho",
      icon: ArrowDownSquare, 
      submenu: [
        { label: "Nhập từ Excel", path: "/import-upload" }, 
        { label: "Lịch sử nhập", path: "/import-history" }, 
      ],
    },

    {
      id: "export",
      label: "Xuất Kho",
      icon: ArrowUpSquare,
      submenu: [
        { label: "Tạo Phiếu Xuất", path: "/export-create" },
        { label: "Lịch Sử Xuất", path: "/export-history" },
      ],
    },

  ];

  

  return (
    <aside
      className="position-fixed top-0 start-0 h-100 d-flex flex-column justify-content-between shadow-sm"
      style={{
        width: "270px",
        background: "linear-gradient(180deg, #ffffff, #f8fafc)",
        borderRight: "1px solid #e2e8f0",
        transform: isOpen ? "translateX(0)" : "translateX(-100%)",
        transition: "transform 0.35s ease, opacity 0.3s ease",
        opacity: isOpen ? 1 : 0,
        zIndex: 1100,
        overflowY: "auto",
      }}
    >
      <div className="d-flex flex-column justify-content-between h-100 p-3">
        {/* Logo */}
        <div className="d-flex align-items-center mb-4 gap-2">
          <div
            className="d-flex align-items-center justify-content-center overflow-hidden rounded-2 border"
            style={{ width: 60, height: 40, backgroundColor: "#f1f5f9" }}
          >
            <img
              src="/assets/logo.png"
              alt="logo"
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
            />
          </div>
          <span className="fw-semibold fs-5 text-secondary">Admin</span>
        </div>

        {/* Menu */}
        <ul className="nav flex-column" style={{ gap: "6px" }}>
          {menuItems.map((item) => (
            <li key={item.id} className="nav-item">
              {/* --- Mục chính --- */}
              <button
                onClick={() =>
                  setExpandedMenu(expandedMenu === item.id ? null : item.id)
                }
                className="nav-link d-flex align-items-center gap-2 py-2 px-3 rounded w-100 text-start border-0"
                style={{
                  color: "#334155",
                  fontWeight: 500,
                  transition: "all 0.2s ease",
                }}
              >
                <item.icon size={18} />
                <span>{item.label}</span>
                <ChevronDown
                  size={16}
                  className={`ms-auto transition-transform ${
                    expandedMenu === item.id ? "rotate-180" : ""
                  }`}
                />
              </button>

              {/* --- Submenu --- */}
              {item.submenu &&
                expandedMenu === item.id &&
                item.submenu.map((sub, idx) => {
                  const isSubActive =
                    sub.path === currentPath || false; 
                  return (
                    <button
                      key={idx}
                      onClick={() => {
                        if (sub.path) navigate(sub.path);
                        else if (sub.page) onSelectPage(sub.page);
                      }}
                      className="btn w-100 text-start ps-5 py-1 small border-0"
                      style={{
                        color: isSubActive ? "#1e293b" : "#64748b",
                        backgroundColor: isSubActive
                          ? "#e2e8f0"
                          : "transparent",
                        transition: "all 0.2s ease",
                      }}
                      onMouseEnter={(e) => {
                        if (!isSubActive)
                          e.currentTarget.style.background = "#f1f5f9";
                      }}
                      onMouseLeave={(e) => {
                        if (!isSubActive)
                          e.currentTarget.style.background = "transparent";
                      }}
                    >
                      • {sub.label}
                    </button>
                  );
                })}
            </li>
          ))}
        </ul>

        {/* Logout */}
        <button
          onClick={onLogout}
          className="btn d-flex align-items-center gap-2 mt-auto"
          style={{
            color: "#dc2626",
            fontWeight: 500,
            background: "#fee2e2",
            border: "none",
            borderRadius: "8px",
            padding: "8px 12px",
            transition: "background 0.2s ease",
          }}
        >
          <LogOut size={18} />
          Đăng xuất
        </button>
      </div>
    </aside>
  );
}

"use client";

import React, { useState } from "react";
import {
  Users,
  Settings,
  BarChart3,
  LogOut,
  ChevronDown,
  ShoppingCart,
  Layers,
  Tag,
  LogIn,
  RefreshCcw,
} from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";

export default function Sidebar({ isOpen, onLogout }) {
  const [expandedMenu, setExpandedMenu] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();
  const currentPath = location.pathname;

  const menuItems = [
    {
      id: "dashboard",
      label: "Bảng Điều Khiển",
      icon: BarChart3,
      path: "/dashboard",
    },
    {
      id: "employees",
      label: "Nhân Viên",
      icon: Users,
      submenu: [
        { label: "Tất cả nhân viên", path: "/employees" },
        { label: "Thêm nhân viên", path: "/register" },
      ],
    },
    {
      id: "products",
      label: "Quản lý sản phẩm",
      icon: ShoppingCart,
      submenu: [
        { label: "Danh sách sản phẩm", path: "products/list" },
        { label: "Thêm sản phẩm mới", path: "products/add" },
      ],
    },
    {
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
          {menuItems.map((item) => {
            const isActive =
              item.path === currentPath ||
              (item.submenu &&
                item.submenu.some((sub) => sub.path === currentPath));

            return (
              <li key={item.id} className="nav-item">
                <button
                  onClick={() => {
                    if (item.submenu) {
                      setExpandedMenu(
                        expandedMenu === item.id ? null : item.id
                      );
                    } else {
                      navigate(item.path);
                    }
                  }}
                  className="nav-link d-flex align-items-center gap-2 py-2 px-3 rounded w-100 text-start border-0"
                  style={{
                    color: "#334155",
                    fontWeight: 500,
                    transition: "all 0.2s ease",
                    backgroundColor: isActive ? "#e2e8f0" : "transparent",
                  }}
                  onMouseEnter={(e) => {
                    if (!isActive) e.currentTarget.style.background = "#f1f5f9";
                  }}
                  onMouseLeave={(e) => {
                    if (!isActive)
                      e.currentTarget.style.background = "transparent";
                  }}
                >
                  <item.icon size={18} />
                  <span style={{ color: isActive ? "#1e293b" : "#334155" }}>
                    {item.label}
                  </span>
                  {item.submenu && (
                    <ChevronDown
                      size={16}
                      className={`ms-auto transition-transform ${
                        expandedMenu === item.id ? "rotate-180" : ""
                      }`}
                    />
                  )}
                </button>

                {/* Submenu */}
                {item.submenu &&
                  expandedMenu === item.id &&
                  item.submenu.map((sub, idx) => {
                    const isSubActive = sub.path === currentPath;
                    return (
                      <button
                        key={idx}
                        onClick={() => navigate(sub.path)}
                        className="btn w-100 text-start ps-5 py-1 small border-0"
                        style={{
                          color: isSubActive ? "#1e293b" : "#64748b",
                          backgroundColor: isSubActive
                            ? "#e2e8f0"
                            : "transparent",
                          textDecoration: "none",
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
            );
          })}
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
          onMouseEnter={(e) => (e.currentTarget.style.background = "#fecaca")}
          onMouseLeave={(e) => (e.currentTarget.style.background = "#fee2e2")}
        >
          <LogOut size={18} />
          Logout
        </button>
      </div>
    </aside>
  );
}

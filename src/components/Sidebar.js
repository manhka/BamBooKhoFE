import React, { useState } from "react";
import {
  Users,
  BarChart3,
  LogOut,
  ChevronDown,
  ShoppingCart,
  ArrowDownSquare,
  ArrowUpSquare,
  Layers,
  Tag,
  RefreshCcw,
  FileText,
  Activity,
} from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";

export default function Sidebar({ isOpen, onLogout, onSelectPage }) {
  const [expandedMenu, setExpandedMenu] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();
  const currentPath = location.pathname;

  const userData = localStorage.getItem("user");
  const roleID = userData ? Number(JSON.parse(userData).roleID) : null;
  const userName = userData ? JSON.parse(userData).username : "User";

  const menuItems = [
    {
      id: "dashboard-admin",
      label: "Dashboard",
      icon: BarChart3,
      path: "/admin/dashboard",
      roles: [1],
    },
    {
      id: "dashboard-staff",
      label: "Dashboard",
      icon: BarChart3,
      path: "/staff/dashboard",
      roles: [2],
    },
    {
      id: "report",
      label: "Báo cáo",
      icon: FileText,
      path: "/report",
      roles: [1],
    },
    {
      id: "activities",
      label: "Hoạt động",
      icon: FileText,
      roles: [1],
      submenu: [{ label: "Danh sách hoạt động", path: "/activities" }],
    },
    {
      id: "employees",
      label: "Nhân viên",
      icon: Users,
      roles: [1],
      submenu: [
        { label: "Tất cả nhân viên", path: "/staffList" },
        { label: "Thêm nhân viên", path: "/register" },
      ],
    },
    {
      id: "products",
      label: "Sản phẩm",
      icon: ShoppingCart,
      roles: [2],
      submenu: [
        { label: "Danh sách sản phẩm", path: "/products/list" },
        { label: "Thêm sản phẩm mới", path: "/products/add" },
      ],
    },
    {
      id: "change-products",
      label: "Đổi trả sản phẩm",
      icon: RefreshCcw,
      roles: [2],
      submenu: [
        { label: "Khách hàng đổi trả", path: "/products/customer-rechange" },
        { label: "Danh sách đổi trả", path: "/customer-return/list" },
      ],
    },
    {
      id: "categories",
      label: "Danh mục",
      icon: Layers,
      roles: [2],
      submenu: [
        { label: "Danh sách danh mục", path: "/categories" },
        { label: "Thêm danh mục", path: "/categories/add" },
      ],
    },
    {
      id: "brands",
      label: "Thương hiệu",
      icon: Tag,
      roles: [2],
      submenu: [
        { label: "Danh sách thương hiệu", path: "/brands" },
        { label: "Thêm thương hiệu", path: "/brands/add" },
      ],
    },
    {
      id: "import",
      label: "Nhập kho",
      icon: ArrowDownSquare,
      roles: [2],
      submenu: [
        { label: "Nhập hàng", path: "/import" },
        { label: "Lịch sử nhập hàng", path: "/import-history" },
      ],
    },
    {
      id: "export",
      label: "Xuất kho",
      icon: ArrowUpSquare,
      roles: [2],
      submenu: [
        { label: "Xuất hàng", path: "/export" },
        { label: "Lịch sử xuất hàng", path: "/export-history" },
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
          <span className="fw-bold text-dark" style={{ fontSize: "1rem" }}>
            {userName}
          </span>{" "}
        </div>

        {/* Menu */}
        <ul className="nav flex-column" style={{ gap: "6px" }}>
          {menuItems
            .filter((item) => !item.roles || item.roles.includes(roleID))
            .map((item) => (
              <li key={item.id} className="nav-item">
                <button
                  onClick={() => {
                    if (item.submenu) {
                      setExpandedMenu(
                        expandedMenu === item.id ? null : item.id
                      );
                    } else if (item.path) {
                      navigate(item.path);
                    }
                  }}
                  className="nav-link d-flex align-items-center gap-2 py-2 px-3 rounded w-100 text-start border-0"
                  style={{
                    color: "#334155",
                    fontWeight: 500,
                    transition: "all 0.2s ease",
                  }}
                >
                  <item.icon size={18} />
                  <span>{item.label}</span>
                  {item.submenu && (
                    <ChevronDown
                      size={16}
                      className={`ms-auto ${
                        expandedMenu === item.id ? "rotate-180" : ""
                      }`}
                    />
                  )}
                </button>

                {item.submenu &&
                  expandedMenu === item.id &&
                  item.submenu.map((sub, idx) => {
                    const isActive = sub.path === currentPath;
                    return (
                      <button
                        key={idx}
                        onClick={() => navigate(sub.path)}
                        className="btn w-100 text-start ps-5 py-1 small border-0"
                        style={{
                          color: isActive ? "#1e293b" : "#64748b",
                          backgroundColor: isActive ? "#e2e8f0" : "transparent",
                          transition: "all 0.2s ease",
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
          }}
        >
          <LogOut size={18} />
          Đăng xuất
        </button>
      </div>
    </aside>
  );
}

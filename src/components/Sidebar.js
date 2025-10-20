"use client";

import React, { useState } from "react";
import {
  LayoutDashboard,
  Users,
  Settings,
  BarChart3,
  FileText,
  LogOut,
  ChevronDown,
} from "lucide-react";
import { Link } from "react-router-dom";

export default function Sidebar({ isOpen, onLogout }) {
  const [expandedMenu, setExpandedMenu] = useState(null);
  // thay doi content o day
  const menuItems = [
    {
      id: "employees",
      label: "Nhân Viên",
      icon: Users,
      href: "#",
      submenu: [
        { label: "Tất cả nhân viên", href: "#" },
        { label: "Thêm nhân viên", href: "/register" },
        { label: "Phòng ban", href: "#" },
      ],
    },
    { id: "reports", label: "Thống kê", icon: BarChart3, href: "#" },
    { id: "documents", label: "Tài liệu", icon: FileText, href: "#" },
    { id: "settings", label: "Cài đặt", icon: Settings, href: "#" },
  ];

  return (
    <aside
      className={`position-fixed top-0 start-0 h-100 text-white d-flex flex-column justify-content-between shadow-lg transition-all`}
      style={{
        width: "250px",
        background: "linear-gradient(180deg, #0f172a, #1e293b)",
        transform: isOpen ? "translateX(0)" : "translateX(-100%)",
        transition: "transform 0.35s ease",
        zIndex: 1040,
      }}
    >
      <div className="d-flex flex-column justify-content-between h-100 p-3">
        <div>
          <div className="d-flex align-items-center mb-4 gap-2">
            <div
              className="bg-primary d-flex align-items-center justify-content-center rounded-circle text-white"
              style={{ width: 40, height: 40, fontWeight: "bold" }}
            >
              A
            </div>
            <span className="fw-bold fs-5 text-white">Admin</span>
          </div>

          <ul className="nav flex-column" style={{ gap: "5px" }}>
            {menuItems.map((item) => (
              <li key={item.id} className="nav-item">
                <button
                  onClick={() =>
                    setExpandedMenu(expandedMenu === item.id ? null : item.id)
                  }
                  className="nav-link text-white d-flex align-items-center gap-2 py-2 px-2 rounded w-100 text-start border-0 bg-transparent"
                  style={{
                    transition: "all 0.2s ease",
                  }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.background = "#1e293b")
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.background = "transparent")
                  }
                >
                  <item.icon size={18} />
                  <span>{item.label}</span>
                  {item.submenu && (
                    <ChevronDown
                      size={16}
                      className={`ms-auto transition-transform ${
                        expandedMenu === item.id ? "rotate-180" : ""
                      }`}
                    />
                  )}
                </button>

                {item.submenu &&
                  expandedMenu === item.id &&
                  item.submenu.map((sub, idx) => (
                    <Link
                      key={idx}
                      to={sub.href}
                      className="d-block text-white-50 ps-4 py-1 small"
                    >
                      • {sub.label}
                    </Link>
                  ))}
              </li>
            ))}
          </ul>
        </div>

        <button
          onClick={onLogout}
          className="btn text-danger d-flex align-items-center gap-2 mt-auto"
          style={{ fontWeight: 500 }}
        >
          <LogOut size={18} />
          Logout
        </button>
      </div>
    </aside>
  );
}

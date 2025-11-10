"use client";
import React from "react";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import Chart from "../components/Chart";
import Info from "../components/Info";
export default function Dashboard() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));
  const isAdmin = user && user.roleID === 1;
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

  return (
    <div className="d-flex vh-100 bg-light position-relative overflow-hidden p-3">
      <div className="d-flex flex-column flex-grow-1 w-100 gap-3">
        <div
          className="overflow-auto bg-white rounded-4 shadow-sm border p-3"
          style={{ borderColor: "#dee2e6", flex: "4", minHeight: "200px" }}
        >
          <Info />
        </div>
        <div
          className="overflow-hidden bg-white rounded-4 shadow-sm border p-3 d-flex flex-column"
          style={{ borderColor: "#dee2e6", flex: "6", minHeight: "300px" }}
        >
          <Chart />
        </div>
      </div>
    </div>
  );
}

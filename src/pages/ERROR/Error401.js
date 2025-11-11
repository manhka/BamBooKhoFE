import React from "react";
import { useNavigate } from "react-router-dom";

const Error401 = () => {
  const navigate = useNavigate();

  return (
    <div
      className="d-flex flex-column justify-content-center align-items-center"
      style={{ height: "100vh", backgroundColor: "#f8f9fa" }}
    >
      <h1 style={{ fontSize: "6rem", color: "#ffc107" }}>401</h1>
      <h2 className="mb-3">Unauthorized</h2>
      <p className="mb-4 text-center" style={{ maxWidth: "400px" }}>
        Bạn chưa đăng nhập hoặc token không hợp lệ. Vui lòng đăng nhập để tiếp
        tục.
      </p>
      <button className="btn btn-primary" onClick={() => navigate("/login")}>
        Đăng nhập
      </button>
    </div>
  );
};

export default Error401;

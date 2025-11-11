import React from "react";
import { useNavigate } from "react-router-dom";

const Error403 = () => {
  const navigate = useNavigate();

  return (
    <div
      className="d-flex flex-column justify-content-center align-items-center"
      style={{ height: "100vh", backgroundColor: "#f8f9fa" }}
    >
      <h1 style={{ fontSize: "6rem", color: "#dc3545" }}>403</h1>
      <h2 className="mb-3">Forbidden</h2>
      <p className="mb-4 text-center" style={{ maxWidth: "400px" }}>
        Bạn không có quyền truy cập vào trang này. Vui lòng liên hệ quản trị
        viên nếu cần.
      </p>
      <button className="btn btn-primary" onClick={() => navigate(-1)}>
        Quay lại
      </button>
    </div>
  );
};

export default Error403;

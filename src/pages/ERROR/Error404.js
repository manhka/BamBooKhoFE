import React from "react";
import { useNavigate } from "react-router-dom";

const Error404 = () => {
  const navigate = useNavigate();

  return (
    <div
      className="d-flex flex-column justify-content-center align-items-center"
      style={{ height: "100vh", backgroundColor: "#f8f9fa" }}
    >
      <h1 style={{ fontSize: "6rem", color: "#ffc107" }}>404</h1>
      <h2 className="mb-3">Page Not Found</h2>
      <p className="mb-4 text-center" style={{ maxWidth: "400px" }}>
        Trang bạn tìm kiếm không tồn tại hoặc đã bị xóa. Vui lòng kiểm tra lại
        URL.
      </p>
      <button className="btn btn-primary" onClick={() => navigate(-1)}>
        Về trang trước
      </button>
    </div>
  );
};

export default Error404;

import React from "react";
import { useNavigate } from "react-router-dom";

const Error400 = () => {
  const navigate = useNavigate();

  return (
    <div
      className="d-flex flex-column justify-content-center align-items-center"
      style={{ height: "100vh", backgroundColor: "#f8f9fa" }}
    >
      <h1 style={{ fontSize: "6rem", color: "#dc3545" }}>400</h1>
      <h2 className="mb-3">Bad Request</h2>
      <p className="mb-4 text-center" style={{ maxWidth: "400px" }}>
        Yêu cầu gửi lên server không hợp lệ. Vui lòng kiểm tra lại dữ liệu.
      </p>
      <button className="btn btn-primary" onClick={() => navigate(-1)}>
        Quay lại
      </button>
    </div>
  );
};

export default Error400;

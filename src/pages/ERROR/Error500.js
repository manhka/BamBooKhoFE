import React from "react";
import { useNavigate } from "react-router-dom";

const Error500 = () => {
  const navigate = useNavigate();

  return (
    <div
      className="d-flex flex-column justify-content-center align-items-center"
      style={{ height: "100vh", backgroundColor: "#f8f9fa" }}
    >
      <h1 style={{ fontSize: "6rem", color: "#dc3545" }}>500</h1>
      <h2 className="mb-3">Internal Server Error</h2>
      <p className="mb-4 text-center" style={{ maxWidth: "400px" }}>
        Server gặp sự cố, không thể xử lý yêu cầu của bạn. Vui lòng thử lại sau.
      </p>
      <button className="btn btn-primary" onClick={() => navigate(-1)}>
        Quay lại
      </button>
    </div>
  );
};

export default Error500;

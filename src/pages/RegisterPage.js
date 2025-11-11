import React, { useState } from "react";
import { register } from "../services/authService";
import { Eye, EyeOff } from "lucide-react";
import BackButton from "../components/BackButton";
import { useApiWithErrorRedirect } from "../hooks/useApiWithErrorRedirect";

const RegisterPage = () => {
  const { callApi } = useApiWithErrorRedirect();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const validateInput = () => {
    const usernameRegex = /^\S{3,}$/;
    if (!usernameRegex.test(username)) {
      setError(
        "⚠️ Tên đăng nhập phải có ít nhất 3 ký tự và không chứa dấu cách."
      );
      return false;
    }

    if (password.length < 6) {
      setError("⚠️ Mật khẩu phải có ít nhất 6 ký tự.");
      return false;
    }

    const phoneRegex = /^0\d{9}$/;
    if (!phoneRegex.test(phone)) {
      setError(
        "⚠️ Số điện thoại không hợp lệ. (Phải là 10 số, bắt đầu bằng 0)."
      );
      return false;
    }

    return true;
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!validateInput()) return;

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("Vui lòng đăng nhập bằng tài khoản admin trước.");
        return;
      }

      await callApi(register, username, password, phone, 1, token);
      setSuccess("✅ Đăng ký nhân viên thành công!");
      setUsername("");
      setPassword("");
      setPhone("");
    } catch (err) {
      console.error("Register error:", err);
      setError(err.response?.data?.message || "Đăng ký thất bại");
    }
  };

  return (
    <div
      style={{
        fontFamily: "Times New Roman, Times, serif",
        backgroundImage: "url('assets/bamboo-forest.jpg')",
        backgroundSize: "cover",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          background: "white",
          borderRadius: "12px",
          boxShadow: "0 4px 15px rgba(0, 0, 0, 0.1)",
          overflow: "hidden",
          width: "800px",
          maxWidth: "95%",
        }}
      >
        <div style={{ flex: 1, padding: "40px" }}>
          <BackButton />
          <h2
            style={{
              marginBottom: "20px",
              fontSize: "40px",
              textAlign: "center",
              color: "green",
            }}
          >
            Đăng Ký Nhân Viên
          </h2>

          <form onSubmit={handleRegister}>
            {/* Username */}
            <div style={{ marginBottom: "20px" }}>
              <label style={{ display: "block", marginBottom: "5px" }}>
                Tên đăng nhập
              </label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                style={{
                  width: "100%",
                  padding: "10px",
                  borderRadius: "6px",
                  border: "1px solid #ccc",
                }}
              />
            </div>

            {/* Password */}
            <div style={{ marginBottom: "20px", position: "relative" }}>
              <label style={{ display: "block", marginBottom: "5px" }}>
                Mật khẩu
              </label>
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                style={{
                  width: "100%",
                  padding: "10px 40px 10px 10px",
                  borderRadius: "6px",
                  border: "1px solid #ccc",
                }}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  position: "absolute",
                  right: "10px",
                  top: "35px",
                  border: "none",
                  background: "none",
                  cursor: "pointer",
                  padding: 0,
                }}
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>

            {/* Phone */}
            <div style={{ marginBottom: "20px" }}>
              <label style={{ display: "block", marginBottom: "5px" }}>
                Số điện thoại
              </label>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
                style={{
                  width: "100%",
                  padding: "10px",
                  borderRadius: "6px",
                  border: "1px solid #ccc",
                }}
              />
            </div>

            {/* Error / Success */}
            {error && (
              <p
                style={{ color: "red", fontSize: "14px", marginBottom: "10px" }}
              >
                {error}
              </p>
            )}
            {success && (
              <p
                style={{
                  color: "green",
                  fontSize: "14px",
                  marginBottom: "10px",
                }}
              >
                {success}
              </p>
            )}

            <button
              type="submit"
              style={{
                width: "100%",
                padding: "10px",
                backgroundColor: "#28a745",
                color: "white",
                border: "none",
                borderRadius: "6px",
                cursor: "pointer",
                fontSize: "16px",
              }}
            >
              Đăng ký
            </button>
          </form>
        </div>

        {/* Image */}
        <div style={{ flex: 1 }}>
          <img
            src="/assets/panda.webp"
            alt="Panda"
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;

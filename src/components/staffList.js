import React, { useEffect, useState } from "react";
import axios from "axios";
import { Pencil, Power, PowerOff, Search } from "lucide-react";
import "bootstrap/dist/css/bootstrap.min.css";

const StaffList = () => {
  const [employees, setEmployees] = useState([]);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(4);
  const [showModal, setShowModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [formData, setFormData] = useState({
    Username: "",
    Password: "",
    Phone: "",
  });
  const [alertMessage, setAlertMessage] = useState("");
  const [alertType, setAlertType] = useState("");
  const token = localStorage.getItem("token");

  const fetchEmployees = async () => {
    try {
      const res = await axios.get("http://localhost:3001/api/users/role", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setEmployees(res.data);
    } catch (error) {
      console.error(
        "Lỗi tải nhân viên:",
        error.response?.data || error.message
      );
      showAlert("Không thể tải danh sách nhân viên.", "danger");
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  useEffect(() => {
    setCurrentPage(1);
  }, [search, itemsPerPage]);

  const showAlert = (message, type) => {
    setAlertMessage(message);
    setAlertType(type);
    setTimeout(() => {
      setAlertMessage("");
      setAlertType("");
    }, 30000);
  };

  const handleToggle = async (id) => {
    try {
      await axios.put(
        `http://localhost:3001/api/users/toggle/${id}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setEmployees((prev) =>
        prev.map((emp) =>
          emp.UserID === id ? { ...emp, Status: emp.Status === 1 ? 0 : 1 } : emp
        )
      );
      showAlert("Đã thay đổi trạng thái nhân viên.", "success");
    } catch (error) {
      console.error("Lỗi toggle:", error.response?.data || error.message);
      showAlert("Không thể thay đổi trạng thái nhân viên.", "danger");
    }
  };

  const handleEdit = (id) => {
    const user = employees.find((e) => e.UserID === id);
    if (user) {
      setSelectedUser(user);
      setFormData({
        Username: user.Username,
        Password: "",
        Phone: user.Phone || "",
      });
      setShowModal(true);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    try {
      await axios.put(
        `http://localhost:3001/api/users/edit/${selectedUser.UserID}`,
        formData,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setShowModal(false);
      fetchEmployees();
      showAlert("Cập nhật thông tin nhân viên thành công!", "success");
    } catch (error) {
      console.error("Lỗi cập nhật:", error.response?.data || error.message);
      showAlert("Không thể cập nhật thông tin nhân viên.", "danger");
    }
  };

  const filteredEmployees = employees.filter((emp) =>
    emp.Username?.toLowerCase().includes(search.toLowerCase())
  );

  const totalPages = Math.ceil(filteredEmployees.length / itemsPerPage);
  const indexOfLast = currentPage * itemsPerPage;
  const indexOfFirst = indexOfLast - itemsPerPage;
  const currentEmployees = filteredEmployees.slice(indexOfFirst, indexOfLast);

  return (
    <div className="container mt-4">
      {alertMessage && (
        <p
          className={`text-center fw-bold mt-2 ${
            alertType === "success" ? "text-success" : "text-danger"
          }`} style ={{ fontSize: "20px" }}
        >
          {alertMessage}
        </p>
      )}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="fw-bold m-0">Danh sách nhân viên</h2>

        <div className="input-group" style={{ maxWidth: "300px" }}>
          <span className="input-group-text bg-light">
            <Search size={18} />
          </span>
          <input
            type="text"
            className="form-control"
            placeholder="Tìm nhân viên..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      <div className="table-responsive">
        <table className="table table-striped table-hover align-middle text-center shadow-sm">
          <thead className="table-success">
            <tr>
              <th>STT</th>
              <th>Tên đăng nhập</th>
              <th>Số điện thoại</th>
              <th>Trạng thái</th>
              <th>Hành động</th>
            </tr>
          </thead>
          <tbody>
            {currentEmployees.length > 0 ? (
              currentEmployees.map((emp, index) => (
                <tr key={emp.UserID}>
                  <td>{indexOfFirst + index + 1}</td>
                  <td>{emp.Username}</td>
                  <td>{emp.Phone || "-"}</td>
                  <td>
                    <span
                      className={`fw-semibold ${
                        emp.Status === 1 ? "text-success" : "text-danger"
                      }`}
                    >
                      {emp.Status === 1 ? "Hoạt động" : "Nghỉ"}
                    </span>
                  </td>
                  <td>
                    <button
                      className="btn btn-warning btn-sm me-2"
                      onClick={() => handleEdit(emp.UserID)}
                    >
                      <Pencil size={16} className="me-1" />
                    </button>
                    <button
                      className={`btn btn-sm ${
                        emp.Status === 1 ? "btn-danger" : "btn-success"
                      }`}
                      onClick={() => handleToggle(emp.UserID)}
                    >
                      {emp.Status === 1 ? (
                        <>
                          <PowerOff size={16} className="me-1" />
                        </>
                      ) : (
                        <>
                          <Power size={16} className="me-1" />
                          Kích hoạt
                        </>
                      )}
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className="text-muted py-3">
                  Không tìm thấy nhân viên nào.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <nav>
          <ul className="pagination justify-content-center mt-3">
            <li className={`page-item ${currentPage === 1 ? "disabled" : ""}`}>
              <button className="page-link" onClick={() => setCurrentPage(1)}>
                «
              </button>
            </li>
            <li className={`page-item ${currentPage === 1 ? "disabled" : ""}`}>
              <button
                className="page-link"
                onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
              >
                ‹
              </button>
            </li>

            {Array.from({ length: totalPages }, (_, i) => (
              <li
                key={i}
                className={`page-item ${currentPage === i + 1 ? "active" : ""}`}
              >
                <button
                  className="page-link"
                  onClick={() => setCurrentPage(i + 1)}
                >
                  {i + 1}
                </button>
              </li>
            ))}

            <li
              className={`page-item ${
                currentPage === totalPages ? "disabled" : ""
              }`}
            >
              <button
                className="page-link"
                onClick={() =>
                  setCurrentPage((p) => Math.min(p + 1, totalPages))
                }
              >
                ›
              </button>
            </li>
            <li
              className={`page-item ${
                currentPage === totalPages ? "disabled" : ""
              }`}
            >
              <button
                className="page-link"
                onClick={() => setCurrentPage(totalPages)}
              >
                »
              </button>
            </li>
          </ul>
        </nav>
      )}

      {showModal && (
        <div
          className="modal show fade"
          style={{ display: "block", background: "rgba(0,0,0,0.4)" }}
        >
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header bg-success text-white">
                <h5 className="modal-title">Chỉnh sửa nhân viên</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setShowModal(false)}
                ></button>
              </div>
              <div className="modal-body">
                <div className="mb-3">
                  <label className="form-label">Tên đăng nhập</label>
                  <input
                    type="text"
                    className="form-control"
                    name="Username"
                    value={formData.Username}
                    onChange={handleChange}
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">
                    Mật khẩu (để trống nếu không đổi)
                  </label>
                  <input
                    type="password"
                    className="form-control"
                    name="Password"
                    value={formData.Password}
                    onChange={handleChange}
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Số điện thoại</label>
                  <input
                    type="text"
                    className="form-control"
                    name="Phone"
                    value={formData.Phone}
                    onChange={handleChange}
                  />
                </div>
              </div>
              <div className="modal-footer">
                <button
                  className="btn btn-secondary"
                  onClick={() => setShowModal(false)}
                >
                  Hủy
                </button>
                <button className="btn btn-success" onClick={handleSave}>
                  Lưu thay đổi
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StaffList;

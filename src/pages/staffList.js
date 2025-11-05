import React, { useEffect, useState } from "react";
import axios from "axios";
import { Pencil, Power, PowerOff, Search, Plus, Trash2 } from "lucide-react";
import "bootstrap/dist/css/bootstrap.min.css";

const StaffList = () => {
  const [employees, setEmployees] = useState([]);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(2);
  const [showModal, setShowModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [activities, setActivities] = useState([]); 
  const [staffActivities, setStaffActivities] = useState([]);
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

      const normalized = res.data.map((emp) => ({
        ...emp,
        Status: emp.Status === true || emp.Status === "1" || emp.Status === 1 ? 1 : 0,
      }));

      const withActivities = await Promise.all(
        normalized.map(async (emp) => {
          try {
            const actRes = await axios.get(
              `http://localhost:3001/api/activities/staff-activities/${emp.UserID}`,
              { headers: { Authorization: `Bearer ${token}` } }
            );
            return { ...emp, activities: actRes.data || [] };
          } catch {
            return { ...emp, activities: [] };
          }
        })
      );

      setEmployees(withActivities);
    } catch (error) {
      console.error("Lỗi tải nhân viên:", error.response?.data || error.message);
      showAlert("Không thể tải danh sách nhân viên.", "danger");
    }
  };

  const fetchAllActivities = async () => {
    try {
      const res = await axios.get("http://localhost:3001/api/activities/view", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setActivities(res.data);
    } catch (error) {
      console.error("Lỗi tải activity:", error.response?.data || error.message);
    }
  };

  useEffect(() => {
    fetchEmployees();
    fetchAllActivities();
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
    }, 3000);
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
  const handleEdit = async (id) => {
    const user = employees.find((e) => e.UserID === id);
    if (!user) return;
    setSelectedUser(user);
    setFormData({
      Username: user.Username,
      Password: "",
      Phone: user.Phone || "",
    });

    try {
      const res = await axios.get(
        `http://localhost:3001/api/activities/staff-activities/${id}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setStaffActivities(res.data || []);
      console.log(res.data);
    } catch (err) {
      console.error("Lỗi load activity nhân viên:", err);
      setStaffActivities([]);
    }

    setShowModal(true);
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

    const newActivities = staffActivities.filter(a => a.isNew);
    if (newActivities.length > 0) {
      const activityIds = newActivities.map(a => a.ActivityID);
      await axios.post(
        "http://localhost:3001/api/activities/staff-activities",
        {
          UserID: selectedUser.UserID,
          ActivityID: activityIds, 
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
    }

    setShowModal(false);
    fetchEmployees();
    showAlert("Cập nhật nhân viên và giao hoạt động thành công!", "success");
  } catch (error) {
    console.error("Lỗi lưu:", error.response?.data || error.message);
    showAlert("Không thể lưu thay đổi.", "danger");
  }
};
  const handleAssignActivity = (activityId) => {
  const id = Number(activityId);
  const selectedActivity = activities.find(a => Number(a.ActivityID) === id);
  if (!selectedActivity) return;

  const exists = staffActivities.some(a => Number(a.ActivityID) === id);
  if (exists) {
    showAlert("Nhân viên đã được giao hoạt động này.", "danger");
    return;
  }

  setStaffActivities(prev => [
    ...prev,
    {
      StaffActivityID: Date.now(), 
      ActivityID: id,
      ActivityName: selectedActivity.ActivityName || selectedActivity.Name,
      Description: selectedActivity.Description,
      isNew: true,
    },
  ]);
};
  const handleRemoveActivity = async (staffActivityId) => {
    try {
      await axios.delete(
        `http://localhost:3001/api/activities/staff-activities/${staffActivityId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      showAlert("Đã xóa activity khỏi nhân viên!", "success");
      setStaffActivities((prev) => prev.filter((a) => a.StaffActivityID !== staffActivityId));
      fetchEmployees();
    } catch (error) {
      console.error("Lỗi xóa activity:", error);
      showAlert("Không thể xóa activity.", "danger");
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
          }`}
          style={{ fontSize: "20px" }}
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
              <th>Hoạt động đảm nhận</th>
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
                    {emp.activities?.length > 0 ? (
                      emp.activities.map((a) => (
                        <div key={a.StaffActivityID}>{a.ActivityName || "Không tên"}</div>
                      ))
                    ) : (
                      <span className="text-muted">Chưa có</span>
                    )}
                  </td>
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
                      <Pencil size={16} />
                    </button>
                    <button
                      className={`btn btn-sm ${
                        emp.Status === 1 ? "btn-danger" : "btn-success"
                      }`}
                      onClick={() => handleToggle(emp.UserID)}
                    >
                      {emp.Status === 1 ? <PowerOff size={16} /> : <Power size={16} />}
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6} className="text-muted py-3">
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
          </ul>
        </nav>
      )}

      {showModal && (
        <div
          className="modal show fade"
          style={{ display: "block", background: "rgba(0,0,0,0.4)" }}
        >
          <div className="modal-dialog modal-lg modal-dialog-centered">
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
                <div className="row">
                  <div className="col-md-6">
                    <label className="form-label">Tên đăng nhập</label>
                    <input
                      type="text"
                      className="form-control mb-2"
                      name="Username"
                      value={formData.Username}
                      onChange={handleChange}
                    />
                    <label className="form-label">
                      Mật khẩu (để trống nếu không đổi)
                    </label>
                    <input
                      type="password"
                      className="form-control mb-2"
                      name="Password"
                      value={formData.Password}
                      onChange={handleChange}
                    />
                    <label className="form-label">Số điện thoại</label>
                    <input
                      type="text"
                      className="form-control mb-3"
                      name="Phone"
                      value={formData.Phone}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="col-md-6">
                    <label className="form-label fw-bold">Hoạt động đang đảm nhận</label>
                    <ul className="list-group mb-2">
                      {staffActivities.length > 0 ? (
                        staffActivities.map((a) => (
                          <li
                            key={a.StaffActivityID}
                            className="list-group-item d-flex justify-content-between align-items-center"
                          >
                            {a.ActivityName || "Không tên"}
                            <button
                              className="btn btn-sm btn-outline-danger"
                              onClick={() => handleRemoveActivity(a.StaffActivityID)}
                            >
                              <Trash2 size={14} />
                            </button>
                          </li>
                        ))
                      ) : (
                        <li className="list-group-item text-muted">
                          Chưa được giao hoạt động nào.
                        </li>
                      )}
                    </ul>

                    <div className="input-group">
                      <select
                        className="form-select"
                        defaultValue=""
                        onChange={(e) =>
                          e.target.value && handleAssignActivity(e.target.value)
                        }
                      >
                        <option value="">-- Giao thêm hoạt động --</option>
                        {activities.map((a) => (
                          <option key={a.ActivityID} value={a.ActivityID}>
                            {a.ActivityName}
                          </option>
                        ))}
                      </select>
                      <span className="input-group-text bg-light">
                        <Plus size={16} />
                      </span>
                    </div>
                  </div>
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

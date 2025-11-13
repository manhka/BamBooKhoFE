import React, { useEffect, useState } from "react";
import { useApiWithErrorRedirect } from "../hooks/useApiWithErrorRedirect";
import {
  getAllActivities,
  createActivity,
  updateActivity,
  assignActivitiesToStaff,
  removeStaffActivity,
} from "../services/activityService";
import { showAlert } from "../utils/toast";
import { Edit2, Plus, Search } from "lucide-react";

export default function ActivityPage() {
  const { callApi } = useApiWithErrorRedirect();
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(false);

  // Modal & form state
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [editModal, setEditModal] = useState({ open: false, activity: null });
  const [form, setForm] = useState({ ActivityName: "", Description: "" });
  const [editForm, setEditForm] = useState({
    ActivityName: "",
    Description: "",
  });

  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // --- Fetch Activities ---
  const fetchActivities = async () => {
    setLoading(true);
    try {
      const data = await callApi(() => getAllActivities());
      setActivities(data);
    } catch (error) {
      showAlert(error.message || "Lỗi khi lấy danh sách hoạt động", "danger");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchActivities();
  }, []);

  // --- Create Activity ---
  const handleCreate = async (e) => {
    e.preventDefault();
    if (!form.ActivityName) return;

    try {
      await callApi(() => createActivity(form));
      showAlert("Tạo hoạt động thành công", "success");
      setForm({ ActivityName: "", Description: "" });
      setCreateModalOpen(false);
      fetchActivities();
    } catch (error) {
      showAlert(error.message || "Lỗi khi tạo hoạt động", "danger");
    }
  };

  // --- Open/Close Edit Modal ---
  const openEditModal = (activity) => {
    setEditForm({
      ActivityName: activity.ActivityName,
      Description: activity.Description || "",
    });
    setEditModal({ open: true, activity });
  };
  const closeEditModal = () => setEditModal({ open: false, activity: null });

  // --- Update Activity ---
  const handleEdit = async (e) => {
    e.preventDefault();
    if (!editForm.ActivityName) {
      return showAlert("Tên hoạt động không được để trống", "warning");
    }
    try {
      await callApi(() =>
        updateActivity(editModal.activity.ActivityID, editForm)
      );
      showAlert("Cập nhật hoạt động thành công", "success");
      closeEditModal();
      fetchActivities();
    } catch (error) {
      showAlert(error.message || "Lỗi khi cập nhật hoạt động", "danger");
    }
  };

  // --- Assign Activity to Staff ---
  const handleAssign = async (userId, activityIds) => {
    try {
      await callApi(() => assignActivitiesToStaff(userId, activityIds));
      showAlert("Gán hoạt động thành công", "success");
    } catch (error) {
      showAlert(error.message || "Lỗi khi gán hoạt động", "danger");
    }
  };

  // --- Remove Staff Activity ---
  const handleRemove = async (staffActivityId) => {
    try {
      await callApi(() => removeStaffActivity(staffActivityId));
      showAlert("Xóa hoạt động thành công", "success");
      fetchActivities();
    } catch (error) {
      showAlert(error.message || "Lỗi khi xóa hoạt động", "danger");
    }
  };

  // --- Filter & Pagination ---
  const filteredActivities = activities.filter((act) =>
    act.ActivityName.toLowerCase().includes(search.toLowerCase())
  );
  const totalPages = Math.ceil(filteredActivities.length / itemsPerPage);
  const paginatedActivities = filteredActivities.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );
  const handlePageChange = (page) => setCurrentPage(page);

  return (
    <div className="p-4">
      {/* Header & Search */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="fw-bold mt-5">Danh sách hoạt động</h2>
        <div className="d-flex align-items-center gap-2">
          <div className="input-group" style={{ width: "250px" }}>
            <input
              type="text"
              className="form-control"
              placeholder="Tìm kiếm hoạt động..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <button className="btn btn-outline-secondary">
              <Search size={18} />
            </button>
          </div>
          <button
            className="btn btn-success d-flex align-items-center"
            onClick={() => setCreateModalOpen(true)}
          >
            <Plus size={18} />
          </button>
        </div>
      </div>

      {/* Table */}
      {loading ? (
        <p>Đang tải...</p>
      ) : (
        <>
          <table className="table table-striped">
            <thead className="table-success">
              <tr>
                <th>STT</th>
                <th>Tên hoạt động</th>
                <th>Mô tả</th>
                <th>Ngày tạo</th>
                <th>Cập nhật</th>
                <th>Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {paginatedActivities.length > 0 ? (
                paginatedActivities.map((act, idx) => (
                  <tr key={act.ActivityID}>
                    <td>{(currentPage - 1) * itemsPerPage + idx + 1}</td>
                    <td>{act.ActivityName}</td>
                    <td>{act.Description || "-"}</td>
                    <td>{new Date(act.CreatedAt).toLocaleString()}</td>
                    <td>{new Date(act.UpdatedAt).toLocaleString()}</td>
                    <td>
                      <button
                        className="btn btn-sm btn-outline-primary me-2"
                        onClick={() => openEditModal(act)}
                      >
                        <Edit2 size={16} className="me-1" /> Sửa
                      </button>
                      <button
                        className="btn btn-sm btn-outline-danger"
                        onClick={() => handleRemove(act.StaffActivityID)}
                      >
                        Xóa
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="text-center text-muted">
                    Không có hoạt động nào
                  </td>
                </tr>
              )}
            </tbody>
          </table>

          {/* Pagination */}
          {totalPages > 1 && (
            <nav>
              <ul className="pagination justify-content-center">
                {Array.from({ length: totalPages }, (_, i) => (
                  <li
                    key={i + 1}
                    className={`page-item ${
                      currentPage === i + 1 ? "active" : ""
                    }`}
                  >
                    <button
                      className="page-link"
                      onClick={() => handlePageChange(i + 1)}
                    >
                      {i + 1}
                    </button>
                  </li>
                ))}
              </ul>
            </nav>
          )}
        </>
      )}

      {/* Create Modal */}
      {createModalOpen && (
        <div
          className="modal fade show d-block"
          tabIndex="-1"
          style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
        >
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Thêm hoạt động mới</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setCreateModalOpen(false)}
                ></button>
              </div>
              <div className="modal-body">
                <form onSubmit={handleCreate}>
                  <div className="mb-2">
                    <label className="form-label">Tên hoạt động</label>
                    <input
                      type="text"
                      placeholder="Tên hoạt động"
                      value={form.ActivityName}
                      onChange={(e) =>
                        setForm({ ...form, ActivityName: e.target.value })
                      }
                      className="form-control"
                      required
                    />
                  </div>
                  <div className="mb-2">
                    <label className="form-label">Mô tả</label>
                    <textarea
                      placeholder="Mô tả"
                      value={form.Description}
                      onChange={(e) =>
                        setForm({ ...form, Description: e.target.value })
                      }
                      className="form-control"
                    />
                  </div>
                  <div className="d-flex justify-content-end mt-3">
                    <button
                      type="button"
                      className="btn btn-secondary me-2"
                      onClick={() => setCreateModalOpen(false)}
                    >
                      Hủy
                    </button>
                    <button type="submit" className="btn btn-success">
                      Thêm
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {editModal.open && (
        <div
          className="modal fade show d-block"
          tabIndex="-1"
          style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
        >
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Sửa hoạt động</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={closeEditModal}
                ></button>
              </div>
              <div className="modal-body">
                <form onSubmit={handleEdit}>
                  <div className="mb-2">
                    <label className="form-label">Tên hoạt động</label>
                    <input
                      type="text"
                      value={editForm.ActivityName}
                      onChange={(e) =>
                        setEditForm({
                          ...editForm,
                          ActivityName: e.target.value,
                        })
                      }
                      className="form-control"
                      required
                    />
                  </div>
                  <div className="mb-2">
                    <label className="form-label">Mô tả</label>
                    <textarea
                      value={editForm.Description}
                      onChange={(e) =>
                        setEditForm({
                          ...editForm,
                          Description: e.target.value,
                        })
                      }
                      className="form-control"
                    />
                  </div>
                  <div className="d-flex justify-content-end mt-3">
                    <button
                      type="button"
                      className="btn btn-secondary me-2"
                      onClick={closeEditModal}
                    >
                      Hủy
                    </button>
                    <button type="submit" className="btn btn-primary">
                      Lưu thay đổi
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

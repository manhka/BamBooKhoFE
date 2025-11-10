import React, { useEffect, useState } from "react";
import axios from "axios";
import { Edit2, Plus, Search } from "lucide-react";

export default function ActivityPage() {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ ActivityName: "", Description: "" });
  const [editModal, setEditModal] = useState({ open: false, activity: null });
  const [editForm, setEditForm] = useState({
    ActivityName: "",
    Description: "",
  });
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const fetchActivities = async () => {
    setLoading(true);
    try {
      const res = await axios.get("http://localhost:3000/api/activities/view");
      setActivities(res.data);
    } catch (error) {
      console.error(
        "❌ Lỗi lấy danh sách hoạt động:",
        error.response?.data || error.message
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchActivities();
  }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!form.ActivityName) return;
    try {
      const res = await axios.post(
        "http://localhost:3000/api/activities/create",
        form
      );
      setForm({ ActivityName: "", Description: "" });
      setCreateModalOpen(false);
      fetchActivities();
    } catch (error) {
      console.error(
        "❌ Lỗi tạo hoạt động:",
        error.response?.data || error.message
      );
    }
  };

  const openEditModal = (activity) => {
    setEditForm({
      ActivityName: activity.ActivityName,
      Description: activity.Description || "",
    });
    setEditModal({ open: true, activity });
  };
  const closeEditModal = () => setEditModal({ open: false, activity: null });

  const handleEdit = async (e) => {
    e.preventDefault();
    if (!editForm.ActivityName) {
      return alert("Tên hoạt động không được để trống");
    }

    try {
      const res = await axios.put(
        `http://localhost:3000/api/activities/${editModal.activity.ActivityID}`,
        editForm
      );
      closeEditModal();
      fetchActivities();
    } catch (error) {
      console.error(
        "❌ Lỗi cập nhật hoạt động:",
        error.response?.data || error.message
      );
    }
  };

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
                        className="btn btn-sm btn-outline-primary"
                        onClick={() => openEditModal(act)}
                      >
                        <Edit2 size={16} className="me-1" /> Sửa
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

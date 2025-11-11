import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { FaEdit, FaTrash, FaUndo } from "react-icons/fa";
import {
  getAllCategories,
  deleteCategory,
  restoreCategory,
} from "../services/categoryService";
import { useNavigate } from "react-router-dom";
import { showAlert } from "../utils/toast";
import { useApiWithErrorRedirect } from "../hooks/useApiWithErrorRedirect";

const CategoryList = () => {
  const { callApi } = useApiWithErrorRedirect();
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [filteredCategories, setFilteredCategories] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [showArchived, setShowArchived] = useState(false);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedItems, setSelectedItems] = useState([]);
  const pageSize = 8;

  useEffect(() => {
    fetchCategories();
  }, [showArchived]);

  useEffect(() => {
    filterCategories();
  }, [categories, searchTerm]);

  useEffect(() => {
    setSelectedItems([]);
  }, [currentPage, showArchived]);

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const result = await callApi(() => getAllCategories(showArchived));
      setCategories(result.data || []);
    } catch (error) {
      console.error("Error fetching categories:", error);
      setCategories([]);
    } finally {
      setLoading(false);
    }
  };

  const filterCategories = () => {
    if (!searchTerm.trim()) {
      setFilteredCategories(categories);
      return;
    }
    const filtered = categories.filter(
      (cat) =>
        cat.CategoryName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        cat.Description?.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredCategories(filtered);
    setCurrentPage(1);
  };

  const handleDelete = async (id) => {
    try {
      await callApi(() => deleteCategory(id));
      showAlert("Lưu trữ danh mục thành công!", "success");
      fetchCategories();
    } catch (error) {
      showAlert("Lỗi khi Lưu trữ danh mục: " + error.message, "danger");
    }
  };

  const handleRestore = async (id) => {
    try {
      await callApi(() => restoreCategory(id));
      showAlert("Khôi phục danh mục thành công!", "success");
      fetchCategories();
    } catch (error) {
      showAlert("Lỗi khi khôi phục danh mục: " + error.message, "danger");
    }
  };

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      const allIds = currentCategories.map((cat) => cat.CategoryID);
      setSelectedItems(allIds);
    } else {
      setSelectedItems([]);
    }
  };

  const handleSelectItem = (id) => {
    if (selectedItems.includes(id)) {
      setSelectedItems(selectedItems.filter((item) => item !== id));
    } else {
      setSelectedItems([...selectedItems, id]);
    }
  };

  const indexOfLast = currentPage * pageSize;
  const indexOfFirst = indexOfLast - pageSize;
  const currentCategories = filteredCategories.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(filteredCategories.length / pageSize);
  const isAllSelected =
    currentCategories.length > 0 &&
    currentCategories.every((cat) => selectedItems.includes(cat.CategoryID));

  return (
    <div className="container-fluid">
      <div
        style={{
          position: "sticky",
          top: 56,
          zIndex: 1000,
          background: "white",
          padding: "12px 0",
        }}
      >
        <div className="d-flex justify-content-between align-items-center mb-3">
          <div>
            <h3 className="m-0">Danh sách danh mục</h3>
            <p className="text-muted mb-0" style={{ fontSize: "0.9rem" }}>
              {selectedItems.length > 0 && (
                <span className="badge bg-primary ms-2">
                  {selectedItems.length} đã chọn
                </span>
              )}
            </p>
          </div>
          <button
            className="btn btn-primary"
            onClick={() => navigate("/categories/add")}
          >
            + Thêm danh mục
          </button>
        </div>

        <div className="row g-2">
          <div className="col-md-6">
            <input
              type="text"
              className="form-control"
              placeholder="🔍 Tìm kiếm..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="col-md-3">
            <select
              className="form-select"
              value={showArchived}
              onChange={(e) => setShowArchived(e.target.value === "true")}
            >
              <option value="false">Danh mục đang hoạt động</option>
              <option value="true">Danh mục đã lưu trữ</option>
            </select>
          </div>
        </div>
      </div>

      <div
        style={{
          border: "1px solid #dee2e6",
          borderRadius: "8px",
          marginTop: "10px",
          background: "white",
        }}
      >
        {/* Table Header */}
        <div
          style={{
            padding: "16px 20px",
            borderBottom: "1px solid #dee2e6",
            background: "#f8f9fa",
          }}
        >
          <h5 className="mb-1 fw-semibold">Danh mục</h5>
        </div>

        {/* Table Content */}
        <div
          style={{
            maxHeight: "calc(100vh - 60px - 200px)",
            overflowY: "auto",
          }}
        >
          <table className="table table-bordered mb-0">
            <thead
              className="table-light"
              style={{
                position: "sticky",
                top: 0,
                zIndex: 500,
                background: "#f8f9fa",
              }}
            >
              <tr>
                <th style={{ width: "50px", textAlign: "center" }}>STT</th>
                <th style={{ minWidth: "250px" }}>Tên danh mục</th>
                <th style={{ width: "120px", textAlign: "center" }}>Mã</th>
                <th style={{ width: "150px", textAlign: "center" }}>
                  Trạng thái
                </th>
                <th style={{ width: "150px", textAlign: "center" }}>
                  Hành động
                </th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="5" className="text-center">
                    Đang tải...
                  </td>
                </tr>
              ) : currentCategories.length > 0 ? (
                currentCategories.map((cat, idx) => (
                  <tr key={cat.CategoryID}>
                    <td
                      style={{ textAlign: "center", verticalAlign: "middle" }}
                    >
                      <div type="checkbox">{indexOfFirst + idx + 1}</div>
                    </td>
                    <td style={{ verticalAlign: "middle" }}>
                      <div>
                        <div className="fw-semibold">{cat.CategoryName}</div>
                        <div
                          className="text-muted"
                          style={{ fontSize: "0.85rem" }}
                        >
                          {cat.Description || "Không có mô tả"}
                        </div>
                      </div>
                    </td>
                    <td
                      style={{ textAlign: "center", verticalAlign: "middle" }}
                    >
                      <span className="badge bg-secondary">
                        CAT{String(cat.CategoryID).padStart(3, "0")}
                      </span>
                    </td>
                    <td
                      style={{ textAlign: "center", verticalAlign: "middle" }}
                    >
                      <span
                        className={`badge ${
                          cat.IsArchive ? "bg-danger" : "bg-success"
                        }`}
                      >
                        {cat.IsArchive ? "Đã lưu trữ" : "Hoạt động"}
                      </span>
                    </td>
                    <td
                      style={{ textAlign: "center", verticalAlign: "middle" }}
                    >
                      <div className="d-flex gap-1 justify-content-center">
                        <button
                          className="btn btn-sm btn-success"
                          onClick={() =>
                            navigate(`/categories/edit/${cat.CategoryID}`)
                          }
                          title="Sửa"
                        >
                          <FaEdit />
                        </button>
                        {cat.IsArchive ? (
                          <button
                            className="btn btn-sm btn-warning"
                            onClick={() => handleRestore(cat.CategoryID)}
                            title="Khôi phục"
                          >
                            <FaUndo />
                          </button>
                        ) : (
                          <button
                            className="btn btn-sm btn-danger"
                            onClick={() => handleDelete(cat.CategoryID)}
                            title="Lưu trữ"
                          >
                            <FaTrash />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="text-center text-muted">
                    Không có dữ liệu
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {filteredCategories.length > pageSize && (
        <div className="d-flex justify-content-center align-items-center mt-3 gap-2">
          <button
            className="btn btn-outline-secondary btn-sm"
            onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
            disabled={currentPage === 1}
          >
            ← Trước
          </button>
          <span>
            Trang {currentPage}/{totalPages}
          </span>
          <button
            className="btn btn-outline-secondary btn-sm"
            onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
            disabled={currentPage === totalPages}
          >
            Tiếp →
          </button>
        </div>
      )}
    </div>
  );
};

export default CategoryList;

import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { FaEdit, FaTrash, FaUndo } from "react-icons/fa";
import {
  getAllBrands,
  deleteBrand,
  restoreBrand,
} from "../services/brandService";
import { useNavigate } from "react-router-dom";

const BrandList = () => {
  const navigate = useNavigate();
  const [brands, setBrands] = useState([]);
  const [filteredBrands, setFilteredBrands] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [showArchived, setShowArchived] = useState(false);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedItems, setSelectedItems] = useState([]);
  const pageSize = 10;

  useEffect(() => {
    fetchBrands();
  }, [showArchived]);

  useEffect(() => {
    filterBrands();
  }, [brands, searchTerm]);

  useEffect(() => {
    setSelectedItems([]);
  }, [currentPage, showArchived]);

  const fetchBrands = async () => {
    setLoading(true);
    try {
      const result = await getAllBrands(showArchived);
      setBrands(result.data || []);
    } catch (error) {
      console.error("Error fetching brands:", error);
      setBrands([]);
    } finally {
      setLoading(false);
    }
  };

  const filterBrands = () => {
    if (!searchTerm.trim()) {
      setFilteredBrands(brands);
      return;
    }
    const filtered = brands.filter(
      (brand) =>
        brand.BrandName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        brand.Description?.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredBrands(filtered);
    setCurrentPage(1);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Bạn có chắc muốn xóa thương hiệu này?")) {
      try {
        await deleteBrand(id);
        alert("Xóa thương hiệu thành công!");
        fetchBrands();
      } catch (error) {
        alert("Lỗi khi xóa thương hiệu: " + error.message);
      }
    }
  };

  const handleRestore = async (id) => {
    if (window.confirm("Bạn có chắc muốn khôi phục thương hiệu này?")) {
      try {
        await restoreBrand(id);
        alert("Khôi phục thương hiệu thành công!");
        fetchBrands();
      } catch (error) {
        alert("Lỗi khi khôi phục thương hiệu: " + error.message);
      }
    }
  };

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      const allIds = currentBrands.map((brand) => brand.BrandID);
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
  const currentBrands = filteredBrands.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(filteredBrands.length / pageSize);
  const isAllSelected =
    currentBrands.length > 0 &&
    currentBrands.every((brand) => selectedItems.includes(brand.BrandID));

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
            <h3 className="m-0">Danh sách thương hiệu</h3>
            <p className="text-muted mb-0" style={{ fontSize: "0.9rem" }}>
              Quản lý danh sách thương hiệu sản phẩm của bạn.
              {selectedItems.length > 0 && (
                <span className="badge bg-primary ms-2">
                  {selectedItems.length} đã chọn
                </span>
              )}
            </p>
          </div>
          <button
            className="btn btn-primary"
            onClick={() => navigate("/brands/add")}
          >
            + Thêm thương hiệu
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
              <option value="false">Thương hiệu đang hoạt động</option>
              <option value="true">Thương hiệu đã lưu trữ</option>
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
          <h5 className="mb-1 fw-semibold">Thương hiệu</h5>
          <p className="text-muted mb-0" style={{ fontSize: "0.9rem" }}>
            Quản lý thương hiệu sản phẩm. Nhấp vào tên thương hiệu để xem chi
            tiết.
          </p>
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
                <th style={{ width: "50px", textAlign: "center" }}>
                  <input
                    type="checkbox"
                    checked={isAllSelected}
                    onChange={handleSelectAll}
                  />
                </th>
                <th style={{ minWidth: "250px" }}>Tên thương hiệu</th>
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
              ) : currentBrands.length > 0 ? (
                currentBrands.map((brand) => (
                  <tr key={brand.BrandID}>
                    <td
                      style={{ textAlign: "center", verticalAlign: "middle" }}
                    >
                      <input
                        type="checkbox"
                        checked={selectedItems.includes(brand.BrandID)}
                        onChange={() => handleSelectItem(brand.BrandID)}
                      />
                    </td>
                    <td style={{ verticalAlign: "middle" }}>
                      <div className="d-flex align-items-center">
                        <div>
                          <div className="fw-semibold">{brand.BrandName}</div>
                          <div
                            className="text-muted"
                            style={{ fontSize: "0.85rem" }}
                          >
                            {brand.Description || "Không có mô tả"}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td
                      style={{ textAlign: "center", verticalAlign: "middle" }}
                    >
                      <span className="badge bg-secondary">
                        BRAND{String(brand.BrandID).padStart(3, "0")}
                      </span>
                    </td>
                    <td
                      style={{ textAlign: "center", verticalAlign: "middle" }}
                    >
                      <span
                        className={`badge ${
                          brand.IsArchive ? "bg-danger" : "bg-success"
                        }`}
                      >
                        {brand.IsArchive ? "Đã lưu trữ" : "Hoạt động"}
                      </span>
                    </td>
                    <td
                      style={{ textAlign: "center", verticalAlign: "middle" }}
                    >
                      <div className="d-flex gap-1 justify-content-center">
                        <button
                          className="btn btn-sm btn-success"
                          onClick={() =>
                            navigate(`/brands/edit/${brand.BrandID}`)
                          }
                          title="Sửa"
                        >
                          <FaEdit />
                        </button>
                        {brand.IsArchive ? (
                          <button
                            className="btn btn-sm btn-warning"
                            onClick={() => handleRestore(brand.BrandID)}
                            title="Khôi phục"
                          >
                            <FaUndo />
                          </button>
                        ) : (
                          <button
                            className="btn btn-sm btn-danger"
                            onClick={() => handleDelete(brand.BrandID)}
                            title="Xóa"
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

      {filteredBrands.length > pageSize && (
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

export default BrandList;

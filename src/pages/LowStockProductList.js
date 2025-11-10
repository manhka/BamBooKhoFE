import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { FaEye, FaEdit, FaTrash } from "react-icons/fa";
import { getListStockWarningProducts } from "../services/productService";
import { getAllBrands } from "../services/brandService";
import { getAllCategories } from "../services/categoryService";
import { Link } from "react-router-dom";

const LowStockProductList = () => {
  const [products, setProducts] = useState([]);
  const [brands, setBrands] = useState([]);
  const [categories, setCategories] = useState([]);
  const [filters, setFilters] = useState({
    keyword: "",
    BarcodeProduct: "",
    BrandID: "",
    CategoryID: "",
  });
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  // --- Fetch danh sách thương hiệu & danh mục ---
  useEffect(() => {
    const fetchFiltersData = async () => {
      try {
        const [brandRes, categoryRes] = await Promise.all([
          getAllBrands(),
          getAllCategories(),
        ]);
        setBrands(brandRes.data || []);
        setCategories(categoryRes.data || []);
      } catch (error) {
        console.error("Error fetching filter data:", error);
      }
    };
    fetchFiltersData();
  }, []);

  // --- Fetch danh sách sản phẩm ---
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const result = await getListStockWarningProducts({
          BrandID: filters.BrandID,
          CategoryID: filters.CategoryID,
          keyword: filters.keyword,
        });
        setProducts(result.data || []);
      } catch (err) {
        console.error(err);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
    setCurrentPage(1);
  }, [filters]);

  const handleFilterChange = (e) =>
    setFilters({ ...filters, [e.target.name]: e.target.value });

  // --- Pagination ---
  const indexOfLast = currentPage * pageSize;
  const indexOfFirst = indexOfLast - pageSize;
  const currentProducts = products.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(products.length / pageSize);

  return (
    <div className="container-fluid">
      {/* Filter Section */}
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
          <h3 className="m-0">Danh sách sản phẩm sắp hết hàng</h3>
        </div>
        <div className="row g-2">
          <div className="col-md-4">
            <input
              type="text"
              className="form-control"
              name="keyword"
              placeholder="🔍 Tìm theo tên hoặc mã"
              value={filters.keyword}
              onChange={handleFilterChange}
            />
          </div>

          <div className="col-md-3">
            <select
              className="form-select"
              name="BrandID"
              value={filters.BrandID}
              onChange={handleFilterChange}
            >
              <option value="">Tất cả thương hiệu</option>
              {brands.map((b) => (
                <option key={b.BrandID} value={b.BrandID}>
                  {b.BrandName}
                </option>
              ))}
            </select>
          </div>

          <div className="col-md-3">
            <select
              className="form-select"
              name="CategoryID"
              value={filters.CategoryID}
              onChange={handleFilterChange}
            >
              <option value="">Tất cả danh mục</option>
              {categories.map((c) => (
                <option key={c.CategoryID} value={c.CategoryID}>
                  {c.CategoryName}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Table Section */}
      <div
        style={{
          maxHeight: "calc(100vh - 60px - 140px)",
          overflowY: "auto",
          border: "1px solid #dee2e6",
          borderRadius: "8px",
          marginTop: "10px",
          background: "white",
        }}
      >
        <table className="table table-bordered mb-0 mt-5">
          <thead
            className="table-light"
            style={{
              position: "sticky",
              top: 40,
              zIndex: 500,
              background: "white",
            }}
          >
            <tr>
              <th>STT</th>
              <th>Sản phẩm</th>
              <th>Mã</th>
              <th>Danh mục</th>
              <th>Giá nhập</th>
              <th>Giá bán</th>
              <th>Thương hiệu</th>
              <th>Số lượng</th>
              <th>Trạng thái</th>
              <th>Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="10" className="text-center">
                  Đang tải...
                </td>
              </tr>
            ) : currentProducts.length > 0 ? (
              currentProducts.map((p, idx) => (
                <tr
                  key={p.BarcodeProduct}
                  className={p.IsArchive ? "table-secondary" : ""}
                  style={p.IsArchive ? { opacity: 0.5 } : {}}
                >
                  <td>
                    <div type="checkbox" disabled={p.IsArchive}>
                      {indexOfFirst + idx + 1}
                    </div>
                  </td>
                  <td>
                    <div className="d-flex align-items-center">
                      <img
                        src={
                          p.Image ||
                          "https://cdn.pixabay.com/photo/2021/06/13/08/29/laptop-6332600_1280.jpg"
                        }
                        alt={p.ProductName}
                        className="me-2 rounded border"
                        style={{
                          width: "70px",
                          height: "70px",
                          objectFit: "cover",
                        }}
                      />
                      <div>
                        <strong>{p.ProductName}</strong>
                        <div
                          className="text-muted"
                          style={{ fontSize: "0.9rem" }}
                        >
                          {p.Description}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td>{p.BarcodeProduct}</td>
                  <td>{p.Category?.CategoryName}</td>
                  <td>{p.CostPrice?.toLocaleString()}₫</td>
                  <td>{p.SalePrice?.toLocaleString()}₫</td>
                  <td>{p.Brand?.BrandName}</td>
                  <td style={{ color: "red" }}>{p.NumberOfProduct}</td>
                  <td>{p.IsArchive ? "Đã lưu trữ" : "Hoạt động"}</td>{" "}
                  {/* Cột trạng thái */}
                  <td>
                    <Link
                      to={`/products/details/${p.BarcodeProduct}`}
                      className="btn btn-sm btn-success me-1"
                      disabled={p.IsArchive}
                    >
                      <FaEye />
                    </Link>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="10" className="text-center text-muted">
                  Không có dữ liệu
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {products.length > 10 && (
        <div className="d-flex justify-content-center align-items-center mt-3 gap-2">
          <button
            className="btn btn-outline-secondary btn-sm"
            onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
            disabled={currentPage === 1}
          >
            ← Trang trước
          </button>
          <span>
            Trang {currentPage}/{totalPages}
          </span>
          <button
            className="btn btn-outline-secondary btn-sm"
            onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
            disabled={currentPage === totalPages}
          >
            Trang sau →
          </button>
        </div>
      )}
    </div>
  );
};

export default LowStockProductList;

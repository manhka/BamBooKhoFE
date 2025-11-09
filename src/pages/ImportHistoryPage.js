// pages/ImportHistoryPage.js
import React, { useState, useEffect, useCallback } from "react";
import { getImportHistory } from "../services/importService";
// import { getAllSuppliers } from "../services/supplierService"; // Tạm comment lại
// import { getAllUsers } from "../services/userService"; // Tạm comment lại
import { Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { Filter, Calendar, Package, Eye } from 'lucide-react'; // Bỏ User, Tag, Search

// const fetchSuppliers = async () => { /* ... */ }; // Tạm comment lại
// const fetchUsers = async () => { /* ... */ }; // Tạm comment lại

const ImportHistoryPage = () => {
  const [orders, setOrders] = useState([]);
  // const [suppliers, setSuppliers] = useState([]); // Tạm comment lại
  // const [users, setUsers] = useState([]); // Tạm comment lại
  const [filters, setFilters] = useState({
    fromDate: null,
    toDate: null,
    supplierId: "",
    userId: "",
    barcode: "",
  });
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [error, setError] = useState("");
  const pageSize = 10;

  // Tạm thời comment lại useEffect fetch filter data
  // useEffect(() => {
  //   const loadFilterData = async () => {
  //     // ... fetch suppliers, users ...
  //   };
  //   loadFilterData();
  // }, []);

  // Fetch Import History dựa trên filter (chỉ dùng date và barcode)
  const fetchHistory = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const params = {
        fromDate: filters.fromDate ? filters.fromDate.toISOString().split('T')[0] : null,
        toDate: filters.toDate ? filters.toDate.toISOString().split('T')[0] : null,
        barcode: filters.barcode || null,
      };
      Object.keys(params).forEach(key => (params[key] == null || params[key] === '') && delete params[key]);

      const result = await getImportHistory(params);
      console.log("API Result:", result); // <-- Log 1: Xem dữ liệu thô từ API

      // Kiểm tra cấu trúc result trước khi truy cập orders
      const ordersData = result?.orders || []; // Lấy mảng orders, mặc định là mảng rỗng
      console.log("Orders Data to Set:", ordersData); // <-- Log 2: Xem dữ liệu sẽ được set

      setOrders(ordersData); // Cập nhật state
      setCurrentPage(1);
    } catch (err) {
      console.error("Error fetching import history:", err);
      setError(err.message || "Không thể tải lịch sử nhập hàng.");
      setOrders([]); // Set rỗng nếu lỗi
    } finally {
      setLoading(false);
    }
  }, [filters.fromDate, filters.toDate, filters.barcode]);

  useEffect(() => {
    fetchHistory();
  }, [fetchHistory]);

  const handleFilterChange = (event) => {
    setFilters({ ...filters, [event.target.name]: event.target.value });
  };

   const handleDateChange = (date, fieldName) => {
    setFilters({ ...filters, [fieldName]: date });
   };

   const handleResetFilters = () => {
       setFilters({ fromDate: null, toDate: null, supplierId: "", userId: "", barcode: "" });
   }

  // --- Pagination Logic ---
  const indexOfLastOrder = currentPage * pageSize;
  const indexOfFirstOrder = indexOfLastOrder - pageSize;
  const currentOrders = Array.isArray(orders) ? orders.slice(indexOfFirstOrder, indexOfLastOrder) : []; // Đảm bảo orders là mảng
  const totalPages = Array.isArray(orders) ? Math.ceil(orders.length / pageSize) : 0;
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  console.log("Current 'orders' state:", orders); // <-- Log 3: Xem state orders trước khi render
  console.log("Current 'currentOrders' for page:", currentOrders); // <-- Log 4: Xem dữ liệu cho trang hiện tại

  return (
    <div className="container-fluid mt-4 pt-5">
      <h2 className="mb-4">Lịch Sử Nhập Hàng</h2>

      {/* Filter Section */}
      <div className="card mb-4 shadow-sm">
        <div className="card-header"><Filter size={16} className="me-1"/> Bộ Lọc</div>
        <div className="card-body">
          <div className="row g-3 align-items-end">
            <div className="col-md-3">
              <label className="form-label small"><Calendar size={14}/> Từ Ngày</label>
              <DatePicker
                selected={filters.fromDate}
                onChange={(date) => handleDateChange(date, 'fromDate')}
                selectsStart
                startDate={filters.fromDate}
                endDate={filters.toDate}
                dateFormat="dd/MM/yyyy"
                className="form-control"
                placeholderText="Chọn ngày bắt đầu"
              />
            </div>
            <div className="col-md-3">
              <label className="form-label small"><Calendar size={14}/> Đến Ngày</label>
              <DatePicker
                selected={filters.toDate}
                onChange={(date) => handleDateChange(date, 'toDate')}
                selectsEnd
                startDate={filters.fromDate}
                endDate={filters.toDate}
                minDate={filters.fromDate}
                dateFormat="dd/MM/yyyy"
                className="form-control"
                 placeholderText="Chọn ngày kết thúc"
              />
            </div>
               <div className="col-md-6">
                 <label className="form-label small"><Package size={14}/> Mã Sản Phẩm (Barcode)</label>
                 <input
                   type="text"
                   className="form-control"
                   name="barcode"
                   placeholder="Nhập barcode sản phẩm..."
                   value={filters.barcode}
                   onChange={handleFilterChange}
                 />
               </div>
               <div className="col-md-12 d-flex justify-content-end align-self-end"> {/* Sửa col-md-6 thành col-md-12 nếu cần */}
                  <button className="btn btn-secondary" onClick={handleResetFilters}>Đặt lại bộ lọc</button>
               </div>
          </div>
        </div>
      </div>

       {error && <div className="alert alert-danger">{error}</div>}

      {/* Table Section */}
      <div className="table-responsive shadow-sm" style={{ maxHeight: '60vh', overflowY: 'auto', border: "1px solid #dee2e6", borderRadius: "8px", background:"white" }}>
        <table className="table table-hover table-bordered mb-0">
          <thead className="table-light" style={{ position: 'sticky', top: 0, zIndex: 1 }}>
             {/* Sửa lỗi whitespace */}
             <tr>
              <th>ID</th>
              <th>Ngày Nhập</th>
              <th>Nhà Cung Cấp</th>
              <th>Người Nhập</th>
              <th>Sản Phẩm (SL * Đơn giá)</th>
              <th>Tổng Tiền</th>
              <th>Chi tiết</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan="7" className="text-center"><div className="spinner-border spinner-border-sm" role="status"><span className="visually-hidden">Loading...</span></div> Đang tải...</td></tr>
            ) : currentOrders.length > 0 ? (
              currentOrders.map((order) => (
                <tr key={order.ImportID}>
                  <td>{order.ImportID}</td>
                  <td>{new Date(order.ImportDate).toLocaleDateString('vi-VN')}</td>
                  <td>{order.Supplier?.SupplierName || 'N/A'}</td>
                  <td>{order.User?.Username || 'N/A'}</td>
                  <td>
                     {order.ImportDetails?.map(d => (
                        <div key={d.ImportDetailID} style={{fontSize: '0.9em', whiteSpace: 'nowrap'}}>
                           {/* Dòng hiển thị ProductName */}
                           {d.Product?.ProductName || d.BarcodeProduct} ({d.Quantity} * {d.UnitPrice?.toLocaleString('vi-VN')}₫)
                        </div>
                     ))}
                     {(!order.ImportDetails || order.ImportDetails.length === 0) && 'Không có chi tiết'}
                  </td>
                  <td>{order.Total?.toLocaleString('vi-VN')}₫</td>
                   <td>
                      <Link to={`/import-detail/${order.ImportID}`} className="btn btn-sm btn-outline-primary">
                          <Eye size={14}/> Xem
                      </Link>
                  </td>
                </tr>
              ))
            ) : (
              <tr><td colSpan="7" className="text-center text-muted">Không tìm thấy đơn nhập hàng nào.</td></tr>
            )}
          </tbody>
        </table>
      </div>

       {/* Pagination Controls */}
       {Array.isArray(orders) && orders.length > pageSize && (
         <nav aria-label="Page navigation" className="d-flex justify-content-center mt-3">
           <ul className="pagination">
             <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
               <button className="page-link" onClick={() => paginate(currentPage - 1)}>Trước</button>
             </li>
             {[...Array(totalPages).keys()].map(number => (
               <li key={number + 1} className={`page-item ${currentPage === number + 1 ? 'active' : ''}`}>
                 <button onClick={() => paginate(number + 1)} className="page-link">
                   {number + 1}
                 </button>
               </li>
             ))}
             <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
               <button className="page-link" onClick={() => paginate(currentPage + 1)}>Sau</button>
             </li>
           </ul>
         </nav>
       )}
    </div>
  );
};

export default ImportHistoryPage;
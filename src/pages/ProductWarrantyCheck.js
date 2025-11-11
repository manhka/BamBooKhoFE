import React, { useState, useEffect } from "react";
import { Button } from "react-bootstrap";
import { FaSearch, FaTimes } from "react-icons/fa";
import { searchCustomers } from "../services/customerService";
import { getWarrantyProducts } from "../services/customerReturnService";
import { Link } from "react-router-dom";
import { useApiWithErrorRedirect } from "../hooks/useApiWithErrorRedirect";

const ProductWarrantyCheck = () => {
  const { callApi } = useApiWithErrorRedirect();

  const [filters, setFilters] = useState({
    customerName: "",
    customerId: null,
    productBarcode: "",
  });

  const [customers, setCustomers] = useState([]);
  const [showCustomerDropdown, setShowCustomerDropdown] = useState(false);

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);

  const [customerError, setCustomerError] = useState(""); // Thêm state hiển thị lỗi
  const [alertMessage, setAlertMessage] = useState("");

  const handleDisabledClick = (message) => {
    setAlertMessage(message);
    setTimeout(() => setAlertMessage(""), 3000); // tự ẩn sau 3 giây
  };
  // --- Customer autocomplete ---
  useEffect(() => {
    if (filters.customerName.trim()) {
      searchCustomers(filters.customerName)
        .then((res) => setCustomers(res.customers || []))
        .catch((err) => console.error(err));
      setShowCustomerDropdown(true);
    } else {
      setCustomers([]);
      setShowCustomerDropdown(false);
    }
  }, [filters.customerName]);

  // --- Handle input change ---
  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
    if (e.target.name === "customerName") {
      setShowCustomerDropdown(true);
      setCustomerError(""); // reset lỗi khi người dùng gõ
    }
  };

  // --- Select customer ---
  const handleSelectCustomer = (customer) => {
    setFilters({
      ...filters,
      customerName: customer.CustomerName,
      customerId: customer.CustomerID,
    });
    setShowCustomerDropdown(false);
    setCustomerError(""); // reset lỗi khi chọn
  };

  // --- Search products ---
  const handleSearch = async () => {
    if (!filters.customerId) {
      setCustomerError("Vui lòng chọn khách hàng!");
      return;
    }

    setLoading(true);
    try {
      const res = await callApi(getWarrantyProducts, {
        customerId: filters.customerId,
        barcodeProduct: filters.productBarcode,
      });
      setProducts(res.data || []);
    } catch (err) {
      console.error(err);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

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
          <h3 className="m-0">Kiểm tra bảo hành</h3>
        </div>

        <div className="row g-3">
          {/* Customer Name */}
          <div className="col-md-3 position-relative">
            <input
              type="text"
              name="customerName"
              placeholder="Tên khách hàng..."
              className={`form-control ${customerError ? "is-invalid" : ""}`}
              value={filters.customerName}
              onChange={handleFilterChange}
            />
            {filters.customerName && (
              <button
                className="btn btn-sm position-absolute end-0 top-50 translate-middle-y"
                onClick={() =>
                  setFilters({ ...filters, customerName: "", customerId: null })
                }
              >
                <FaTimes />
              </button>
            )}

            {customerError && (
              <div className="invalid-feedback">{customerError}</div>
            )}

            {showCustomerDropdown && customers.length > 0 && (
              <div className="position-absolute top-100 start-0 end-0 mt-1 bg-white border rounded shadow-sm z-10">
                {customers.map((c) => (
                  <div
                    key={c.CustomerID}
                    className="w-100 text-start px-3 py-2 border-0 bg-white hover-bg-light"
                    onMouseDown={() => handleSelectCustomer(c)}
                    style={{ cursor: "pointer" }}
                  >
                    {c.CustomerName}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Product Barcode */}
          <div className="col-md-3">
            <input
              type="text"
              name="productBarcode"
              placeholder="Mã sản phẩm..."
              className="form-control"
              value={filters.productBarcode}
              onChange={handleFilterChange}
            />
          </div>
          <div className="col-md-3">
            <Button onClick={handleSearch} className="btn btn-primary">
              <FaSearch className="me-1" /> Tìm
            </Button>
          </div>
        </div>
      </div>
      {alertMessage && (
        <div
          style={{
            position: "fixed", // → fixed để luôn ở trên màn hình
            top: 50, // cách top header 1 chút
            left: "50%",
            transform: "translateX(-50%)",
            backgroundColor: "#ffc107",
            color: "#000",
            padding: "8px 16px",
            borderRadius: 5,
            boxShadow: "0 2px 6px rgba(0,0,0,0.2)",
            zIndex: 2000, // → z-index cao hơn header
          }}
        >
          {alertMessage}
        </div>
      )}
      {/* Product Table */}
      <div style={{ marginTop: 60 }}>
        {loading ? (
          <p>Đang tải...</p>
        ) : products.length > 0 ? (
          <table className="table table-bordered">
            <thead>
              <tr>
                <th>#</th>
                <th>Tên sản phẩm</th>
                <th>Barcode</th>
                <th>Số lượng</th>
                <th>Đã trả</th>
                <th>Còn lại</th>
                <th>Đơn giá</th>
                <th>Thành tiền</th>
                <th>Bắt đầu bảo hành</th>
                <th>Kết thúc bảo hành</th>
                <th>Trạng thái bảo hành</th>
                <th>Hành động</th>
              </tr>
            </thead>
            <tbody>
              {products.map((p, idx) => {
                const remaining = p.RemainingQuantity ?? p.Quantity;
                const isDisabled = remaining === 0 || !p.WarrantyStatus;

                return (
                  <tr key={p.ExportDetailID}>
                    <td>{idx + 1}</td>
                    <td>{p.Product.ProductName}</td>
                    <td>{p.BarcodeProduct}</td>
                    <td>{p.Quantity}</td>
                    <td>{p.ReturnedQuantity || 0}</td>
                    <td>{remaining}</td>
                    <td>{p.UnitPrice} VNĐ</td>
                    <td>{p.Total} VNĐ</td>
                    <td>
                      {new Date(p.WarrantyStartTime).toLocaleDateString()}
                    </td>
                    <td>{new Date(p.WarrantyEndTime).toLocaleDateString()}</td>
                    <td>
                      {p.WarrantyStatus ? "Còn bảo hành" : "Hết bảo hành"}
                    </td>
                    <td className="d-flex gap-2">
                      <Link
                        to={
                          isDisabled
                            ? "#"
                            : `/customer-return/${p.ExportDetailID}`
                        }
                        className={`btn btn-sm btn-danger ${
                          isDisabled ? "disabled" : ""
                        }`}
                        onClick={
                          isDisabled
                            ? () =>
                                handleDisabledClick(
                                  "Bạn không thể trả sản phẩm này"
                                )
                            : undefined
                        }
                        style={isDisabled ? { pointerEvents: "auto" } : {}}
                      >
                        Trả hàng
                      </Link>

                      {/* <Button
                        size="sm"
                        variant={isDisabled ? "secondary" : "warning"}
                        onClick={
                          isDisabled
                            ? () =>
                                handleDisabledClick(
                                  "Bạn không thể đổi sản phẩm này"
                                )
                            : () =>
                                alert(`Đổi sản phẩm: ${p.Product.ProductName}`)
                        }
                      >
                        Đổi hàng
                      </Button> */}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        ) : (
          <p>Không tìm thấy sản phẩm</p>
        )}
      </div>
    </div>
  );
};

export default ProductWarrantyCheck;

import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { getProductByBarcode } from "../services/productService";
import "bootstrap/dist/css/bootstrap.min.css";
import { useApiWithErrorRedirect } from "../hooks/useApiWithErrorRedirect";

const ProductDetail = () => {
  const { barcode } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const { callApi } = useApiWithErrorRedirect();
  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      try {
        const res = await callApi(() => getProductByBarcode(barcode));
        setProduct(res.product);
      } catch (err) {
        console.error("Error fetching product detail:", err);
        setProduct(null);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [barcode]);

  if (loading) {
    return (
      <div className="container my-5 text-center pt-3">
        <h4>Đang tải sản phẩm...</h4>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container-fluid mt-5 text-center text-danger">
        <h4>Không tìm thấy sản phẩm!</h4>
        <Link to="/products" className="btn btn-primary mt-3">
          Quay lại danh sách
        </Link>
      </div>
    );
  }

  const hasVariants = product.Variants && product.Variants.length > 0;

  return (
    <div className="container-fluid mt-5">
      <div className="row">
        {hasVariants ? (
          <>
            {/* Card sản phẩm cố định */}
            <div className="col-md-4 mb-3 mt-4">
              <div
                className="card shadow-lg border-0 rounded position-sticky"
                style={{ top: "90px" }}
              >
                <div
                  style={{
                    width: "100%",
                    maxWidth: "400px", // giới hạn chiều ngang card
                    height: "400px", // cố định chiều cao
                    margin: "0 auto",
                    border: "1px solid #ddd",
                    borderRadius: "10px",
                    overflow: "hidden",
                    backgroundColor: "#f9f9f9",
                  }}
                >
                  <img
                    src={
                      product.Image && product.Image.trim() !== ""
                        ? product.Image
                        : "https://via.placeholder.com/400x400?text=No+Image"
                    }
                    alt={product.ProductName}
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src =
                        "https://via.placeholder.com/400x400?text=No+Image";
                    }}
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "contain",
                      display: "block",
                    }}
                  />
                </div>
                <div className="card-body">
                  <h5 className="card-title">{product.ProductName}</h5>
                  <p className="text-muted mb-1">
                    <strong>Mã sản phẩm:</strong> {product.BarcodeProduct}
                  </p>
                  <p className="mb-1">
                    <strong>Thương hiệu:</strong> {product.Brand?.BrandName}
                  </p>
                  <p className="mb-1">
                    <strong>Danh mục:</strong> {product.Category?.CategoryName}
                  </p>
                  <p className="mb-1">
                    <strong>Số lượng có sẵn:</strong> {product.NumberOfProduct}
                  </p>
                  <p className="mb-1">
                    <strong>Giá Nhập:</strong>{" "}
                    <span className="text-secondary text-success">
                      {product.CostPrice?.toLocaleString()}₫
                    </span>
                  </p>
                  <p className="mb-1">
                    <strong>Giá bán:</strong>{" "}
                    <span className="text-success">
                      {product.SalePrice?.toLocaleString()}₫
                    </span>
                  </p>
                  <p className="mt-2">{product.Description}</p>
                </div>
              </div>
            </div>

            {/* Table scroll */}
            <div className="col-md-8">
              <h4 className="mb-3">Thông số sản phẩm</h4>
              <div
                className="table-responsive"
                style={{ maxHeight: "75vh", overflowY: "auto" }}
              >
                <table className="table table-hover align-middle mb-0">
                  <thead className="table-primary text-white">
                    <tr>
                      <th>Thuộc tính</th>
                      <th>Giá trị</th>
                      <th>Đơn vị</th>
                      <th>Mô tả</th>
                    </tr>
                  </thead>
                  <tbody>
                    {product.Variants.map((v, index) => (
                      <tr
                        key={v.VariantID}
                        className={index % 2 === 0 ? "table-light" : ""}
                      >
                        <td>{v.AttributeName}</td>
                        <td>{v.Value}</td>
                        <td>{v.Unit}</td>
                        <td>{v.Description}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        ) : (
          // Không có variant → card chia 2 cột: ảnh + info
          <div className="col-md-12 mb-3 mt-4">
            <div className="row">
              <div className="col-md-6">
                <div
                  style={{
                    width: "100%",
                    maxWidth: "400px", // giới hạn chiều ngang card
                    height: "400px", // cố định chiều cao
                    margin: "0 auto",
                    border: "1px solid #ddd",
                    borderRadius: "10px",
                    overflow: "hidden",
                    backgroundColor: "#f9f9f9",
                  }}
                >
                  <img
                    src={
                      product.Image && product.Image.trim() !== ""
                        ? product.Image
                        : "https://agrimart.in/uploads/vendor_banner_image/default.jpg"
                    }
                    alt={product.ProductName}
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src =
                        "https://agrimart.in/uploads/vendor_banner_image/default.jpg";
                    }}
                    style={{
                      width: "100%",
                      height: "100%", // chiếm toàn bộ khung
                      objectFit: "contain", // giữ tỉ lệ, đủ toàn bộ ảnh
                      display: "block",
                    }}
                  />
                </div>
              </div>
              <div className="col-md-6 d-flex flex-column justify-content-center">
                <h5>{product.ProductName}</h5>
                <p className="text-muted mb-1">
                  <strong>Mã sản phẩm:</strong> {product.BarcodeProduct}
                </p>
                <p className="mb-1">
                  <strong>Thương hiệu:</strong> {product.Brand?.BrandName}
                </p>
                <p className="mb-1">
                  <strong>Danh mục:</strong> {product.Category?.CategoryName}
                </p>
                <p className="mb-1">
                  <strong>Số lượng có sẵn:</strong> {product.NumberOfProduct}
                </p>
                <p className="mb-1">
                  <strong>Giá gốc:</strong>{" "}
                  <span className="text-secondary text-decoration-line-through">
                    {product.CostPrice?.toLocaleString()}₫
                  </span>
                </p>
                <p className="mb-1">
                  <strong>Giá bán:</strong>{" "}
                  <span className="text-success">
                    {product.SalePrice?.toLocaleString()}₫
                  </span>
                </p>
                <p className="mt-2">{product.Description}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductDetail;

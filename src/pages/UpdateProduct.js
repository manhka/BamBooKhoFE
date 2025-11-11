"use client";

import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getAllCategories } from "../services/categoryService";
import { getAllBrands } from "../services/brandService";
import { getProductByBarcode, updateProduct } from "../services/productService";
import { useApiWithErrorRedirect } from "../hooks/useApiWithErrorRedirect";

export default function UpdateProduct() {
  const { callApi } = useApiWithErrorRedirect();
  const { barcode } = useParams();
  const navigate = useNavigate();

  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [product, setProduct] = useState(null);
  const [variants, setVariants] = useState([]);
  const [errors, setErrors] = useState({}); // validation errors

  useEffect(() => {
    getAllCategories().then((res) => setCategories(res.data || res));
    getAllBrands().then((res) => setBrands(res.data || res));

    if (barcode) {
      getProductByBarcode(barcode).then((res) => {
        const data = res.data || res;
        const p = data.product;
        setProduct(p);
        setVariants(p.Variants || []);
      });
    }
  }, [barcode]);

  if (!product) {
    return (
      <div className="p-5 text-center text-muted mt-5">Đang tải dữ liệu...</div>
    );
  }

  // Cập nhật dữ liệu chung
  const handleChange = (e) => {
    const { name, value } = e.target;
    setProduct({ ...product, [name]: value });
  };

  // Cập nhật variant
  const handleVariantChange = (index, field, value) => {
    const updated = [...variants];
    updated[index][field] = value;
    setVariants(updated);
  };
  // Thêm nhật variant
  const handleAddVariant = () => {
    setVariants([
      ...variants,
      { AttributeName: "", Value: "", Unit: "", Description: "" },
    ]);
  };
  // Validation
  const validate = () => {
    const newErrors = {};

    if (!product.ProductName || product.ProductName.trim() === "") {
      newErrors.ProductName = "Tên sản phẩm bắt buộc";
    }

    if (!product.CostPrice || Number(product.CostPrice) <= 0) {
      newErrors.CostPrice = "Giá nhập phải lớn hơn 0";
    }

    if (!product.SalePrice || Number(product.SalePrice) <= 0) {
      newErrors.SalePrice = "Giá bán phải lớn hơn 0";
    }

    if (!product.BrandID) {
      newErrors.BrandID = "Chọn thương hiệu";
    }

    variants.forEach((v, i) => {
      if (!v.AttributeName || v.AttributeName.trim() === "") {
        newErrors[`variant_name_${i}`] = "Tên thuộc tính bắt buộc";
      }
      if (!v.Value || v.Value.trim() === "") {
        newErrors[`variant_value_${i}`] = "Giá trị bắt buộc";
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Gửi cập nhật
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    const updated = {
      ...product,
      Variants: variants,
    };
    await callApi(() => updateProduct(product.BarcodeProduct, updated));
    navigate("/products/list");
  };

  const selectedCategory =
    categories.find((c) => c.CategoryID === product.CategoryID)?.CategoryName ||
    "";

  return (
    <div
      className="d-flex justify-content-center align-items-center"
      style={{ height: "90vh", backgroundColor: "#ffffff", marginTop: "60px" }}
    >
      <div
        className="card shadow-lg border-0 mt-4"
        style={{ width: "98%", height: "90vh", overflowY: "auto" }}
      >
        <h3 className="mb-4 text-primary ms-3 mt-3">🛠️ Cập nhật sản phẩm</h3>

        <div
          className="card-body overflow-auto"
          style={{ maxHeight: "90vh", padding: "30px" }}
        >
          <form onSubmit={handleSubmit}>
            <div className="row">
              {/* Ảnh sản phẩm */}
              <div className="mb-4 text-center col-md-4">
                <img
                  src={
                    product.Image && product.Image.trim() !== ""
                      ? product.Image
                      : "https://agrimart.in/uploads/vendor_banner_image/default.jpg"
                  }
                  alt={product.ProductName || "Preview"}
                  className="img-thumbnail mb-2 shadow-sm"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src =
                      "https://agrimart.in/uploads/vendor_banner_image/default.jpg";
                  }}
                  style={{
                    width: "100%",
                    height: "auto",
                    objectFit: "contain",
                    display: "block",
                  }}
                />
                <input
                  type="text"
                  name="Image"
                  className="form-control mt-2"
                  placeholder="Nhập URL hình ảnh..."
                  value={product.Image || ""}
                  onChange={handleChange}
                />
              </div>

              <div className="col-md-8">
                <div className="row g-4">
                  {/* Mã sản phẩm */}
                  <div className="mb-3 col-md-6">
                    <label className="form-label fw-semibold">
                      Mã sản phẩm
                    </label>
                    <input
                      type="text"
                      className="form-control bg-light"
                      value={product.BarcodeProduct}
                      readOnly
                    />
                  </div>

                  {/* Tên sản phẩm */}
                  <div className="mb-3 col-md-6">
                    <label className="form-label fw-semibold">
                      Tên sản phẩm
                    </label>
                    <input
                      type="text"
                      name="ProductName"
                      className="form-control"
                      value={product.ProductName}
                      onChange={handleChange}
                      required
                    />
                    {errors.ProductName && (
                      <div className="text-danger mt-1">
                        {errors.ProductName}
                      </div>
                    )}
                  </div>
                </div>

                {/* Danh mục & Thương hiệu */}
                <div className="row">
                  <div className="col-md-6 mb-3">
                    <label className="form-label fw-semibold">Danh mục</label>
                    <input
                      type="text"
                      className="form-control bg-light"
                      value={selectedCategory}
                      readOnly
                    />
                  </div>
                  <div className="col-md-6 mb-3">
                    <label className="form-label fw-semibold">
                      Thương hiệu
                    </label>
                    <select
                      name="BrandID"
                      className="form-select"
                      value={product.BrandID}
                      onChange={handleChange}
                    >
                      {brands.map((b) => (
                        <option key={b.BrandID} value={b.BrandID}>
                          {b.BrandName}
                        </option>
                      ))}
                    </select>
                    {errors.BrandID && (
                      <div className="text-danger mt-1">{errors.BrandID}</div>
                    )}
                  </div>
                </div>

                {/* Mô tả */}
                <div className="mb-3">
                  <label className="form-label fw-semibold">Mô tả</label>
                  <textarea
                    name="Description"
                    className="form-control"
                    rows="3"
                    value={product.Description || ""}
                    onChange={handleChange}
                  />
                </div>

                {/* Giá */}
                <div className="row">
                  <div className="col-md-6 mb-3">
                    <label className="form-label fw-semibold">
                      Giá nhập (VNĐ)
                    </label>
                    <input
                      type="number"
                      name="CostPrice"
                      className="form-control"
                      value={product.CostPrice}
                      onChange={handleChange}
                      required
                    />
                    {errors.CostPrice && (
                      <div className="text-danger mt-1">{errors.CostPrice}</div>
                    )}
                  </div>
                  <div className="col-md-6 mb-3">
                    <label className="form-label fw-semibold">
                      Giá bán (VNĐ)
                    </label>
                    <input
                      type="number"
                      name="SalePrice"
                      className="form-control"
                      value={product.SalePrice}
                      onChange={handleChange}
                      required
                    />
                    {errors.SalePrice && (
                      <div className="text-danger mt-1">{errors.SalePrice}</div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Biến thể (Variants) */}
            {variants.length > 0 && (
              <div className="mt-4">
                <h5 className="text-secondary fw-bold mb-3">
                  ⚙️ Thông tin chi tiết
                </h5>
                {variants.map((variant, index) => (
                  <div
                    key={variant.VariantID || index}
                    className="border rounded-3 p-3 mb-3 bg-light"
                  >
                    <div className="row g-2 align-items-end mb-2">
                      {/* Tên thuộc tính */}
                      <div className="col-md-3">
                        <label className="form-label">Tên thuộc tính</label>
                        <input
                          type="text"
                          className="form-control"
                          value={variant.AttributeName}
                          onChange={(e) =>
                            handleVariantChange(
                              index,
                              "AttributeName",
                              e.target.value
                            )
                          }
                        />
                        {errors[`variant_name_${index}`] && (
                          <div className="text-danger mt-1">
                            {errors[`variant_name_${index}`]}
                          </div>
                        )}
                      </div>

                      {/* Giá trị */}
                      <div className="col-md-2">
                        <label className="form-label">Giá trị</label>
                        <input
                          type="text"
                          className="form-control"
                          value={variant.Value}
                          onChange={(e) =>
                            handleVariantChange(index, "Value", e.target.value)
                          }
                        />
                        {errors[`variant_value_${index}`] && (
                          <div className="text-danger mt-1">
                            {errors[`variant_value_${index}`]}
                          </div>
                        )}
                      </div>

                      {/* Đơn vị */}
                      <div className="col-md-2">
                        <label className="form-label">Đơn vị</label>
                        <input
                          type="text"
                          className="form-control"
                          value={variant.Unit || ""}
                          onChange={(e) =>
                            handleVariantChange(index, "Unit", e.target.value)
                          }
                        />
                      </div>

                      {/* Mô tả */}
                      <div className="col-md-4">
                        <label className="form-label">Mô tả</label>
                        <input
                          type="text"
                          className="form-control"
                          value={variant.Description || ""}
                          onChange={(e) =>
                            handleVariantChange(
                              index,
                              "Description",
                              e.target.value
                            )
                          }
                        />
                      </div>

                      {/* Nút xóa */}
                      <div className="col-md-1 d-flex justify-content-center">
                        <button
                          type="button"
                          className="btn btn-danger btn-sm"
                          onClick={() => {
                            const updated = [...variants];
                            updated.splice(index, 1);
                            setVariants(updated);
                          }}
                        >
                          🗑️
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
                <div className="mt-2 mb-4">
                  <button
                    type="button"
                    className="btn btn-primary btn-sm"
                    onClick={handleAddVariant}
                  >
                    ➕ Thêm thuộc tính
                  </button>
                </div>
              </div>
            )}

            <div className="mt-4 text-end">
              <button type="submit" className="btn btn-success px-4">
                💾 Lưu thay đổi
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

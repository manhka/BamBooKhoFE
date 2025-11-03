"use client";

import React, { useEffect, useState } from "react";
import { getAllCategories } from "../services/categoryService";
import { getAllBrands } from "../services/brandService";
import { createProduct } from "../services/productService";

const AddProduct = () => {
  const [product, setProduct] = useState({
    BarcodeProduct: "",
    ProductName: "",
    BrandID: "",
    CategoryID: "",
    CostPrice: "",
    SalePrice: "",
    NumberOfProduct: 0,
    Image: "",
    Description: "",
  });

  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [categoryFields, setCategoryFields] = useState([]); // dynamic category fields
  const [customFields, setCustomFields] = useState([]); // user-defined fields
  const [errors, setErrors] = useState({}); // validation errors

  // --- Category field map ---
  const categoryFieldMap = {
    "Desktop PC": [
      { key: "CPU", label: "CPU", type: "text" },
      { key: "GPU", label: "GPU", type: "text" },
      { key: "RAM", label: "RAM (GB)", type: "number" },
      { key: "Storage", label: "Storage (GB)", type: "number" },
      { key: "PowerSupply", label: "Power Supply (W)", type: "number" },
      { key: "Case", label: "Case", type: "text" },
      { key: "OperatingSystem", label: "Operating System", type: "text" },
      { key: "Warranty", label: "Warranty (months)", type: "number" },
    ],
    Laptop: [
      { key: "CPU", label: "CPU", type: "text" },
      { key: "GPU", label: "GPU", type: "text" },
      { key: "RAM", label: "RAM (GB)", type: "number" },
      { key: "Storage", label: "Storage (GB)", type: "number" },
      { key: "Display", label: "Display (inch)", type: "number" },
      { key: "Battery", label: "Battery (mAh)", type: "number" },
      { key: "Weight", label: "Weight (kg)", type: "number" },
      { key: "Ports", label: "Ports", type: "text" },
      { key: "OperatingSystem", label: "Operating System", type: "text" },
    ],
    CPU: [
      { key: "Socket", label: "Socket", type: "text" },
      { key: "CoreCount", label: "Core Count", type: "number" },
      { key: "ThreadCount", label: "Thread Count", type: "number" },
      { key: "BaseClock", label: "Base Clock (GHz)", type: "number" },
      { key: "BoostClock", label: "Boost Clock (GHz)", type: "number" },
      { key: "TDP", label: "TDP (W)", type: "number" },
      { key: "IntegratedGPU", label: "Integrated GPU", type: "text" },
    ],
    GPU: [
      { key: "Chipset", label: "Chipset", type: "text" },
      { key: "VRAM", label: "VRAM (GB)", type: "number" },
      { key: "MemoryType", label: "Memory Type", type: "text" },
      { key: "BusWidth", label: "Bus Width (bit)", type: "number" },
      { key: "ClockSpeed", label: "Clock Speed (MHz)", type: "number" },
      { key: "OutputPorts", label: "Output Ports", type: "text" },
      { key: "TDP", label: "TDP (W)", type: "number" },
    ],
    // Bạn có thể thêm các danh mục khác tương tự...
  };

  // --- Load categories & brands ---
  useEffect(() => {
    const loadOptions = async () => {
      try {
        const [catRes, brandRes] = await Promise.all([
          getAllCategories(),
          getAllBrands(),
        ]);
        setCategories(catRes.data || catRes);
        setBrands(brandRes.data || brandRes);
      } catch (err) {
        console.error("Lỗi load options:", err);
      }
    };
    loadOptions();
  }, []);

  // --- Handle input change ---
  const handleChange = (e) => {
    const { name, value } = e.target;
    setProduct((prev) => ({ ...prev, [name]: value }));

    if (name === "CategoryID") {
      const selected = (categories || []).find(
        (c) => String(c.CategoryID) === String(value)
      );
      if (selected) {
        const fields = categoryFieldMap[selected.CategoryName] || [];
        setCategoryFields(
          fields.map((f) => ({ ...f, value: "", unit: "", description: "" }))
        );
      } else {
        setCategoryFields([]);
      }
    }
  };

  // --- Category field change ---
  const handleCategoryFieldChange = (index, field, value) => {
    const updated = [...categoryFields];
    updated[index][field] = value;
    setCategoryFields(updated);
  };

  // --- Custom fields ---
  const handleAddCustomField = () =>
    setCustomFields([
      ...customFields,
      { key: "", value: "", type: "text", unit: "", description: "" },
    ]);

  const handleCustomFieldChange = (idx, field, val) => {
    const u = [...customFields];
    u[idx][field] = val;
    setCustomFields(u);
  };

  const handleRemoveCustomField = (idx) =>
    setCustomFields(customFields.filter((_, i) => i !== idx));

  // --- Validation ---
  const validate = () => {
    const newErrors = {};

    if (!product.BarcodeProduct) newErrors.BarcodeProduct = "Mã vạch bắt buộc";
    if (!product.ProductName) newErrors.ProductName = "Tên sản phẩm bắt buộc";
    if (!product.CategoryID) newErrors.CategoryID = "Chọn danh mục";
    if (!product.CostPrice) newErrors.CostPrice = "Giá nhập bắt buộc";
    if (!product.SalePrice) newErrors.SalePrice = "Giá bán bắt buộc";
    if (!product.BrandID) newErrors.BrandID = "Chọn thương hiệu";

    if (product.NumberOfProduct < 0)
      newErrors.NumberOfProduct = "Số lượng không được âm";

    categoryFields.forEach((f) => {
      if (!f.value)
        newErrors[`cat_${f.key}`] = `${f.label} không được để trống`;
    });

    customFields.forEach((cf, idx) => {
      if (!cf.key)
        newErrors[`cus_key_${idx}`] = `Tên trường không được để trống`;
      if (!cf.value)
        newErrors[`cus_value_${idx}`] = `Giá trị không được để trống`;
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // --- Submit ---
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    const variants = [
      ...categoryFields.map((f) => ({
        AttributeName: f.key,
        Value: f.value,
        Unit: f.unit || null,
        Description: f.description || null,
      })),
      ...customFields
        .filter((f) => f.key)
        .map((f) => ({
          AttributeName: f.key,
          Value: f.value,
          Unit: f.unit || null,
          Description: f.description || null,
        })),
    ];

    const payload = { ...product, Variants: variants };

    try {
      await createProduct(payload);
      alert("Thêm sản phẩm thành công");

      // reset form
      setProduct({
        BarcodeProduct: "",
        ProductName: "",
        BrandID: "",
        CategoryID: "",
        CostPrice: "",
        SalePrice: "",
        NumberOfProduct: 0,
        Image: "",
        Description: "",
      });
      setCategoryFields([]);
      setCustomFields([]);
      setErrors({});
    } catch (err) {
      console.error(err);
      alert("Lỗi khi lưu sản phẩm");
    }
  };

  return (
    <div
      className="d-flex justify-content-center align-items-center "
      style={{
        height: "90vh",
        backgroundColor: "#ffffff",
        marginTop: "60px",
      }}
    >
      <div
        className="card shadow-lg border-0 mt-4"
        style={{
          width: "98%",
          height: "90vh",
        }}
      >
        <h4 className="mb-3 ms-3 mt-2">🛒 Thêm sản phẩm mới</h4>
        <div className="card-body overflow-auto p-4">
          <div className="container-fluid p-4">
            {/* Chọn danh mục */}
            <div className="card p-3 shadow-sm mb-4">
              <h6 className="mb-2">Chọn danh mục</h6>
              <select
                name="CategoryID"
                value={product.CategoryID}
                onChange={handleChange}
                className="form-select"
              >
                <option value="">-- Chọn danh mục --</option>
                {categories.map((c) => (
                  <option key={c.CategoryID} value={c.CategoryID}>
                    {c.CategoryName}
                  </option>
                ))}
              </select>
              {errors.CategoryID && (
                <div className="text-danger mt-1">{errors.CategoryID}</div>
              )}
            </div>

            {product.CategoryID && (
              <form onSubmit={handleSubmit} className="card p-3 shadow-sm">
                <h5>Thông tin cơ bản</h5>
                <div className="row">
                  {/* Barcode */}
                  <div className="col-md-4 mb-3">
                    <label className="form-label">Mã vạch</label>
                    <input
                      name="BarcodeProduct"
                      value={product.BarcodeProduct}
                      onChange={handleChange}
                      className="form-control"
                    />
                    {errors.BarcodeProduct && (
                      <div className="text-danger mt-1">
                        {errors.BarcodeProduct}
                      </div>
                    )}
                  </div>

                  {/* Product Name */}
                  <div className="col-md-4 mb-3">
                    <label className="form-label">Tên sản phẩm</label>
                    <input
                      name="ProductName"
                      value={product.ProductName}
                      onChange={handleChange}
                      className="form-control"
                    />
                    {errors.ProductName && (
                      <div className="text-danger mt-1">
                        {errors.ProductName}
                      </div>
                    )}
                  </div>

                  {/* Brand */}
                  <div className="col-md-4 mb-3">
                    <label className="form-label">Thương hiệu</label>
                    <select
                      name="BrandID"
                      value={product.BrandID}
                      onChange={handleChange}
                      className="form-select"
                    >
                      <option value="">-- Chọn thương hiệu --</option>
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

                  {/* CostPrice */}
                  <div className="col-md-4 mb-3">
                    <label className="form-label">Giá nhập</label>
                    <input
                      name="CostPrice"
                      type="number"
                      value={product.CostPrice}
                      onChange={handleChange}
                      className="form-control"
                      step="0.01"
                    />
                    {errors.CostPrice && (
                      <div className="text-danger mt-1">{errors.CostPrice}</div>
                    )}
                  </div>

                  {/* SalePrice */}
                  <div className="col-md-4 mb-3">
                    <label className="form-label">Giá bán</label>
                    <input
                      name="SalePrice"
                      type="number"
                      value={product.SalePrice}
                      onChange={handleChange}
                      className="form-control"
                      step="0.01"
                    />
                    {errors.SalePrice && (
                      <div className="text-danger mt-1">{errors.SalePrice}</div>
                    )}
                  </div>

                  {/* NumberOfProduct */}
                  <div className="col-md-4 mb-3">
                    <label className="form-label">Số lượng</label>
                    <input
                      name="NumberOfProduct"
                      type="number"
                      value={product.NumberOfProduct}
                      onChange={handleChange}
                      className="form-control"
                      min="0"
                    />
                    {errors.NumberOfProduct && (
                      <div className="text-danger mt-1">
                        {errors.NumberOfProduct}
                      </div>
                    )}
                  </div>

                  {/* Image */}
                  <div className="col-md-12 mb-3 text-center">
                    <label className="form-label d-block">
                      Ảnh sản phẩm (URL)
                    </label>

                    {/* Ảnh preview */}
                    <div
                      className="mb-3"
                      style={{
                        width: "200px",
                        height: "200px",
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
                        alt="Preview"
                        onError={(e) => {
                          e.target.onerror = null; // tránh loop lỗi
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
                    </div>

                    {/* Ô nhập URL ảnh */}
                    <input
                      name="Image"
                      value={product.Image}
                      onChange={handleChange}
                      className="form-control"
                      placeholder="Nhập URL ảnh sản phẩm..."
                    />
                  </div>

                  {/* Description */}
                  <div className="col-md-12 mb-3">
                    <label className="form-label">Mô tả</label>
                    <textarea
                      name="Description"
                      value={product.Description}
                      onChange={handleChange}
                      className="form-control"
                      rows={3}
                    />
                  </div>
                </div>

                {/* Dynamic category fields */}
                {categoryFields.length > 0 && (
                  <>
                    <h5 className="mt-4">Thông tin theo danh mục</h5>
                    <div className="row">
                      {categoryFields.map((f, idx) => (
                        <div key={f.key} className="col-md-4 mb-3">
                          <label className="form-label">{f.label}</label>
                          <input
                            type={f.type === "number" ? "number" : "text"}
                            value={f.value}
                            className="form-control"
                            onChange={(e) =>
                              handleCategoryFieldChange(
                                idx,
                                "value",
                                e.target.value
                              )
                            }
                            step={f.type === "number" ? "0.01" : undefined}
                          />
                          {errors[`cat_${f.key}`] && (
                            <div className="text-danger mt-1">
                              {errors[`cat_${f.key}`]}
                            </div>
                          )}
                          <input
                            type="text"
                            placeholder="Đơn vị (Unit, nếu có)"
                            value={f.unit || ""}
                            className="form-control mt-1"
                            onChange={(e) =>
                              handleCategoryFieldChange(
                                idx,
                                "unit",
                                e.target.value
                              )
                            }
                          />
                          <input
                            type="text"
                            placeholder="Mô tả"
                            value={f.description || ""}
                            className="form-control mt-1"
                            onChange={(e) =>
                              handleCategoryFieldChange(
                                idx,
                                "description",
                                e.target.value
                              )
                            }
                          />
                        </div>
                      ))}
                    </div>
                  </>
                )}

                {/* Custom fields */}
                <h5 className="mt-4">Thông tin bổ sung</h5>
                {customFields.map((cf, i) => (
                  <div key={i} className="row mb-2">
                    <div className="col-md-3">
                      <input
                        className="form-control"
                        placeholder="Tên trường"
                        value={cf.key}
                        onChange={(e) =>
                          handleCustomFieldChange(i, "key", e.target.value)
                        }
                      />
                      {errors[`cus_key_${i}`] && (
                        <div className="text-danger mt-1">
                          {errors[`cus_key_${i}`]}
                        </div>
                      )}
                    </div>
                    <div className="col-md-3">
                      <input
                        className="form-control"
                        placeholder="Giá trị"
                        type={cf.type === "number" ? "number" : "text"}
                        value={cf.value}
                        onChange={(e) =>
                          handleCustomFieldChange(i, "value", e.target.value)
                        }
                      />
                      {errors[`cus_value_${i}`] && (
                        <div className="text-danger mt-1">
                          {errors[`cus_value_${i}`]}
                        </div>
                      )}
                    </div>
                    <div className="col-md-2">
                      <input
                        className="form-control"
                        placeholder="Mô tả"
                        value={cf.description || ""}
                        onChange={(e) =>
                          handleCustomFieldChange(
                            i,
                            "description",
                            e.target.value
                          )
                        }
                      />
                    </div>
                    <div className="col-md-2">
                      <input
                        className="form-control"
                        placeholder="Đơn vị (Unit)"
                        value={cf.unit || ""}
                        onChange={(e) =>
                          handleCustomFieldChange(i, "unit", e.target.value)
                        }
                      />
                    </div>
                    <div className="col-md-2 d-flex align-items-center">
                      <button
                        type="button"
                        className="btn btn-outline-danger"
                        onClick={() => handleRemoveCustomField(i)}
                      >
                        X
                      </button>
                    </div>
                  </div>
                ))}

                <button
                  type="button"
                  className="btn btn-outline-primary mt-2"
                  onClick={handleAddCustomField}
                >
                  + Thêm trường mới
                </button>

                <div className="text-end mt-4">
                  <button type="submit" className="btn btn-success">
                    Lưu sản phẩm
                  </button>
                </div>
              </form>
            )}
          </div>
          {/* ====== */}
        </div>
      </div>
    </div>
  );
};

export default AddProduct;

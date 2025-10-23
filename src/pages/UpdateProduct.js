"use client";

import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getAllCategories } from "../services/categoryService";
import { getAllBrands } from "../services/brandService";
import { getProductByBarcode, updateProduct } from "../services/productService";

const categoryFieldMap = {
  "Desktop PC": [
    { label: "CPU", type: "text" },
    { label: "GPU", type: "text" },
    { label: "RAM", type: "text" },
    { label: "Storage", type: "text" },
    { label: "Power Supply", type: "text" },
    { label: "Case", type: "text" },
    { label: "Operating System", type: "text" },
    { label: "Warranty", type: "text" },
  ],
  Laptop: [
    { label: "CPU", type: "text" },
    { label: "GPU", type: "text" },
    { label: "RAM", type: "text" },
    { label: "Storage", type: "text" },
    { label: "Display", type: "text" },
    { label: "Battery", type: "text" },
    { label: "Weight", type: "number" },
    { label: "Ports", type: "text" },
    { label: "Operating System", type: "text" },
  ],
  CPU: [
    { label: "Socket", type: "text" },
    { label: "Core Count", type: "number" },
    { label: "Thread Count", type: "number" },
    { label: "Base Clock (GHz)", type: "number" },
    { label: "Boost Clock (GHz)", type: "number" },
    { label: "TDP (W)", type: "number" },
    { label: "Integrated GPU", type: "text" },
  ],
  GPU: [
    { label: "Chipset", type: "text" },
    { label: "VRAM (GB)", type: "number" },
    { label: "Memory Type", type: "text" },
    { label: "Bus Width (bit)", type: "number" },
    { label: "Clock Speed (MHz)", type: "number" },
    { label: "Output Ports", type: "text" },
    { label: "TDP (W)", type: "number" },
  ],
  Motherboard: [
    { label: "Socket", type: "text" },
    { label: "Chipset", type: "text" },
    { label: "Form Factor", type: "text" },
    { label: "RAM Type", type: "text" },
    { label: "RAM Slots", type: "number" },
    { label: "PCIe Slots", type: "number" },
    { label: "Storage Ports", type: "text" },
    { label: "Network Support", type: "text" },
  ],
  RAM: [
    { label: "Capacity (GB)", type: "number" },
    { label: "Type", type: "text" },
    { label: "Speed (MHz)", type: "number" },
    { label: "CAS Latency", type: "number" },
    { label: "Voltage", type: "number" },
    { label: "Kit (1x8GB / 2x8GB)", type: "text" },
  ],
  Storage: [
    { label: "Type (SSD/HDD)", type: "text" },
    { label: "Capacity", type: "text" },
    { label: "Interface (SATA/NVMe)", type: "text" },
    { label: "Form Factor", type: "text" },
    { label: "Read Speed (MB/s)", type: "number" },
    { label: "Write Speed (MB/s)", type: "number" },
  ],
  "Power Supply": [
    { label: "Wattage", type: "number" },
    { label: "Efficiency Rating", type: "text" },
    { label: "Modular (Yes/No)", type: "text" },
    { label: "Fan Size (mm)", type: "number" },
  ],
  Cooling: [
    { label: "Type (Air/Liquid)", type: "text" },
    { label: "Fan Count", type: "number" },
    { label: "Radiator Size", type: "text" },
    { label: "Noise Level (dBA)", type: "number" },
    { label: "RGB (Yes/No)", type: "text" },
  ],
  Case: [
    { label: "Form Factor", type: "text" },
    { label: "Material", type: "text" },
    { label: "Color", type: "text" },
    { label: "Fan Support", type: "text" },
    { label: "Radiator Support", type: "text" },
    { label: "Side Panel Type", type: "text" },
  ],
  Monitor: [
    { label: "Size (inch)", type: "number" },
    { label: "Resolution", type: "text" },
    { label: "Refresh Rate (Hz)", type: "number" },
    { label: "Panel Type", type: "text" },
    { label: "Response Time (ms)", type: "number" },
    { label: "Brightness (nits)", type: "number" },
    { label: "Ports", type: "text" },
  ],
  Peripheral: [
    { label: "Type (Keyboard/Mouse/Headset...)", type: "text" },
    { label: "Connection (Wired/Wireless)", type: "text" },
    { label: "Features (RGB, DPI, Mic...)", type: "text" },
    { label: "Compatibility", type: "text" },
  ],
};

export default function UpdateProduct() {
  const { barcode } = useParams();
  const navigate = useNavigate();

  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [product, setProduct] = useState(null);
  const [extraFields, setExtraFields] = useState({});

  useEffect(() => {
    getAllCategories().then((res) => {
      setCategories(res.data || res);
    });
    getAllBrands().then((res) => {
      setBrands(res.data || res);
    });

    if (barcode) {
      getProductByBarcode(barcode).then((res) => {
        console.log("🔍 Product API raw response:", res);

        const data = res.data || res;
        console.log("✅ Parsed product data:", data);

        setProduct(data.product);
        setExtraFields(data.ExtraInfo || {});
      });
    }
  }, [barcode]);

  if (!product) {
    return (
      <div className="p-5 text-center text-muted mt-5">Đang tải dữ liệu...</div>
    );
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProduct({ ...product, [name]: value });
  };

  const handleExtraFieldChange = (label, value) => {
    setExtraFields({ ...extraFields, [label]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const updated = { ...product, ExtraInfo: extraFields };
    await updateProduct(product.BarcodeProduct, updated);
    navigate("/products/list");
  };

  const selectedCategory =
    categories.find((c) => c.CategoryID === product.CategoryID)?.CategoryName ||
    "";

  return (
    <div className="container-fluid p-4 mt-5">
      <div className="card shadow-sm">
        <div className="card-body">
          <h3 className="mb-4 text-primary">Cập nhật sản phẩm</h3>
          <form onSubmit={handleSubmit}>
            {/* Tên sản phẩm */}
            <div className="mb-3">
              <label className="form-label">Tên sản phẩm</label>
              <input
                type="text"
                name="ProductName"
                className="form-control"
                value={product.ProductName}
                onChange={handleChange}
                required
              />
            </div>

            {/* Danh mục (không được đổi) */}
            <div className="mb-3">
              <label className="form-label">Danh mục</label>
              <input
                type="text"
                className="form-control"
                value={selectedCategory}
                disabled
              />
            </div>

            {/* Thương hiệu */}
            <div className="mb-3">
              <label className="form-label">Thương hiệu</label>
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
            </div>

            {/* Hình ảnh */}
            <div className="mb-3">
              <label className="form-label">Hình ảnh (URL)</label>
              <input
                type="text"
                name="Image"
                className="form-control"
                value={product.Image || ""}
                onChange={handleChange}
              />
            </div>

            {/* Mô tả */}
            <div className="mb-3">
              <label className="form-label">Mô tả</label>
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
                <label className="form-label">Giá nhập (VNĐ)</label>
                <input
                  type="number"
                  name="CostPrice"
                  className="form-control"
                  value={product.CostPrice}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="col-md-6 mb-3">
                <label className="form-label">Giá bán (VNĐ)</label>
                <input
                  type="number"
                  name="SalePrice"
                  className="form-control"
                  value={product.SalePrice}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            {/* Extra Info */}
            {selectedCategory && (
              <div className="mt-4">
                <h5 className="text-secondary mb-3">Thông tin chi tiết</h5>
                <div className="row">
                  {categoryFieldMap[selectedCategory]?.map((field) => (
                    <div className="col-md-6 mb-3" key={field.label}>
                      <label className="form-label">{field.label}</label>
                      <input
                        type={field.type}
                        className="form-control"
                        value={extraFields[field.label] || ""}
                        onChange={(e) =>
                          handleExtraFieldChange(field.label, e.target.value)
                        }
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="mt-4 text-end">
              <button type="submit" className="btn btn-success px-4">
                Lưu thay đổi
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

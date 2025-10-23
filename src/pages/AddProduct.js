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
  const [categoryFields, setCategoryFields] = useState([]); // [{ key, label, type, value }]
  const [customFields, setCustomFields] = useState([]); // [{ key, value, type }]

  // --- Bản đồ danh mục: mỗi trường kèm type ---
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
    Motherboard: [
      { key: "Socket", label: "Socket", type: "text" },
      { key: "Chipset", label: "Chipset", type: "text" },
      { key: "FormFactor", label: "Form Factor", type: "text" },
      { key: "RAMType", label: "RAM Type", type: "text" },
      { key: "RAMSlots", label: "RAM Slots", type: "number" },
      { key: "PCIeSlots", label: "PCIe Slots", type: "number" },
      { key: "StoragePorts", label: "Storage Ports", type: "text" },
      { key: "NetworkSupport", label: "Network Support", type: "text" },
    ],
    RAM: [
      { key: "Capacity", label: "Capacity (GB)", type: "number" },
      { key: "Type", label: "Type", type: "text" },
      { key: "Speed", label: "Speed (MHz)", type: "number" },
      { key: "CASLatency", label: "CAS Latency", type: "text" },
      { key: "Voltage", label: "Voltage (V)", type: "number" },
      { key: "Kit", label: "Kit (e.g. 2x8GB)", type: "text" },
    ],
    Storage: [
      { key: "StorageType", label: "Type (SSD/HDD)", type: "text" },
      { key: "Capacity", label: "Capacity (GB)", type: "number" },
      { key: "Interface", label: "Interface (SATA/NVMe)", type: "text" },
      { key: "FormFactor", label: "Form Factor", type: "text" },
      { key: "ReadSpeed", label: "Read Speed (MB/s)", type: "number" },
      { key: "WriteSpeed", label: "Write Speed (MB/s)", type: "number" },
    ],
    "Power Supply": [
      { key: "Wattage", label: "Wattage (W)", type: "number" },
      { key: "Efficiency", label: "Efficiency Rating", type: "text" },
      { key: "Modular", label: "Modular (Yes/No)", type: "text" },
      { key: "FanSize", label: "Fan Size (mm)", type: "number" },
    ],
    Cooling: [
      { key: "CoolingType", label: "Type (Air/Liquid)", type: "text" },
      { key: "FanCount", label: "Fan Count", type: "number" },
      { key: "RadiatorSize", label: "Radiator Size (mm)", type: "number" },
      { key: "NoiseLevel", label: "Noise Level (dBA)", type: "number" },
      { key: "RGB", label: "RGB (Yes/No)", type: "text" },
    ],
    Case: [
      { key: "FormFactor", label: "Form Factor", type: "text" },
      { key: "Material", label: "Material", type: "text" },
      { key: "Color", label: "Color", type: "text" },
      { key: "FanSupport", label: "Fan Support", type: "text" },
      { key: "RadiatorSupport", label: "Radiator Support", type: "text" },
      { key: "SidePanel", label: "Side Panel Type", type: "text" },
    ],
    Monitor: [
      { key: "Size", label: "Size (inch)", type: "number" },
      { key: "Resolution", label: "Resolution", type: "text" },
      { key: "RefreshRate", label: "Refresh Rate (Hz)", type: "number" },
      { key: "PanelType", label: "Panel Type", type: "text" },
      { key: "ResponseTime", label: "Response Time (ms)", type: "number" },
      { key: "Brightness", label: "Brightness (nits)", type: "number" },
      { key: "Ports", label: "Ports", type: "text" },
    ],
    Peripheral: [
      {
        key: "PeripheralType",
        label: "Type (Keyboard/Mouse/...)",
        type: "text",
      },
      { key: "Connection", label: "Connection (Wired/Wireless)", type: "text" },
      { key: "Features", label: "Features (RGB, DPI...)", type: "text" },
      { key: "Compatibility", label: "Compatibility", type: "text" },
    ],
  };

  // --- Load options ---
  useEffect(() => {
    const load = async () => {
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
    load();
  }, []);

  // --- khi đổi input chung ---
  const handleChange = (e) => {
    const { name, value } = e.target;
    setProduct((p) => ({ ...p, [name]: value }));

    if (name === "CategoryID") {
      const selected = (categories || []).find(
        (c) => String(c.CategoryID) === String(value)
      );
      if (selected) {
        const fields = categoryFieldMap[selected.CategoryName] || [];
        // khởi tạo value rỗng cho mỗi trường động
        setCategoryFields(fields.map((f) => ({ ...f, value: "" })));
      } else {
        setCategoryFields([]);
      }
    }
  };

  // --- thay đổi trường động ---
  const handleCategoryFieldChange = (index, newValue) => {
    const updated = [...categoryFields];
    updated[index].value = newValue;
    setCategoryFields(updated);
  };

  // --- custom fields handlers ---
  const handleAddCustomField = () =>
    setCustomFields([...customFields, { key: "", value: "", type: "text" }]);

  const handleCustomFieldChange = (idx, field, val) => {
    const u = [...customFields];
    u[idx][field] = val;
    setCustomFields(u);
  };

  const handleRemoveCustomField = (idx) =>
    setCustomFields(customFields.filter((_, i) => i !== idx));

  // --- submit ---
  const handleSubmit = async (e) => {
    e.preventDefault();
    const extraInfo = {
      ...categoryFields.reduce((acc, f) => {
        acc[f.key] = f.value;
        return acc;
      }, {}),
      ...customFields.reduce((acc, f) => {
        if (f.key) acc[f.key] = f.value;
        return acc;
      }, {}),
    };

    const payload = {
      ...product,
      ExtraInfo: extraInfo,
    };

    try {
      await createProduct(payload);
      alert("✅ Thêm sản phẩm thành công");
      // reset form (như ban đầu)
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
    } catch (err) {
      console.error(err);
      alert("❌ Lỗi khi lưu sản phẩm");
    }
  };

  return (
    <div
      className="container-fluid p-4"
      style={{
        position: "sticky",
        top: 56,
        zIndex: 1000,
        background: "white",
        padding: "12px 0",
      }}
    >
      <h4 className="mb-3">🛒 Thêm sản phẩm mới</h4>

      <div className="card p-3 shadow-sm mb-4">
        <h6 className="mb-2">Chọn danh mục</h6>
        <select
          name="CategoryID"
          value={product.CategoryID}
          onChange={handleChange}
          className="form-select"
          required
        >
          <option value="">-- Chọn danh mục --</option>
          {categories.map((c) => (
            <option key={c.CategoryID} value={c.CategoryID}>
              {c.CategoryName}
            </option>
          ))}
        </select>
      </div>

      {product.CategoryID && (
        <form onSubmit={handleSubmit} className="card p-3 shadow-sm">
          <h5>Thông tin cơ bản</h5>
          <div className="row">
            <div className="col-md-4 mb-3">
              <label className="form-label">Mã vạch</label>
              <input
                name="BarcodeProduct"
                value={product.BarcodeProduct}
                onChange={handleChange}
                className="form-control"
                required
              />
            </div>

            <div className="col-md-4 mb-3">
              <label className="form-label">Tên sản phẩm</label>
              <input
                name="ProductName"
                value={product.ProductName}
                onChange={handleChange}
                className="form-control"
                required
              />
            </div>

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
            </div>

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
            </div>

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
            </div>

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
            </div>

            <div className="col-md-12 mb-3">
              <label className="form-label">Ảnh sản phẩm (URL)</label>
              <input
                name="Image"
                value={product.Image}
                onChange={handleChange}
                className="form-control"
              />
            </div>

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

          {/* dynamic category fields */}
          {categoryFields.length > 0 && (
            <>
              <h5 className="mt-4">Thông tin theo danh mục</h5>
              <div className="row">
                {categoryFields.map((f, idx) => (
                  <div key={f.key} className="col-md-4 mb-3">
                    <label className="form-label">{f.label}</label>
                    <input
                      className="form-control"
                      type={f.type === "number" ? "number" : "text"}
                      value={f.value}
                      onChange={(e) =>
                        handleCategoryFieldChange(idx, e.target.value)
                      }
                      step={f.type === "number" ? "0.01" : undefined}
                    />
                  </div>
                ))}
              </div>
            </>
          )}

          {/* custom fields */}
          <h5 className="mt-4">Thông tin bổ sung</h5>
          {customFields.map((cf, i) => (
            <div key={i} className="row mb-2">
              <div className="col-md-5">
                <input
                  className="form-control"
                  placeholder="Tên trường"
                  value={cf.key}
                  onChange={(e) =>
                    handleCustomFieldChange(i, "key", e.target.value)
                  }
                />
              </div>
              <div className="col-md-5">
                <input
                  className="form-control"
                  placeholder="Giá trị"
                  type={cf.type === "number" ? "number" : "text"}
                  value={cf.value}
                  onChange={(e) =>
                    handleCustomFieldChange(i, "value", e.target.value)
                  }
                />
              </div>
              <div className="col-md-2 d-flex gap-2">
                <select
                  className="form-select"
                  value={cf.type}
                  onChange={(e) =>
                    handleCustomFieldChange(i, "type", e.target.value)
                  }
                >
                  <option value="text">Text</option>
                  <option value="number">Number</option>
                </select>
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
  );
};

export default AddProduct;

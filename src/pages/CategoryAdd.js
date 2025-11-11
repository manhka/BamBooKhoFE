import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { createCategory } from "../services/categoryService";
import { useNavigate } from "react-router-dom";
import { showAlert } from "../utils/toast";
import { useApiWithErrorRedirect } from "../hooks/useApiWithErrorRedirect";

const CategoryAdd = () => {
  const { callApi } = useApiWithErrorRedirect();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    CategoryName: "",
    Description: "",
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    if (errors[name]) {
      setErrors({ ...errors, [name]: "" });
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.CategoryName.trim()) {
      newErrors.CategoryName = "Tên danh mục là bắt buộc";
    }
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setLoading(true);
    try {
      await callApi(() => createCategory(formData));
      showAlert("Thêm danh mục thành công!", "success");
      navigate("/categories");
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Lỗi khi thêm danh mục";
      showAlert(errorMessage, "danger");
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setFormData({
      CategoryName: "",
      Description: "",
    });
    setErrors({});
  };

  return (
    <div className="container-fluid">
      <div className="row">
        <div className="col-12">
          <div className="card border-0 shadow-sm">
            <div className="card-body p-4">
              <h4 className="mb-4">Thêm danh mục</h4>

              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label className="form-label">
                    Tên danh mục <span className="text-danger">*</span>
                  </label>
                  <input
                    type="text"
                    className={`form-control ${
                      errors.CategoryName ? "is-invalid" : ""
                    }`}
                    name="CategoryName"
                    placeholder="Nhập tên danh mục"
                    value={formData.CategoryName}
                    onChange={handleChange}
                  />
                  {errors.CategoryName && (
                    <div className="invalid-feedback">
                      {errors.CategoryName}
                    </div>
                  )}
                </div>

                <div className="mb-3">
                  <label className="form-label">Mô tả</label>
                  <textarea
                    className="form-control"
                    name="Description"
                    placeholder="Nhập mô tả"
                    rows="4"
                    value={formData.Description}
                    onChange={handleChange}
                  />
                </div>

                <div className="d-flex gap-2">
                  <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={loading}
                  >
                    {loading ? "Đang thêm..." : "Thêm danh mục"}
                  </button>
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={handleReset}
                  >
                    Đặt lại
                  </button>
                  <button
                    type="button"
                    className="btn btn-outline-secondary"
                    onClick={() => navigate("/categories")}
                  >
                    Hủy
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CategoryAdd;

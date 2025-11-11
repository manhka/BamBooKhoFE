import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { getBrandById, updateBrand } from "../services/brandService";
import { useNavigate, useParams } from "react-router-dom";
import { showAlert } from "../utils/toast";
import { useApiWithErrorRedirect } from "../hooks/useApiWithErrorRedirect";

const BrandEdit = () => {
  const { callApi } = useApiWithErrorRedirect();

  const navigate = useNavigate();
  const { id } = useParams();
  const [formData, setFormData] = useState({
    BrandName: "",
    Description: "",
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    fetchBrand();
  }, [id]);

  const fetchBrand = async () => {
    try {
      const result = await callApi(() => getBrandById(id));
      setFormData({
        BrandName: result.data.BrandName || "",
        Description: result.data.Description || "",
      });
    } catch (error) {
      showAlert("Lỗi khi tải thương hiệu!", "danger");
      navigate("/brands");
    } finally {
      setFetching(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    if (errors[name]) {
      setErrors({ ...errors, [name]: "" });
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.BrandName.trim()) {
      newErrors.BrandName = "Tên thương hiệu là bắt buộc";
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
      await callApi(() => updateBrand(id, formData));
      showAlert("Cập nhật thương hiệu thành công!", "success");
      navigate("/brands");
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Lỗi khi cập nhật thương hiệu";
      showAlert(errorMessage, "danger");
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <div className="container-fluid">
        <div className="text-center mt-5">
          <div className="spinner-border" role="status">
            <span className="visually-hidden">Đang tải...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container-fluid">
      <div className="row">
        <div className="col-12">
          <div className="card border-0 shadow-sm">
            <div className="card-body p-4">
              <h4 className="mb-4">Sửa thương hiệu</h4>

              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label className="form-label">
                    Tên thương hiệu <span className="text-danger">*</span>
                  </label>
                  <input
                    type="text"
                    className={`form-control ${
                      errors.BrandName ? "is-invalid" : ""
                    }`}
                    name="BrandName"
                    placeholder="Nhập tên thương hiệu"
                    value={formData.BrandName}
                    onChange={handleChange}
                  />
                  {errors.BrandName && (
                    <div className="invalid-feedback">{errors.BrandName}</div>
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
                    {loading ? "Đang cập nhật..." : "Cập nhật thương hiệu"}
                  </button>
                  <button
                    type="button"
                    className="btn btn-outline-secondary"
                    onClick={() => navigate("/brands")}
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

export default BrandEdit;

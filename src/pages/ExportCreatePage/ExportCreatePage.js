import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { createExportOrder } from "../../services/exportService";
import { getProducts } from "../../services/productService";
import {
  getAllCustomers,
  getCustomerById,
} from "../../services/customerService";
import AddCustomerModal from "../../components/AddCustomerModal/AddCustomerModal";
import EditCustomerModal from "../../components/EditCustomerModal/EditCustomerModal";
import Select from "react-select";
import { Trash2, Send, AlertTriangle, UserPlus, Pencil } from "lucide-react";
import styles from "./ExportCreatePage.module.css";
import DatePicker from "react-datepicker";
import { toast } from "react-toastify"; // Import Toast

const parseDateString = (dateString) => {
  if (!dateString) return null;
  try {
    const parts = dateString.split("-");
    return new Date(parts[0], parts[1] - 1, parts[2]);
  } catch (e) {
    return null;
  }
};

const formatDateToString = (date) => {
  if (!date) return null;
  return date.toISOString().split("T")[0];
};

const fetchCustomers = async () => {
  try {
    const res = await getAllCustomers();
    return Array.isArray(res.data) ? res.data : [];
  } catch {
    return [];
  }
};

const ExportCreatePage = () => {
  const navigate = useNavigate();
  const [customers, setCustomers] = useState([]);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [exportDate, setExportDate] = useState(formatDateToString(new Date()));
  const [details, setDetails] = useState([]);
  const [productOptions, setProductOptions] = useState([]);
  const [productSearchInput, setProductSearchInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [customerForEdit, setCustomerForEdit] = useState(null);

  // Load Customers
  useEffect(() => {
    const loadCustomers = async () => {
      const customerData = await fetchCustomers();
      setCustomers(
        customerData.map((c) => ({
          value: c.CustomerID,
          label: `${c.CustomerName} (${c.Phone || "N/A"})`,
        })) || []
      );
    };
    loadCustomers();
  }, []);

  // Search Products (Debounced)
  useEffect(() => {
    const handler = setTimeout(async () => {
      if (productSearchInput.trim().length >= 2) {
        try {
          const result = await getProducts({ keyword: productSearchInput });
          const productsData = result?.products || [];
          setProductOptions(
            productsData
              ?.filter((p) => !p.IsArchive && p.NumberOfProduct > 0)
              .map((p) => ({
                value: p.BarcodeProduct,
                label: `${p.ProductName} (Tồn: ${p.NumberOfProduct})`,
                product: p,
              })) || []
          );
        } catch (err) {
          setProductOptions([]);
        }
      } else {
        setProductOptions([]);
      }
    }, 500);
    return () => clearTimeout(handler);
  }, [productSearchInput]);

  const handleAddProduct = (selectedOption) => {
    if (selectedOption?.product) {
      const existingIndex = details.findIndex(
        (d) =>
          d.product.BarcodeProduct === selectedOption.product.BarcodeProduct
      );
      if (existingIndex === -1) {
        setDetails([
          ...details,
          {
            product: selectedOption.product,
            quantity: 1,
            warrantyTime: null,
            warrantyStartTime: formatDateToString(new Date()),
            warrantyStatus: true,
          },
        ]);

        // Sửa lỗi logic: Xóa key 'details'
        setErrors((prev) => {
          const newErrors = { ...prev };
          if (newErrors.details) {
            delete newErrors.details;
          }
          return newErrors;
        });
      } else {
        handleDetailChange(
          existingIndex,
          "quantity",
          details[existingIndex].quantity + 1
        );
      }
      setProductSearchInput("");
      setProductOptions([]);
    }
  };

  const handleDetailChange = (index, field, value) => {
    const updatedDetails = [...details];
    const item = updatedDetails[index];
    let newErrors = { ...errors };
    const errorKeyQty = `details[${index}].quantity`;
    const errorKeyWarranty = `details[${index}].warrantyTime`;
    const errorKeyWarrantyStart = `details[${index}].warrantyStartTime`;

    if (field === "quantity") {
      const numQuantity = Number(value);
      if (isNaN(numQuantity) || numQuantity < 0) return;
      const product = item.product;
      if (numQuantity > product.NumberOfProduct) {
        newErrors[errorKeyQty] = `Tồn kho chỉ còn ${product.NumberOfProduct}`;
        item.quantity = product.NumberOfProduct;
      } else {
        delete newErrors[errorKeyQty];
        item.quantity = numQuantity;
      }
    } else if (field === "warrantyTime") {
      const numTime = value === "" ? null : Number(value);
      if (value !== "" && (isNaN(numTime) || numTime < 0)) {
        newErrors[errorKeyWarranty] = "Phải là số >= 0";
      } else {
        delete newErrors[errorKeyWarranty];
        item.warrantyTime = numTime;
      }
    } else if (field === "warrantyStartTime") {
      item.warrantyStartTime = formatDateToString(value);
      delete newErrors[errorKeyWarrantyStart];
    } else if (field === "warrantyStatus") {
      item.warrantyStatus = Boolean(value);
    }

    setErrors(newErrors);
    setDetails(updatedDetails);
  };

  const handleRemoveProduct = (index) => {
    setDetails(details.filter((_, i) => i !== index));
    const newErrors = { ...errors };
    delete newErrors[`details[${index}].quantity`];
    delete newErrors[`details[${index}].warrantyTime`];
    delete newErrors[`details[${index}].warrantyStartTime`];
    setErrors(newErrors);
  };

  const calculateTotal = () => {
    return details.reduce(
      (sum, item) =>
        sum +
        (Number(item.product.SalePrice) || 0) * (Number(item.quantity) || 0),
      0
    );
  };

  // Modal THÊM KH
  const handleCustomerCreated = (newCustomer) => {
    const newOption = {
      value: newCustomer.CustomerID,
      label: `${newCustomer.CustomerName} (${newCustomer.Phone || "N/A"})`,
    };
    setCustomers((prevOptions) => [newOption, ...prevOptions]);
    setSelectedCustomer(newOption);
    if (errors.customer) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors.customer;
        return newErrors;
      });
    }
  };

  // Modal SỬA KH: Mở và fetch data
  const handleOpenEditModal = async () => {
    if (!selectedCustomer) return;

    setIsEditModalOpen(true);
    setCustomerForEdit(null);
    try {
      const result = await getCustomerById(selectedCustomer.value);
      if (result.status === "success") {
        setCustomerForEdit(result.data);
      } else {
        setIsEditModalOpen(false);
        toast.error("Không thể tải thông tin khách hàng.", { autoClose: 3000 });
      }
    } catch (error) {
      setIsEditModalOpen(false);
      toast.error("Lỗi khi tải thông tin khách hàng.", { autoClose: 3000 });
    }
  };

  // Modal SỬA KH: Cập nhật thành công
  const handleCustomerUpdated = (updatedCustomer) => {
    setIsEditModalOpen(false);
    const newLabel = `${updatedCustomer.CustomerName} (${
      updatedCustomer.Phone || "N/A"
    })`;

    setCustomers((prevOptions) =>
      prevOptions.map((opt) =>
        opt.value === updatedCustomer.CustomerID
          ? { value: updatedCustomer.CustomerID, label: newLabel }
          : opt
      )
    );
    setSelectedCustomer({ value: updatedCustomer.CustomerID, label: newLabel });
    toast.success("Cập nhật thông tin khách hàng thành công!", {
      autoClose: 3000,
    });
  };

  // Submit Order
  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsLoading(true);
    setErrors({});
    let formIsValid = true;
    const currentErrors = {};

    // Validation Frontend
    if (!selectedCustomer) {
      currentErrors.customer = "Vui lòng chọn khách hàng.";
      formIsValid = false;
    }
    if (details.length === 0) {
      currentErrors.details = "Vui lòng thêm ít nhất một sản phẩm.";
      formIsValid = false;
    }

    details.forEach((item, index) => {
      if (!item.quantity || item.quantity <= 0) {
        currentErrors[`details[${index}].quantity`] = "Số lượng phải > 0.";
        formIsValid = false;
      } else if (item.quantity > item.product.NumberOfProduct) {
        currentErrors[
          `details[${index}].quantity`
        ] = `Vượt tồn kho (${item.product.NumberOfProduct}).`;
        formIsValid = false;
      }
    });

    if (!formIsValid) {
      setErrors(currentErrors);
      setIsLoading(false);
      return;
    }

    const orderData = {
      CustomerID: selectedCustomer.value,
      // UserID đã được xóa ở Frontend vì Backend lấy từ Token
      ExportDate: exportDate,
      Details: details.map((item) => ({
        BarcodeProduct: item.product.BarcodeProduct,
        Quantity: item.quantity,
        WarrantyTime: item.warrantyTime,
        WarrantyStartTime: item.warrantyStartTime,
        WarrantyStatus: item.warrantyStatus,
      })),
    };

    try {
      await createExportOrder(orderData);

      // === SỬA: DÙNG TOAST THAY CHO alert() ===
      toast.success(`Tạo phiếu xuất thành công!`, {
        position: "top-right",
        autoClose: 3000,
      });
      // ===================================

      navigate("/export-history");
    } catch (err) {
      console.error("Create export error:", err);

      // Xử lý lỗi backend
      const backendErrors = {};
      // ... (Logic xử lý lỗi backend, giữ nguyên) ...
      if (err.errors) {
        if (Array.isArray(err.errors)) {
          err.errors.forEach((e) => {
            if (e.rowIndex !== undefined) {
              Object.entries(e.errors).forEach(([field, msg]) => {
                backendErrors[
                  `details[${e.rowIndex - 1}].${field.toLowerCase()}`
                ] = msg;
              });
            } else if (e.general) {
              backendErrors.general = e.general;
            }
          });
        } else if (typeof err.errors === "object") {
          Object.entries(err.errors).forEach(([field, msg]) => {
            backendErrors[field.toLowerCase()] = msg;
          });
        }
        setErrors(backendErrors);
      } else {
        setErrors({ general: err.message || "Lỗi khi tạo phiếu xuất." });
      }

      // === SỬA: HIỆN TOAST LỖI ===
      const errorMessage =
        backendErrors.general ||
        err.message ||
        "Lỗi không xác định khi tạo phiếu xuất.";
      toast.error(errorMessage, {
        position: "top-right",
        autoClose: 5000,
      });
      // ===========================
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.pageTitle}>Tạo Phiếu Xuất Kho</h2>

      {errors.general && (
        <div className={styles.alert}>
          <AlertTriangle size={18} className={styles.alertIcon} />{" "}
          {errors.general}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className={styles.card}>
          <div className={styles.cardHeader}>Thông Tin Chung</div>
          <div className={`${styles.cardBody} ${styles.infoGrid}`}>
            <div className={styles.formGroup}>
              <label htmlFor="customerSelect" className={styles.formLabel}>
                Khách Hàng <span className={styles.requiredMark}>*</span>
              </label>
              <div className={styles.customerInputWrapper}>
                <Select
                  id="customerSelect"
                  options={customers}
                  value={selectedCustomer}
                  onChange={(value) => {
                    setSelectedCustomer(value);
                    if (errors.customer) {
                      setErrors((prev) => {
                        const newErrors = { ...prev };
                        delete newErrors.customer;
                        return newErrors;
                      });
                    }
                  }}
                  placeholder="Chọn hoặc tìm khách hàng..."
                  isClearable
                  menuPortalTarget={document.body}
                  styles={{
                    control: (base) =>
                      errors.customer
                        ? { ...base, borderColor: "red", zIndex: 10 }
                        : { ...base, zIndex: 10 },
                    menuPortal: (base) => ({ ...base, zIndex: 9999 }),
                  }}
                  className={styles.customerSelect}
                />
                <button
                  type="button"
                  className={`${styles.button} ${styles.buttonIconOnly}`}
                  onClick={() => setIsAddModalOpen(true)}
                  title="Thêm khách hàng mới"
                >
                  <UserPlus size={18} />
                </button>
                <button
                  type="button"
                  className={`${styles.button} ${styles.buttonIconOnly} ${styles.buttonEdit}`}
                  onClick={handleOpenEditModal}
                  title="Sửa khách hàng đã chọn"
                  disabled={!selectedCustomer}
                >
                  <Pencil size={18} />
                </button>
              </div>
              {errors.customer && (
                <small className={styles.errorMessage}>{errors.customer}</small>
              )}
            </div>
            <div className={styles.formGroup}>
              <label htmlFor="exportDate" className={styles.formLabel}>
                Ngày Xuất
              </label>
              <DatePicker
                id="exportDate"
                selected={parseDateString(exportDate)}
                onChange={(date) => setExportDate(formatDateToString(date))}
                wrapperClassName={styles.datePickerWrapper}
                className={styles.formInput}
                dateFormat="dd/MM/yyyy"
                autoComplete="off"
              />
            </div>
          </div>
        </div>

        <div className={styles.card}>
          <div className={styles.cardHeader}>Thêm Sản Phẩm</div>
          <div className={styles.cardBody}>
            <label htmlFor="productSearch" className={styles.formLabel}>
              Tìm Sản Phẩm (theo tên hoặc mã)
            </label>
            <Select
              id="productSearch"
              options={productOptions}
              onInputChange={(value) => setProductSearchInput(value)}
              onChange={handleAddProduct}
              placeholder="Gõ để tìm sản phẩm còn hàng..."
              isClearable
              inputValue={productSearchInput}
              noOptionsMessage={() =>
                productSearchInput.length < 2
                  ? "Gõ ít nhất 2 ký tự"
                  : "Không tìm thấy sản phẩm"
              }
              loadingMessage={() => "Đang tìm..."}
              menuPortalTarget={document.body}
              styles={{
                control: (base) =>
                  errors.details && details.length === 0
                    ? { ...base, borderColor: "red" }
                    : base,
                menuPortal: (base) => ({ ...base, zIndex: 9999 }),
              }}
            />
            {errors.details && details.length === 0 && (
              <small className={styles.errorMessage}>{errors.details}</small>
            )}
          </div>
        </div>

        <div className={styles.card}>
          <div className={styles.cardHeader}>Danh Sách Sản Phẩm Xuất</div>
          <div className={styles.tableWrapper}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Sản Phẩm</th>
                  <th>Mã</th>
                  <th>Giá Bán</th>
                  <th>Số Lượng</th>
                  <th>BH (tháng)</th>
                  <th>Ngày Bắt Đầu BH</th>
                  <th>Thành Tiền</th>
                  <th>Xóa</th>
                </tr>
              </thead>
              <tbody>
                {details.length === 0 ? (
                  <tr>
                    <td colSpan="8" className={styles.emptyRow}>
                      Chưa có sản phẩm nào
                    </td>
                  </tr>
                ) : (
                  details.map((item, index) => (
                    <tr key={item.product.BarcodeProduct}>
                      <td data-label="Sản Phẩm">{item.product.ProductName}</td>
                      <td data-label="Mã">{item.product.BarcodeProduct}</td>
                      <td data-label="Giá Bán">
                        {Number(item.product.SalePrice).toLocaleString("vi-VN")}
                        ₫
                      </td>
                      <td data-label="Số Lượng">
                        <input
                          type="number"
                          min="1"
                          max={item.product.NumberOfProduct}
                          value={item.quantity}
                          onChange={(e) =>
                            handleDetailChange(
                              index,
                              "quantity",
                              e.target.value
                            )
                          }
                          className={`${styles.formInput} ${
                            styles.inputSmall
                          } ${
                            errors[`details[${index}].quantity`]
                              ? styles.isInvalid
                              : ""
                          }`}
                        />
                        {errors[`details[${index}].quantity`] && (
                          <small className={styles.errorMessage}>
                            {errors[`details[${index}].quantity`]}
                          </small>
                        )}
                      </td>
                      <td data-label="BH (tháng)">
                        <input
                          type="number"
                          min="0"
                          step="1"
                          placeholder="Số tháng"
                          value={item.warrantyTime ?? ""}
                          onChange={(e) =>
                            handleDetailChange(
                              index,
                              "warrantyTime",
                              e.target.value
                            )
                          }
                          className={`${styles.formInput} ${
                            styles.inputSmall
                          } ${
                            errors[`details[${index}].warrantyTime`]
                              ? styles.isInvalid
                              : ""
                          }`}
                        />
                        {errors[`details[${index}].warrantyTime`] && (
                          <small className={styles.errorMessage}>
                            {errors[`details[${index}].warrantyTime`]}
                          </small>
                        )}
                      </td>
                      <td data-label="Ngày Bắt Đầu BH">
                        <DatePicker
                          selected={parseDateString(item.warrantyStartTime)}
                          onChange={(date) =>
                            handleDetailChange(index, "warrantyStartTime", date)
                          }
                          wrapperClassName={styles.datePickerWrapper}
                          className={`${styles.formInput} ${
                            errors[`details[${index}].warrantyStartTime`]
                              ? styles.isInvalid
                              : ""
                          }`}
                          dateFormat="dd/MM/yyyy"
                          placeholderText="Chọn ngày"
                          autoComplete="off"
                          isClearable
                        />
                        {errors[`details[${index}].warrantyStartTime`] && (
                          <small className={styles.errorMessage}>
                            {errors[`details[${index}].warrantyStartTime`]}
                          </small>
                        )}
                      </td>
                      <td data-label="Thành Tiền">
                        {(
                          (Number(item.product.SalePrice) || 0) *
                          (Number(item.quantity) || 0)
                        ).toLocaleString("vi-VN")}
                        ₫
                      </td>
                      <td data-label="Xóa">
                        <button
                          type="button"
                          className={`${styles.button} ${styles.buttonDangerOutline}`}
                          onClick={() => handleRemoveProduct(index)}
                        >
                          <Trash2 size={16} />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
              {details.length > 0 && (
                <tfoot>
                  <tr className={styles.tableFooter}>
                    <td colSpan="6">Tổng Cộng:</td>
                    <td colSpan="2">
                      {calculateTotal().toLocaleString("vi-VN")}₫
                    </td>
                  </tr>
                </tfoot>
              )}
            </table>
          </div>
        </div>

        <button
          type="submit"
          className={`${styles.button} ${styles.buttonSuccess} ${styles.submitButton}`}
          disabled={
            isLoading ||
            details.length === 0 ||
            !selectedCustomer ||
            Object.keys(errors).length > 0
          }
        >
          {isLoading ? (
            <>
              <span
                className={styles.spinner}
                role="status"
                aria-hidden="true"
              ></span>
              Đang Tạo Phiếu...
            </>
          ) : (
            <>
              <Send size={18} className={styles.buttonIcon} /> Hoàn Thành Phiếu
              Xuất
            </>
          )}
        </button>
      </form>

      <AddCustomerModal
        show={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onCustomerCreated={handleCustomerCreated}
      />
      <EditCustomerModal
        show={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onCustomerUpdated={handleCustomerUpdated}
        customerToEdit={customerForEdit}
      />
    </div>
  );
};

export default ExportCreatePage;

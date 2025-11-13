import React, { useState, useEffect } from "react";
import { uploadImportExcel } from "../../services/importService";
import { getAllSuppliers } from "../../services/supplierService";
import {
  Upload,
  FileText,
  AlertCircle,
  Search,
  Download,
  Users,
} from "lucide-react";
import styles from "./ImportUploadPage.module.css";
import { toast } from "react-toastify";
// Đã đổi tên thành Modal độc lập
import LookupBarcodeModal from "../../components/SupplierProductLookupModal/LookupBarcodeModal";
import LookupSupplierModal from "../../components/SupplierProductLookupModal/LookupSupplierModal";
import { showAlert } from "../../utils/toast";
const getGeneralError = (err) => {
  if (err && err.general) return err.general;
  if (Array.isArray(err) && err.length > 0 && err[0].general)
    return err[0].general;
  return "Đã xảy ra lỗi khi nhập hàng.";
};

const ImportUploadPage = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState("");

  const [isBarcodeLookupOpen, setIsBarcodeLookupOpen] = useState(false);
  const [isSupplierLookupOpen, setIsSupplierLookupOpen] = useState(false);
  const [suppliers, setSuppliers] = useState([]); // Danh sách NCC (để truyền vào modal)

  // Tải danh sách NCC (Dùng cho Modal LookupSupplierModal)
  useEffect(() => {
    const loadSuppliers = async () => {
      try {
        const res = await getAllSuppliers();
        console.log("ressss", res.data);
        const options = (res.data || []).map((s) => ({
          value: s.SupplierID,
          label: `${s.SupplierName} (ID: ${s.SupplierID})`,
          data: s,
        }));
        setSuppliers(options);
      } catch (err) {
        console.error("Failed to load suppliers:", err);
        toast.error("Không thể tải danh sách nhà cung cấp.", {
          autoClose: 3000,
        });
      }
    };
    loadSuppliers();
  }, []);

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
    setError(null);
    setSuccessMessage("");
  };

  const handleUpload = async (event) => {
    event.preventDefault();
    if (!selectedFile) {
      setError({ general: "Vui lòng chọn một file Excel." });
      return;
    }

    setIsLoading(true);
    setError(null);
    setSuccessMessage("");

    const formData = new FormData();
    formData.append("excelFile", selectedFile);

    // Backend sẽ lấy UserID từ Token (Đã sửa lỗi bảo mật)

    try {
      const result = await uploadImportExcel(formData);
      showAlert("Nhập hàng thành công!", "success");
      setSelectedFile(null);
    } catch (err) {
      console.error("Upload failed:", err);

      let displayError = null;
      if (err.errors) {
        displayError = err.errors;
      } else {
        displayError = {
          general: err.message || "Đã xảy ra lỗi khi nhập hàng.",
        };
      }

      setError(displayError);
      toast.error(getGeneralError(displayError), {
        position: "top-right",
        autoClose: 5000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownloadTemplate = () => {
    window.open("/assets/import_template.xlsx", "_blank");
    toast.info("Đang tải file mẫu...", { autoClose: 2000 });
  };

  const renderErrors = () => {
    if (!error) return null;

    if (error.general) {
      return (
        <div className={`${styles.alert} ${styles.alertDanger}`}>
          <AlertCircle size={18} className={styles.iconFix} /> {error.general}
        </div>
      );
    }

    if (Array.isArray(error)) {
      return (
        <div className={`${styles.alert} ${styles.alertDanger}`}>
          <AlertCircle size={18} className={styles.iconFix} />
          <p className={styles.errorTitle}>Lỗi dữ liệu trong file Excel:</p>
          <ul className={styles.errorList}>
            {error.map((errItem, index) => (
              <li key={index} className={styles.errorItem}>
                Dòng {errItem.rowIndex}:
                <ul className={styles.subErrorList}>
                  {Object.entries(errItem.errors).map(([field, msg]) => (
                    <li key={field}>
                      <strong>{field}:</strong> {msg}
                    </li>
                  ))}
                </ul>
              </li>
            ))}
          </ul>
        </div>
      );
    }

    if (typeof error === "object" && error !== null) {
      return (
        <div className={`${styles.alert} ${styles.alertDanger}`}>
          <AlertCircle size={18} className={styles.iconFix} />
          <p className={styles.errorTitle}>Lỗi thông tin đơn hàng:</p>
          <ul className={styles.errorList}>
            {Object.entries(error).map(([field, msg]) => (
              <li key={field}>
                <strong>{field}:</strong> {msg}
              </li>
            ))}
          </ul>
        </div>
      );
    }

    return (
      <div className={`${styles.alert} ${styles.alertDanger}`}>{error}</div>
    );
  };

  return (
    <div className="container" style={{ marginTop: "80px" }}>
      <h3>Tạo Phiếu Nhập Hàng </h3>

      {/* === PHẦN 1: KHU VỰC THAM CHIẾU TÁCH BIỆT (Card mới) === */}
      <div className={`${styles.card} ${styles.lookupCard}`}>
        <div className={styles.cardHeader}>
          <Search size={16} className={styles.iconFix} /> Công cụ Tham Chiếu
        </div>
        <div className={styles.cardBody}>
          <h4 className={styles.referenceTitle}>
            Tra cứu Tham Chiếu (Reference Tools)
          </h4>
          <div className={styles.referenceButtons}>
            {/* NÚT MỚI: Tra cứu NCC */}
            <button
              type="button"
              className={`${styles.button} ${styles.buttonInfo}`}
              onClick={() => setIsSupplierLookupOpen(true)}
            >
              <Users size={18} /> Tra cứu Mã NCC (ID)
            </button>
            {/* NÚT MỚI: Tra cứu Barcode */}
            <button
              type="button"
              className={`${styles.button} ${styles.buttonInfo}`}
              onClick={() => setIsBarcodeLookupOpen(true)}
            >
              <Search size={18} /> Tra cứu Barcode & Tồn kho
            </button>
          </div>
        </div>
      </div>
      {/* === KẾT THÚC PHẦN 1 === */}

      {/* PHẦN 2: KHU VỰC NHẬP FILE (Upload) */}
      <div className={styles.card}>
        <div className={styles.cardHeader}>
          <Upload size={16} className={styles.iconFix} /> Tải File Nhập Hàng
        </div>
        <div className={styles.cardBody}>
          <div className={styles.infoBar}>
            <p className={styles.cardText}>
              Chọn file Excel (.xlsx, .xls, .csv) và nhấn nút Nhập Hàng.
            </p>
            <button
              type="button"
              className={`${styles.button} ${styles.buttonOutline}`}
              onClick={handleDownloadTemplate}
            >
              <Download size={16} className={styles.buttonIcon} /> Tải file mẫu
              để nhập hàng
            </button>
          </div>

          <form onSubmit={handleUpload}>
            <div className={styles.formGroup}>
              <label htmlFor="excelFile" className={styles.formLabel}>
                Chọn File Excel
              </label>
              <input
                type="file"
                className={styles.formFile}
                id="excelFile"
                accept=".xlsx, .xls, .csv"
                onChange={handleFileChange}
                disabled={isLoading}
              />
              {selectedFile && (
                <small className={styles.textMuted}>
                  <FileText size={14} className={styles.iconFix} />{" "}
                  {selectedFile.name}
                </small>
              )}
            </div>

            {renderErrors()}

            <button
              type="submit"
              className={`${styles.button} ${styles.buttonPrimary} ${styles.submitButton}`}
              disabled={isLoading || !selectedFile}
            >
              {isLoading ? (
                <>
                  <span
                    className={styles.spinner}
                    role="status"
                    aria-hidden="true"
                  ></span>
                  Đang xử lý...
                </>
              ) : (
                <>
                  <Upload size={18} className={styles.buttonIcon} /> Nhập Hàng
                </>
              )}
            </button>
          </form>
        </div>
      </div>

      {/* Modal Tra cứu Barcode Sản phẩm */}
      <LookupBarcodeModal
        show={isBarcodeLookupOpen}
        onClose={() => setIsBarcodeLookupOpen(false)}
      />
      {/* Modal Tra cứu Nhà Cung Cấp */}
      <LookupSupplierModal
        show={isSupplierLookupOpen}
        onClose={() => setIsSupplierLookupOpen(false)}
        suppliers={suppliers}
      />
    </div>
  );
};

export default ImportUploadPage;

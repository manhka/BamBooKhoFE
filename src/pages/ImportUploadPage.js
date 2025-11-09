import React, { useState } from "react";
import { uploadImportExcel } from "../services/importService";
import BackButton from "./BackButton"; 
import "bootstrap/dist/css/bootstrap.min.css";
import { Upload, FileText, CheckCircle, AlertCircle } from 'lucide-react';

const ImportUploadPage = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null); // Lưu trữ lỗi chi tiết từ BE
  const [successMessage, setSuccessMessage] = useState("");

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
    setError(null); // Reset lỗi khi chọn file mới
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
    // Lấy UserID từ localStorage (ví dụ)
    // const user = JSON.parse(localStorage.getItem("user"));
    // if (user && user.id) {
    //    formData.append("UserID", user.id); // Gửi UserID cùng file
    // } else {
    //     setError({ general: "Không thể xác định người dùng. Vui lòng đăng nhập lại." });
    //     setIsLoading(false);
    //     return;
    // }
  
    const defaultUserId = 2; // 👈 Gán cứng UserID (ví dụ: ID của staff_kho_1)
    formData.append("UserID", defaultUserId);


    try {
      const result = await uploadImportExcel(formData);
      setSuccessMessage(result.message || "Nhập hàng thành công!");
      setSelectedFile(null); // Reset input file
      // Optionally clear the input visually if needed: event.target.reset();
    } catch (err) {
      console.error("Upload failed:", err);
      // Xử lý lỗi chi tiết từ backend
      if (err.errors) {
         setError(err.errors); // err.errors là object hoặc array từ BE
      } else {
         setError({ general: err.message || "Đã xảy ra lỗi khi nhập hàng." });
      }

    } finally {
      setIsLoading(false);
    }
  };

 // Function để hiển thị lỗi chi tiết
 const renderErrors = () => {
    if (!error) return null;

    if (error.general) {
        return <div className="alert alert-danger mt-3">{error.general}</div>;
    }

    // Nếu lỗi là array (từ validateImportDetails)
    if (Array.isArray(error)) {
        return (
            <div className="alert alert-danger mt-3">
                <p className="fw-bold">Lỗi dữ liệu trong file Excel:</p>
                <ul>
                    {error.map((errItem, index) => (
                        <li key={index}>
                            Dòng {errItem.rowIndex}:
                            <ul>
                                {Object.entries(errItem.errors).map(([field, msg]) => (
                                    <li key={field}><strong>{field}:</strong> {msg}</li>
                                ))}
                            </ul>
                        </li>
                    ))}
                </ul>
            </div>
        );
    }

    // Nếu lỗi là object (từ validateImportOrder hoặc lỗi khác)
     if (typeof error === 'object' && error !== null) {
        return (
             <div className="alert alert-danger mt-3">
                <p className="fw-bold">Lỗi thông tin đơn hàng:</p>
                <ul>
                     {Object.entries(error).map(([field, msg]) => (
                        <li key={field}><strong>{field}:</strong> {msg}</li>
                     ))}
                 </ul>
            </div>
        )
     }

    // Lỗi dạng string chung
    return <div className="alert alert-danger mt-3">{error}</div>;
 };


  return (
    <div className="container mt-5 pt-5">
      <BackButton />
      <h2 className="mb-4">Nhập Hàng từ File Excel</h2>

      <div className="card shadow-sm">
        <div className="card-body">
          <p className="card-text">
            Chọn file Excel (.xlsx, .xls, .csv) chứa thông tin sản phẩm cần nhập.
            <br />
            {/* Thêm link download template nếu có */}
            {/* <a href="/path/to/template.xlsx" download>Tải file mẫu tại đây</a> */}
            File cần có các cột: <strong>BarcodeProduct</strong>, <strong>Quantity</strong>, <strong>UnitPrice</strong>. Cột <strong>SupplierID</strong> cũng cần thiết (có thể điền ở dòng đầu tiên hoặc truyền riêng).
          </p>

          <form onSubmit={handleUpload}>
            <div className="mb-3">
              <label htmlFor="excelFile" className="form-label">Chọn File Excel</label>
              <input
                type="file"
                className="form-control"
                id="excelFile"
                accept=".xlsx, .xls, .csv"
                onChange={handleFileChange}
                disabled={isLoading}
              />
               {selectedFile && <small className="text-muted d-block mt-1"><FileText size={14} className="me-1"/> {selectedFile.name}</small>}
            </div>

            {renderErrors()}

            {successMessage && (
              <div className="alert alert-success mt-3 d-flex align-items-center">
                 <CheckCircle size={20} className="me-2"/> {successMessage}
              </div>
            )}

            <button
              type="submit"
              className="btn btn-primary w-100 mt-3 d-flex align-items-center justify-content-center"
              disabled={isLoading || !selectedFile}
            >
              {isLoading ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                  Đang xử lý...
                </>
              ) : (
                <><Upload size={18} className="me-2"/> Nhập Hàng</>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ImportUploadPage;
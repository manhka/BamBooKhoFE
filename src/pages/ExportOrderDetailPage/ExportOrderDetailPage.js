import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import {
  getExportOrderDetail,
  downloadExportOrderExcel,
} from "../../services/exportService";
import styles from "./ExportOrderDetailPage.module.css";
import {
  Box,
  User,
  Users,
  Calendar,
  Hash,
  DollarSign,
  List,
  ShieldCheck,
  FileDown,
} from "lucide-react";

const ExportOrderDetailPage = () => {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isDownloading, setIsDownloading] = useState(false);

  useEffect(() => {
    const fetchDetail = async () => {
      setLoading(true);
      setError("");
      try {
        const result = await getExportOrderDetail(id);
        setOrder(result.order);
      } catch (err) {
        console.error("Error fetching export detail:", err);
        setError(err.message || "Không thể tải chi tiết đơn hàng.");
      } finally {
        setLoading(false);
      }
    };
    fetchDetail();
  }, [id]);

  const handleDownloadExcel = async () => {
    setIsDownloading(true);
    setError("");
    try {
      const blob = await downloadExportOrderExcel(id);
      const url = window.URL.createObjectURL(new Blob([blob]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `PhieuXuat_${id}.xlsx`);
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Download error:", err);
      setError(err.message || "Tải file Excel thất bại.");
    } finally {
      setIsDownloading(false);
    }
  };

  if (loading)
    return (
      <div className={styles.fullPageLoader}>
        <span className={styles.spinner} role="status"></span> Đang tải chi
        tiết...
      </div>
    );

  if (error && !order)
    return (
      <div className={styles.container}>
        <div className={styles.alert}>{error}</div>
      </div>
    );

  if (!order)
    return (
      <div className={styles.container}>
        <div className={styles.alert}>Không tìm thấy đơn hàng.</div>
      </div>
    );

  return (
    <div className={styles.container}>
      <div className={styles.pageHeader}>
        <h2 className={styles.pageTitle}>
          Chi Tiết Đơn Xuất Hàng #{order.ExportID}
        </h2>
        <button
          className={`${styles.button} ${styles.buttonSuccessOutline}`}
          onClick={handleDownloadExcel}
          disabled={isDownloading}
        >
          {isDownloading ? (
            <span
              className={styles.spinner}
              role="status"
              aria-hidden="true"
            ></span>
          ) : (
            <FileDown size={18} className={styles.buttonIcon} />
          )}
          Xuất Excel
        </button>
      </div>

      {error && <div className={styles.alert}>{error}</div>}

      <div className={styles.card}>
        <div className={styles.cardHeader}>Thông Tin Chung</div>
        <div className={`${styles.cardBody} ${styles.infoGrid}`}>
          <p className={styles.infoItem}>
            <Calendar size={16} /> <strong>Ngày Xuất:</strong>{" "}
            {new Date(order.ExportDate).toLocaleDateString("vi-VN")}
          </p>
          <p className={styles.infoItem}>
            <DollarSign size={16} /> <strong>Tổng Tiền:</strong>{" "}
            {order.Total?.toLocaleString("vi-VN")}₫
          </p>
          <p className={styles.infoItem}>
            <Users size={16} /> <strong>Khách Hàng:</strong>{" "}
            {order.Customer?.CustomerName || "N/A"}
          </p>
          <p className={styles.infoItem}>
            <User size={16} /> <strong>Người Xuất:</strong>{" "}
            {order.User?.Username || "N/A"}
          </p>
          <p className={`${styles.infoItem} ${styles.infoSpanFull}`}>
            <strong>Địa chỉ khách:</strong> {order.Customer?.Address || "N/A"}
          </p>
          <p className={`${styles.infoItem} ${styles.infoSpanFull}`}>
            <strong>SĐT khách:</strong> {order.Customer?.Phone || "N/A"}
          </p>
        </div>
      </div>

      <div className={styles.card}>
        <div className={styles.cardHeader}>
          <List size={16} className={styles.iconFix} /> Chi Tiết Sản Phẩm
        </div>
        <div className={styles.tableWrapper}>
          <table className={styles.table}>
            <thead className={styles.tableHeader}>
              <tr>
                <th>
                  <Hash size={14} /> STT
                </th>
                <th>
                  <Box size={14} /> Sản Phẩm
                </th>
                <th>Mã (Barcode)</th>
                <th>Số Lượng</th>
                <th>Đơn Giá</th>
                <th>
                  <ShieldCheck size={14} /> Bảo Hành
                </th>
                <th>Thành Tiền</th>
              </tr>
            </thead>
            <tbody>
              {order.ExportDetails && order.ExportDetails.length > 0 ? (
                order.ExportDetails.map((detail, index) => (
                  <tr key={detail.ExportDetailID}>
                    <td data-label="STT">{index + 1}</td>
                    <td data-label="Sản Phẩm">
                      {detail.Product?.ProductName || detail.BarcodeProduct}
                    </td>
                    <td data-label="Mã">{detail.BarcodeProduct}</td>
                    <td data-label="Số Lượng">{detail.Quantity}</td>
                    <td data-label="Đơn Giá">
                      {detail.UnitPrice?.toLocaleString("vi-VN")}₫
                    </td>
                    <td data-label="Bảo Hành">
                      {detail.WarrantyTime !== null &&
                      detail.WarrantyTime > 0 ? (
                        <div className={styles.warrantyInfo}>
                          <div>{detail.WarrantyTime} tháng</div>
                          {detail.WarrantyStartTime && (
                            <div>
                              Từ:{" "}
                              {new Date(
                                detail.WarrantyStartTime
                              ).toLocaleDateString("vi-VN")}
                            </div>
                          )}
                          {detail.WarrantyEndTime && (
                            <div>
                              Đến:{" "}
                              {new Date(
                                detail.WarrantyEndTime
                              ).toLocaleDateString("vi-VN")}
                            </div>
                          )}
                          <div>
                            Trạng thái:{" "}
                            <span
                              className={
                                detail.WarrantyStatus
                                  ? styles.statusSuccess
                                  : styles.statusDanger
                              }
                            >
                              {detail.WarrantyStatus ? "Còn hạn" : "Hết hạn"}
                            </span>
                          </div>
                        </div>
                      ) : (
                        <small className={styles.textMuted}>Không BH</small>
                      )}
                    </td>
                    <td data-label="Thành Tiền">
                      {detail.Total?.toLocaleString("vi-VN")}₫
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className={styles.emptyRow}>
                    Không có chi tiết sản phẩm.
                  </td>
                </tr>
              )}
            </tbody>
            <tfoot>
              <tr className={styles.tableFooter}>
                <td colSpan="6">Tổng cộng:</td>
                <td>{order.Total?.toLocaleString("vi-VN")}₫</td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>

      <Link
        to="/export-history"
        className={`${styles.button} ${styles.buttonSecondary} ${styles.backButton}`}
      >
        Quay lại danh sách
      </Link>
    </div>
  );
};

export default ExportOrderDetailPage;

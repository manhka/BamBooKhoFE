import api from "./api";
import { API_ENDPOINTS } from "../constants/api";
import { saveAs } from "file-saver";
import { showAlert } from "../utils/toast";

// Hàm format ngày giờ
const formatDateTime = (dateString) => {
  if (!dateString) return "";
  const date = new Date(dateString);
  const pad = (n) => n.toString().padStart(2, "0");

  const hh = pad(date.getHours());
  const mm = pad(date.getMinutes());
  const ss = pad(date.getSeconds());
  const dd = pad(date.getDate());
  const MM = pad(date.getMonth() + 1);
  const yyyy = date.getFullYear();

  return `${hh}:${mm}:${ss} ${dd}/${MM}/${yyyy}`;
};

// Hàm format tiền VNĐ
const formatCurrency = (value) => {
  if (value == null) return "";
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(value);
};

// Service lấy báo cáo theo quý
export const getQuarterReport = async ({ quarter, year }) => {
  if (!quarter || !year) {
    showAlert("Chọn quý và năm!", "danger");
    return;
  }

  try {
    const res = await api.get(API_ENDPOINTS.REPORTS.QUARTER, {
      params: { quarter, year },
    });

    const allRows = [];

    // Nhập hàng
    res.data.imports?.forEach((imp) => {
      imp.ImportDetails.forEach((d) => {
        allRows.push({
          Type: "Nhập hàng",
          Date: formatDateTime(imp.ImportDate),
          Product: d.Product.ProductName,
          Quantity: d.Quantity,
          UnitPrice: formatCurrency(d.UnitPrice),
          Total: formatCurrency(d.Total),
          Partner: imp.Supplier?.SupplierName,
        });
      });
    });

    // Xuất hàng
    res.data.exports?.forEach((exp) => {
      exp.ExportDetails.forEach((d) => {
        allRows.push({
          Type: "Xuất hàng",
          Date: formatDateTime(exp.ExportDate),
          Product: d.Product.ProductName,
          Quantity: d.Quantity,
          UnitPrice: formatCurrency(d.UnitPrice),
          Total: formatCurrency(d.Total),
          Partner: exp.Customer?.CustomerName,
        });
      });
    });

    return allRows;
  } catch (error) {
    console.error(
      "getQuarterReport error:",
      error.response?.data || error.message
    );
    throw error.response?.data || { message: error.message };
  }
};

export const exportQuarterReport = async ({ quarter, year }) => {
  if (!quarter || !year) {
    showAlert("Chọn quý và năm!", "danger");
    return;
  }

  try {
    const res = await api.get(API_ENDPOINTS.REPORTS.EXPORT_QUARTER, {
      params: { quarter, year },
      responseType: "blob", // quan trọng để nhận file
    });

    // Tạo file và tải về
    const fileName = `BaoCao_Q${quarter}_${year}.xlsx`;
    saveAs(res.data, fileName);
  } catch (error) {
    console.error(
      "exportQuarterReport error:",
      error.response?.data || error.message
    );
    throw error.response?.data || { message: error.message };
  }
};

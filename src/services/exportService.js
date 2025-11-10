// services/exportService.js
import api from "./api";
import { API_ENDPOINTS } from "../constants/api";

/**
 * Function 5.1: Tạo phiếu xuất hàng
 * @param {object} orderData - Dữ liệu đơn hàng (CustomerID, UserID, ExportDate, Details)
 */
export const createExportOrder = async (orderData) => {
  try {
    // const token = localStorage.getItem("token"); // Tạm bỏ qua token
    const response = await api.post(API_ENDPOINTS.EXPORT.CREATE, orderData, {
      // headers: { Authorization: `Bearer ${token}` }, // Tạm bỏ qua header
    });
    return response.data; // { message, exportOrder }
  } catch (error) {
    console.error("Create Export Order error:", error.response?.data || error.message);
    throw error.response?.data || { message: error.message };
  }
};

/**
 * Function 5.2: Lấy lịch sử xuất hàng
 * @param {object} filters - Các tham số lọc (fromDate, toDate, customerId, userId, barcode)
 */
export const getExportHistory = async (filters = {}) => {
  try {
    // const token = localStorage.getItem("token"); // Tạm bỏ qua token
    const params = { ...filters };
    // Xóa các filter rỗng hoặc null
    Object.keys(params).forEach(key => (params[key] == null || params[key] === '') && delete params[key]);

    const response = await api.get(API_ENDPOINTS.EXPORT.LIST, {
      params,
      // headers: { Authorization: `Bearer ${token}` }, // Tạm bỏ qua header
    });
    return response.data; // { message, count, orders }
  } catch (error) {
    console.error("Get Export History error:", error.response?.data || error.message);
    throw error.response?.data || { message: error.message };
  }
};

/**
 * Function 5.2: Lấy chi tiết đơn xuất hàng
 * @param {string|number} id - ID của đơn hàng xuất
 */
export const getExportOrderDetail = async (id) => {
    try {
        // const token = localStorage.getItem("token"); // Tạm bỏ qua token
        const response = await api.get(API_ENDPOINTS.EXPORT.DETAIL(id), {
            // headers: { Authorization: `Bearer ${token}` }, // Tạm bỏ qua header
        });
        return response.data; // { message, order }
    } catch (error) {
        console.error("Get Export Order Detail error:", error.response?.data || error.message);
        throw error.response?.data || { message: error.message };
    }
}

/**
 * Tải file Excel cho một đơn xuất hàng
 * @param {string|number} id - ID của đơn hàng
 */
export const downloadExportOrderExcel = async (id) => {
  try {
    // const token = localStorage.getItem("token"); // Tạm bỏ qua token

    // 👇 ================= SỬA LỖI Ở ĐÂY ================= 👇
    // Thêm một timestamp ngẫu nhiên vào URL để tránh bị cache
    const cacheBust = `?_=${new Date().getTime()}`;
    const url = API_ENDPOINTS.EXPORT.DOWNLOAD_EXCEL(id) + cacheBust;
    // 👆 ================================================== 👆

    const response = await api.get(url, { // 👈 Dùng url mới
      // headers: { Authorization: `Bearer ${token}` }, // Tạm bỏ qua header
      responseType: 'blob', 
    });
    
    return response.data;
    
  } catch (error) {
    console.error("Download Export Excel error:", error.response?.data || error.message);
    try {
        const errDataText = await error.response?.data?.text();
        const parsedError = JSON.parse(errDataText);
        throw parsedError || { message: error.message };
    } catch (parseError) {
         throw { message: error.message || "Failed to download file." };
    }
  }
};
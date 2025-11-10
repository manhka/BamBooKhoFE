import api from "./api"; 
import { API_ENDPOINTS } from "../constants/api"; 

// Function 4.1: Upload file Excel
export const uploadImportExcel = async (formData) => {
  try {
    const token = localStorage.getItem("token"); // Lấy token để xác thực
    const response = await api.post(API_ENDPOINTS.IMPORT.UPLOAD, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${token}`, 
      },
    });
    return response.data; 
  } catch (error) {
    console.error("Upload Import Excel error:", error.response?.data || error.message);
    throw error.response?.data || { message: error.message };
  }
};

// Function 4.2: Lấy lịch sử nhập hàng
export const getImportHistory = async (filters = {}) => {
  try {
    const token = localStorage.getItem("token");
    const params = { ...filters }; // Truyền các filter làm query params

    const response = await api.get(API_ENDPOINTS.IMPORT.LIST, {
      params,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data; // Trả về { message, count, orders }
  } catch (error) {
    console.error("Get Import History error:", error.response?.data || error.message);
    throw error.response?.data || { message: error.message };
  }
};

// Function 4.2: Lấy chi tiết đơn nhập hàng
export const getImportOrderDetail = async (id) => {
    try {
        const token = localStorage.getItem("token");
        const response = await api.get(API_ENDPOINTS.IMPORT.DETAIL(id), { // Giả sử DETAIL(id) trả về /import-orders/${id}
             headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data; // Trả về { message, order }
    } catch (error) {
        console.error("Get Import Order Detail error:", error.response?.data || error.message);
        throw error.response?.data || { message: error.message };
    }
}
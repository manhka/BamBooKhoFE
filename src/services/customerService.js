import api from "./api";
import { API_ENDPOINTS } from "../constants/api";

// Lấy danh sách customer theo keyword
export const searchCustomers = async (keyword) => {
  if (!keyword.trim()) return []; // Nếu rỗng thì không gọi API
  try {
    const response = await api.get(
      `${API_ENDPOINTS.CUSTOMERS.SEARCH_BY_NAME}?keyword=${encodeURIComponent(
        keyword
      )}`
    );
    // API trả về { customers: [...] }
    return response.data || [];
  } catch (error) {
    console.error("Lỗi khi search customer:", error);
    throw error;
  }
};

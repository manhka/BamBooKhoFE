import { api } from "./api";
import { API_ENDPOINTS } from "../constants/api";

/**
 * Lấy danh sách tất cả nhà cung cấp
 */
export const getAllSuppliers = async () => {
  try {
    const token = localStorage.getItem("token");
    const response = await api.get(API_ENDPOINTS.SUPPLIERS.LIST, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error(
      "Get All Suppliers error:",
      error.response?.data || error.message
    );
    throw error.response?.data || { message: error.message };
  }
};

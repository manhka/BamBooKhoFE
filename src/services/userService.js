import api from "./api"; 
import { API_ENDPOINTS } from "../constants/api";

/**
 * Lấy danh sách tất cả người dùng (Có thể cần phân quyền Admin ở Backend)
 */
export const getAllUsers = async () => {
  try {
    const token = localStorage.getItem("token"); 
    const response = await api.get(API_ENDPOINTS.USERS.LIST, {
      headers: {
        Authorization: `Bearer ${token}`, 
      },
     
    });
    return response.data; 
  } catch (error) {
    console.error("Get All Users error:", error.response?.data || error.message);
    throw error.response?.data || { message: error.message };
  }
};

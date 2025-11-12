import { api } from "./api";
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
    console.error(
      "Get All Users error:",
      error.response?.data || error.message
    );
    throw error.response?.data || { message: error.message };
  }
};
export const getEmployeesByRole = async () => {
  try {
    const token = localStorage.getItem("token");
    const res = await api.get(API_ENDPOINTS.USERS.BY_ROLE, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.data;
  } catch (error) {
    console.error(
      "Get Employees By Role error:",
      error.response?.data || error.message
    );
    throw error.response?.data || { message: error.message };
  }
};
export const toggleUserStatus = async (id) => {
  try {
    const token = localStorage.getItem("token");
    const res = await api.put(
      `${API_ENDPOINTS.USERS.TOGGLE}/${id}`,
      {},
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    return res.data;
  } catch (error) {
    console.error(
      "Toggle User Status error:",
      error.response?.data || error.message
    );
    throw error.response?.data || { message: error.message };
  }
};
export const editUser = async (userId, data) => {
  try {
    const token = localStorage.getItem("token");
    const res = await api.put(`${API_ENDPOINTS.USERS.EDIT}/${userId}`, data, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.data;
  } catch (error) {
    console.error("Edit User error:", error.response?.data || error.message);
    throw error.response?.data || { message: error.message };
  }
};

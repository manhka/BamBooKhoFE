import api from "./api";
import { API_ENDPOINTS } from "../constants/api";

/**
 * Lấy danh sách tất cả khách hàng
 */
export const getAllCustomers = async () => {
  try {
    // const token = localStorage.getItem("token"); // Tạm bỏ qua token
    const response = await api.get(API_ENDPOINTS.CUSTOMERS.LIST, {
      // headers: { Authorization: `Bearer ${token}` }, // Tạm bỏ qua header
    });
    // Trả về response.data ( backend trả về {..., data: [...] } )
    return response.data;
  } catch (error) {
    console.error(
      "Get All Customers error:",
      error.response?.data || error.message
    );
    throw error.response?.data || { message: error.message };
  }
};

/**
 * Tạo khách hàng mới
 * @param {object} customerData - { CustomerName, Phone, Address }
 */
export const createCustomer = async (customerData) => {
  try {
    const response = await api.post(
      API_ENDPOINTS.CUSTOMERS.CREATE,
      customerData
    );
    return response.data;
  } catch (error) {
    console.error(
      "Create Customer error:",
      error.response?.data || error.message
    );
    throw error.response?.data || { message: error.message };
  }
};

/**
 * Lấy chi tiết một khách hàng bằng ID
 * @param {string | number} customerId - ID của khách hàng
 */
export const getCustomerById = async (customerId) => {
  try {
    // Thay thế ID trong đường dẫn (ví dụ: /customers/detail/:id)
    const endpoint = API_ENDPOINTS.CUSTOMERS.DETAIL.replace(":id", customerId);
    const response = await api.get(endpoint, {
      // headers: { Authorization: `Bearer ${token}` },
    });
    return response.data; // Trả về { status, message, data: customer }
  } catch (error) {
    console.error(
      "Get Customer By ID error:",
      error.response?.data || error.message
    );
    throw error.response?.data || { message: error.message };
  }
};

/**
 * Cập nhật thông tin khách hàng
 * @param {string | number} customerId - ID của khách hàng cần cập nhật
 * @param {object} customerData - { CustomerName, Phone, Address }
 */
export const updateCustomer = async (customerId, customerData) => {
  try {
    const endpoint = API_ENDPOINTS.CUSTOMERS.UPDATE.replace(":id", customerId);
    const response = await api.put(endpoint, customerData, {
      // headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    console.error(
      "Update Customer error:",
      error.response?.data || error.message
    );
    throw error.response?.data || { message: error.message };
  }
};
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

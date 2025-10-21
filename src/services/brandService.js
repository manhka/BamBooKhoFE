import api from "./api";
import { API_ENDPOINTS } from "../constants/api";

// Lấy toàn bộ thương hiệu
export const getAllBrands = async () => {
  try {
    const response = await api.get(API_ENDPOINTS.BRANDS.LIST);
    return response.data;
  } catch (error) {
    console.error("Lỗi khi lấy thương hiệu:", error);
    throw error;
  }
};

// Lấy thương hiệu theo ID
export const getBrandById = async (id) => {
  try {
    const response = await api.get(API_ENDPOINTS.BRANDS.DETAIL(id));
    return response.data;
  } catch (error) {
    console.error("Lỗi khi lấy thương hiệu theo ID:", error);
    throw error;
  }
};

// Tìm thương hiệu theo tên
export const getBrandByName = async (name) => {
  try {
    const response = await api.get(API_ENDPOINTS.BRANDS.SEARCH_BY_NAME(name));
    return response.data;
  } catch (error) {
    console.error("Lỗi khi tìm thương hiệu theo tên:", error);
    throw error;
  }
};

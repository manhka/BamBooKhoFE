import api from "./api";
import { API_ENDPOINTS } from "../constants/api";

//  Lấy toàn bộ danh mục
export const getAllCategories = async () => {
  try {
    const response = await api.get(API_ENDPOINTS.CATEGORIES.LIST);
    return response.data;
  } catch (error) {
    console.error("Lỗi khi lấy danh mục:", error);
    throw error;
  }
};

//  Lấy danh mục theo ID
export const getCategoryById = async (id) => {
  try {
    const response = await api.get(API_ENDPOINTS.CATEGORIES.DETAIL(id));
    return response.data;
  } catch (error) {
    console.error("Lỗi khi lấy danh mục theo ID:", error);
    throw error;
  }
};

// Tìm danh mục theo tên
export const getCategoryByName = async (name) => {
  try {
    const response = await api.get(
      API_ENDPOINTS.CATEGORIES.SEARCH_BY_NAME(name)
    );
    return response.data;
  } catch (error) {
    console.error("Lỗi khi tìm danh mục theo tên:", error);
    throw error;
  }
};

import { api } from "./api";
import { API_ENDPOINTS } from "../constants/api";

export const getAllCategories = async (archive) => {
  try {
    const url =
      archive !== undefined
        ? `${API_ENDPOINTS.CATEGORIES.LIST}?archive=${archive}`
        : API_ENDPOINTS.CATEGORIES.LIST;
    const response = await api.get(url);
    return response.data;
  } catch (error) {
    console.error("Lỗi khi lấy danh mục:", error);
    throw error;
  }
};

export const getCategoryById = async (id) => {
  try {
    const response = await api.get(API_ENDPOINTS.CATEGORIES.DETAIL(id));
    return response.data;
  } catch (error) {
    console.error("Lỗi khi lấy danh mục theo ID:", error);
    throw error;
  }
};

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

export const createCategory = async (data) => {
  try {
    const response = await api.post(API_ENDPOINTS.CATEGORIES.CREATE, data);
    return response.data;
  } catch (error) {
    console.error("Lỗi khi tạo danh mục:", error);
    throw error;
  }
};

export const updateCategory = async (id, data) => {
  try {
    const response = await api.put(API_ENDPOINTS.CATEGORIES.UPDATE(id), data);
    return response.data;
  } catch (error) {
    console.error("Lỗi khi cập nhật danh mục:", error);
    throw error;
  }
};

export const deleteCategory = async (id) => {
  try {
    const response = await api.delete(API_ENDPOINTS.CATEGORIES.DELETE(id));
    return response.data;
  } catch (error) {
    console.error("Lỗi khi xóa danh mục:", error);
    throw error;
  }
};

export const restoreCategory = async (id) => {
  try {
    const response = await api.put(API_ENDPOINTS.CATEGORIES.RESTORE(id));
    return response.data;
  } catch (error) {
    console.error("Lỗi khi khôi phục danh mục:", error);
    throw error;
  }
};

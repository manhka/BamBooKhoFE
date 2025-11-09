import api from "./api";
import { API_ENDPOINTS } from "../constants/api";

export const getAllBrands = async (archive) => {
  try {
    const url = archive !== undefined 
      ? `${API_ENDPOINTS.BRANDS.LIST}?archive=${archive}`
      : API_ENDPOINTS.BRANDS.LIST;
    const response = await api.get(url);
    return response.data;
  } catch (error) {
    console.error("Lỗi khi lấy thương hiệu:", error);
    throw error;
  }
};

export const getBrandById = async (id) => {
  try {
    const response = await api.get(API_ENDPOINTS.BRANDS.DETAIL(id));
    return response.data;
  } catch (error) {
    console.error("Lỗi khi lấy thương hiệu theo ID:", error);
    throw error;
  }
};

export const getBrandByName = async (name) => {
  try {
    const response = await api.get(API_ENDPOINTS.BRANDS.SEARCH_BY_NAME(name));
    return response.data;
  } catch (error) {
    console.error("Lỗi khi tìm thương hiệu theo tên:", error);
    throw error;
  }
};

export const createBrand = async (data) => {
  try {
    const response = await api.post(API_ENDPOINTS.BRANDS.CREATE, data);
    return response.data;
  } catch (error) {
    console.error("Lỗi khi tạo thương hiệu:", error);
    throw error;
  }
};

export const updateBrand = async (id, data) => {
  try {
    const response = await api.put(API_ENDPOINTS.BRANDS.UPDATE(id), data);
    return response.data;
  } catch (error) {
    console.error("Lỗi khi cập nhật thương hiệu:", error);
    throw error;
  }
};

export const deleteBrand = async (id) => {
  try {
    const response = await api.delete(API_ENDPOINTS.BRANDS.DELETE(id));
    return response.data;
  } catch (error) {
    console.error("Lỗi khi xóa thương hiệu:", error);
    throw error;
  }
};

export const restoreBrand = async (id) => {
  try {
    const response = await api.put(API_ENDPOINTS.BRANDS.RESTORE(id));
    return response.data;
  } catch (error) {
    console.error("Lỗi khi khôi phục thương hiệu:", error);
    throw error;
  }
};

import api from "./api";
import { API_ENDPOINTS } from "../constants/api";

export const getProducts = async (filters = {}) => {
  try {
    const { keyword = "", brand = "", category = "" } = filters;

    const params = {
      keyword,
      brand,
      category,
    };

    const res = await api.get(API_ENDPOINTS.PRODUCTS.LIST, { params });
    return res.data;
  } catch (error) {
    console.error("getProducts error:", error.response?.data || error.message);
    throw error.response?.data || { message: error.message };
  }
};

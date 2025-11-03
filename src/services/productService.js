import api from "./api";
import { API_ENDPOINTS } from "../constants/api";

export const getProducts = async (filters = {}) => {
  try {
    const { keyword = "", BrandID = "", CategoryID = "" } = filters;

    const params = {};
    if (keyword) params.keyword = keyword;

    if (BrandID) params.BrandID = BrandID;
    if (CategoryID) params.CategoryID = CategoryID;

    const res = await api.get(API_ENDPOINTS.PRODUCTS.LIST, { params });
    return res.data;
  } catch (error) {
    console.error("getProducts error:", error.response?.data || error.message);
    throw error.response?.data || { message: error.message };
  }
};
export const createProduct = async (productData) => {
  try {
    const res = await api.post(API_ENDPOINTS.PRODUCTS.CREATE, productData);
    return res.data;
  } catch (error) {
    console.error(
      "createProduct error:",
      error.response?.data || error.message
    );
    throw error.response?.data || { message: error.message };
  }
};

export const getProductByBarcode = async (barcode) => {
  try {
    const res = await api.get(API_ENDPOINTS.PRODUCTS.DETAIL(barcode));
    return res.data;
  } catch (error) {
    console.error(
      "getProductByBarcode error:",
      error.response?.data || error.message
    );
    throw error.response?.data || { message: error.message };
  }
};
export const updateProduct = async (barcode, productData) => {
  try {
    const res = await api.put(
      API_ENDPOINTS.PRODUCTS.UPDATE(barcode),
      productData
    );
    return res.data;
  } catch (error) {
    console.error(
      "updateProduct error:",
      error.response?.data || error.message
    );
    throw error.response?.data || { message: error.message };
  }
};
export const archiveProduct = async (barcode, archive = true) => {
  try {
    const res = await api.patch(
      API_ENDPOINTS.PRODUCTS.ARCHIVE(barcode),
      {},
      {
        params: { archive },
      }
    );
    return res.data;
  } catch (error) {
    console.error(
      "archiveProduct error:",
      error.response?.data || error.message
    );
    throw error.response?.data || { message: error.message };
  }
};

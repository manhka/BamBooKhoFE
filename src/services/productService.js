import { api } from "./api";
import { API_ENDPOINTS } from "../constants/api";

export const getProducts = async (filters = {}) => {
  try {
    const { keyword = "", BrandID = "", CategoryID = "" } = filters;

    const params = {};
    if (keyword) params.keyword = keyword;

    if (BrandID) params.BrandID = BrandID;
    if (CategoryID) params.CategoryID = CategoryID;

    const res = await api.get(API_ENDPOINTS.PRODUCTS.LIST, { params });
    console.log("daa:", res.data);
    return res.data;
  } catch (error) {
    console.error("getProducts error:", error.response?.data || error.message);
    throw error.response?.data || { message: error.message };
  }
};

export const getProductsForLookup = async () => {
  try {
    const endpoint = API_ENDPOINTS.PRODUCTS.ALL_FOR_LOOKUP;
    const response = await api.get(endpoint);
    return response.data;
  } catch (error) {
    console.error(
      "Get Products For Lookup error:",
      error.response?.data || error.message
    );
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
export const numberLowProductWarning = async () => {
  try {
    const res = await api.get(API_ENDPOINTS.PRODUCTS.NUMBER_LOW_STOCK_WARNING);
    console.log("count:", res.data.count);

    return res.data.count;
  } catch (error) {
    console.error(
      "get numberLowProductWarning error:",
      error.response?.data || error.message
    );
    throw error.response?.data || { message: error.message };
  }
};
export const getNumberProduct = async () => {
  try {
    const res = await api.get(API_ENDPOINTS.PRODUCTS.TOTAL_PRODUCT_COUNT);
    return res.data.totalProducts;
  } catch (error) {
    console.error(
      "get numberProduct error:",
      error.response?.data || error.message
    );
    throw error.response?.data || { message: error.message };
  }
};
export const getListStockWarningProducts = async (filters = {}) => {
  try {
    const { keyword = "", BrandID = "", CategoryID = "" } = filters;

    const params = {};
    if (keyword) params.keyword = keyword;

    if (BrandID) params.BrandID = BrandID;
    if (CategoryID) params.CategoryID = CategoryID;

    const res = await api.get(API_ENDPOINTS.PRODUCTS.LIST_LOW_STOCK_WARNING, {
      params,
    });
    return res.data;
  } catch (error) {
    console.error("getProducts error:", error.response?.data || error.message);
    throw error.response?.data || { message: error.message };
  }
};

export const getMonthlyRevenue = async () => {
  try {
    const res = await api.get(API_ENDPOINTS.PRODUCTS.MONTHLY_REVENUE);
    return res.data.totalRevenue;
  } catch (error) {
    console.error(
      "get MonthlyRevenue error:",
      error.response?.data || error.message
    );
    throw error.response?.data || { message: error.message };
  }
};

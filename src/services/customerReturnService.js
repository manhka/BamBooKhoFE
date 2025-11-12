import { api } from "./api"; // axios instance
import { API_ENDPOINTS } from "../constants/api";

// Lấy danh sách sản phẩm bảo hành theo filter
export const getWarrantyProducts = async ({
  customerId,
  barcodeProduct,
  warrantyStart,
  warrantyEnd,
}) => {
  try {
    const response = await api.get(API_ENDPOINTS.CUSTOMER_RETURN.WARRANTY, {
      params: {
        customerId,
        barcodeProduct,
        warrantyStart,
        warrantyEnd,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Lỗi khi fetch warranty products:", error);
    throw error;
  }
};
export const getWarrantyProductById = async (exportDetailId) => {
  try {
    const res = await api.get(
      API_ENDPOINTS.CUSTOMER_RETURN.WARRANTY_BY_ID(exportDetailId)
    );
    return res.data;
  } catch (err) {
    console.error("Error fetching warranty product by ID:", err);
    throw err;
  }
};

// Tạo đơn trả hàng (FE gọi API POST)
export const createCustomerReturn = async (payload) => {
  try {
    const res = await api.post(API_ENDPOINTS.CUSTOMER_RETURN.CREATE, payload);
    return res.data;
  } catch (err) {
    console.error("Error creating customer return:", err);
    throw err;
  }
};

//  Lấy danh sách tất cả đơn trả hàng
export const getCustomerReturnOrders = async () => {
  try {
    const res = await api.get(API_ENDPOINTS.CUSTOMER_RETURN.LIST);
    return res.data;
  } catch (err) {
    console.error("Error fetching customer return orders:", err);
    throw err;
  }
};

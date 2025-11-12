import { api } from "./api";
import { API_ENDPOINTS } from "../constants/api";

export const getImportExportData = async (year) => {
  try {
    const response = await api.get(API_ENDPOINTS.CHART.IMPORT_EXPORT(year));
    console.log("rrrrr:", response.data);
    return response.data;
  } catch (error) {
    console.error("Lỗi khi lấy dữ liệu biểu đồ nhập xuất:", error);
    throw error;
  }
};

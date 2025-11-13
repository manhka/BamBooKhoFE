// services/activityService.js
import { api } from "./api";
import { API_ENDPOINTS } from "../constants/api";

// Lấy tất cả hoạt động
export const getAllActivities = async () => {
  try {
    const res = await api.get(API_ENDPOINTS.ACTIVITIES.VIEW_ALL);
    return res.data;
  } catch (error) {
    console.error(
      "Get All Activities error:",
      error.response?.data || error.message
    );
    throw error.response?.data || { message: error.message };
  }
};

// Lấy hoạt động theo nhân viên
export const getActivitiesByStaff = async (userId) => {
  try {
    const res = await api.get(`${API_ENDPOINTS.ACTIVITIES.BY_STAFF}/${userId}`);
    return res.data;
  } catch (error) {
    console.error(
      "Get Activities By Staff error:",
      error.response?.data || error.message
    );
    throw error.response?.data || { message: error.message };
  }
};

// Tạo hoạt động mới
export const createActivity = async (data) => {
  try {
    const res = await api.post(API_ENDPOINTS.ACTIVITIES.CREATE, data);
    return res.data;
  } catch (error) {
    console.error(
      "Create Activity error:",
      error.response?.data || error.message
    );
    throw error.response?.data || { message: error.message };
  }
};

// Cập nhật hoạt động
export const updateActivity = async (activityId, data) => {
  try {
    const res = await api.put(
      `${API_ENDPOINTS.ACTIVITIES.UPDATE}/${activityId}`,
      data
    );
    return res.data;
  } catch (error) {
    console.error(
      "Update Activity error:",
      error.response?.data || error.message
    );
    throw error.response?.data || { message: error.message };
  }
};

// Gán hoạt động cho nhân viên
export const assignActivitiesToStaff = async (userId, activityIds) => {
  try {
    const res = await api.post(API_ENDPOINTS.ACTIVITIES.ASSIGN, {
      UserID: userId,
      ActivityID: activityIds,
    });
    return res.data;
  } catch (error) {
    console.error(
      "Assign Activities error:",
      error.response?.data || error.message
    );
    throw error.response?.data || { message: error.message };
  }
};

// Xóa hoạt động của nhân viên
export const removeStaffActivity = async (staffActivityId) => {
  try {
    const res = await api.delete(
      `${API_ENDPOINTS.ACTIVITIES.BY_STAFF}/${staffActivityId}`
    );
    return res.data;
  } catch (error) {
    console.error(
      "Remove Staff Activity error:",
      error.response?.data || error.message
    );
    throw error.response?.data || { message: error.message };
  }
};

import api from "./api";
import { API_ENDPOINTS } from "../constants/api";

export const getActivitiesByStaff = async (userId) => {
  try {
    const token = localStorage.getItem("token");
    const res = await api.get(
      `${API_ENDPOINTS.ACTIVITIES.BY_STAFF}/${userId}`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    return res.data;
  } catch (error) {
    console.error(
      "Get Activities By Staff error:",
      error.response?.data || error.message
    );
    throw error.response?.data || { message: error.message };
  }
};
export const getAllActivities = async () => {
  try {
    const token = localStorage.getItem("token");
    const res = await api.get(API_ENDPOINTS.ACTIVITIES.VIEW_ALL, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.data;
  } catch (error) {
    console.error(
      "Get All Activities error:",
      error.response?.data || error.message
    );
    throw error.response?.data || { message: error.message };
  }
};
export const assignActivitiesToStaff = async (userId, activityIds) => {
  try {
    const token = localStorage.getItem("token");
    const res = await api.post(
      API_ENDPOINTS.ACTIVITIES.ASSIGN,
      {
        UserID: userId,
        ActivityID: activityIds,
      },
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    return res.data;
  } catch (error) {
    console.error(
      "Assign Activities error:",
      error.response?.data || error.message
    );
    throw error.response?.data || { message: error.message };
  }
};
export const removeStaffActivity = async (staffActivityId) => {
  try {
    const token = localStorage.getItem("token");
    const res = await api.delete(
      `${API_ENDPOINTS.ACTIVITIES.BY_STAFF}/${staffActivityId}`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
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

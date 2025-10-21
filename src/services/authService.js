import axios from "axios";

import { API_BASE_URL, API_ENDPOINTS } from "../constants/api";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: { "Content-Type": "application/json" },
});

export const login = async (username, password) => {
  try {
    const res = await api.post(API_ENDPOINTS.AUTH.LOGIN, {
      username,
      password,
    });
    return res.data;
  } catch (error) {
    console.error("Login error:", error.response?.data || error.message);
    throw error.response?.data || { message: error.message };
  }
};

export const register = async (
  username,
  password,
  phone,
  roleId = 1,
  token
) => {
  try {
    const res = await api.post(
      API_ENDPOINTS.AUTH.REGISTER,
      { username, password, phone, roleId },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    return res.data;
  } catch (error) {
    console.error("Axios register error:", error.response || error.message);
    throw error;
  }
};

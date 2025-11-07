import axios from "axios";

const API_URL = "http://localhost:3001/api/auth";

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
  roleId = 2,
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

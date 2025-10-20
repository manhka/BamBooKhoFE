import axios from "axios";

const API_URL = "http://localhost:3001/api/auth";

export const login = async (username, password) => {
  const res = await axios.post(`${API_URL}/login`, { username, password });
  return res.data;
};

export const register = async (
  username,
  password,
  phone,
  roleId = 1,
  token
) => {
  try {
    const res = await axios.post(
      `${API_URL}/register`,
      { username, password, phone, roleId },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );
    return res.data;
  } catch (error) {
    console.error("❌ Axios register error:", error.response || error.message);
    throw error;
  }
};

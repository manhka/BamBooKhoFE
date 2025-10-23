export const API_BASE_URL = "http://localhost:3000/api";

export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: "/auth/login",
    REGISTER: "/auth/register",
  },
  PRODUCTS: {
    LIST: "/products",
    DETAIL: (barcode) => `/products/details/${barcode}`,
    CREATE: "/products/create",
    UPDATE: (barcode) => `/products/update/${barcode}`,
    ARCHIVE: (barcode) => `/products/archive/${barcode}`,
  },
  CATEGORIES: {
    LIST: "/categories",
    DETAIL: (id) => `/categories/${id}`,
    SEARCH_BY_NAME: (name) =>
      `/categories/search/by-name?name=${encodeURIComponent(name)}`,
  },

  BRANDS: {
    LIST: "/brands",
    DETAIL: (id) => `/brands/${id}`,
    SEARCH_BY_NAME: (name) =>
      `/brands/search/by-name?name=${encodeURIComponent(name)}`,
  },
};

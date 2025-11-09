export const API_BASE_URL = "http://localhost:3000/api";

export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: "/auth/login",
    REGISTER: "/auth/register",
  },
  PRODUCTS: {
    LIST: "/products",
    DETAIL: (barcode) => `/products/details/${barcode}`,
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

  IMPORT: {
    UPLOAD: "/import-orders/upload",
    LIST: "/import-orders",
    DETAIL: (id) => `/import-orders/${id}`,
  },

  SUPPLIERS: {
    LIST: "/suppliers",
    
  },

  USERS: {
    LIST: "/users", 
  },

  EXPORT: {
    CREATE: "/export-orders",       
    LIST: "/export-orders",       
    DETAIL: (id) => `/export-orders/${id}`, 
    DOWNLOAD_EXCEL: (id) => `/export-orders/${id}/excel`,
  },

  CUSTOMERS: {
    LIST: "/customers", 
    CREATE: "/customers",
    DETAIL: '/customers/detail/:id', 
    UPDATE: '/customers/update/:id',
  }

}
export const API_BASE_URL = "http://localhost:3000/api";

export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: "/auth/login",
    REGISTER: "/auth/register",
  },
  PRODUCTS: {
    LIST: "/products",
    DETAIL: (barcode) => `/products/details/${barcode}`,
    ALL_FOR_LOOKUP: "/products/all-for-lookup",
    CREATE: "/products/create",
    UPDATE: (barcode) => `/products/update/${barcode}`,
    ARCHIVE: (barcode) => `/products/archive/${barcode}`,
    LIST_LOW_STOCK_WARNING: `/products/stock/list-warning`,
    NUMBER_LOW_STOCK_WARNING: `/products/stock/number-warning`,
    MONTHLY_REVENUE: `/products/monthly-revenue`,
    TOTAL_PRODUCT_COUNT: `/products/stock/number-product`,
  },
  CATEGORIES: {
    LIST: "/categories",
    DETAIL: (id) => `/categories/${id}`,
    SEARCH_BY_NAME: (name) =>
      `/categories/search/by-name?name=${encodeURIComponent(name)}`,
    CREATE: "/categories",
    UPDATE: (id) => `/categories/${id}`,
    DELETE: (id) => `/categories/${id}`,
    RESTORE: (id) => `/categories/${id}/restore`,
  },

  BRANDS: {
    LIST: "/brands",
    DETAIL: (id) => `/brands/${id}`,
    SEARCH_BY_NAME: (name) =>
      `/brands/search/by-name?name=${encodeURIComponent(name)}`,
    CREATE: "/brands",
    UPDATE: (id) => `/brands/${id}`,
    DELETE: (id) => `/brands/${id}`,
    RESTORE: (id) => `/brands/${id}/restore`,
  },
  CUSTOMER_RETURN: {
    WARRANTY: "/customer-return/warranty",
    WARRANTY_BY_ID: (exportDetailId) =>
      `/customer-return/warranty/${exportDetailId}`,
    CREATE: "/customer-return/create",
    LIST: "/customer-return/list",
    DETAIL: (id) => `/customer-return/detail/${id}`,
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
    DETAIL: "/customers/detail/:id",
    UPDATE: "/customers/update/:id",
    SEARCH_BY_NAME: "/customers/search",
  },

  REPORTS: {
    QUARTER: "/report/quarter",
    EXPORT_QUARTERLY: "/report/export-quarter",
    EXPORT_QUARTER: "/report/export-quarter",
  },
};

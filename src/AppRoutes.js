import React from "react";
import { Routes, Route } from "react-router-dom";
import AppLayout from "./layouts/AppLayout"; 
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import Dashboard from "./pages/Dashboard";
import Report from "./pages/Report";
import Activity from "./pages/ActivityList";
import StaffList from "./pages/staffList";
import ProductList from "./pages/ProductList";
import ImportUploadPage from "./pages/ImportUploadPage/ImportUploadPage";
import ImportHistoryPage from "./pages/ImportHistoryPage/ImportHistoryPage";
import ExportCreatePage from "./pages/ExportCreatePage/ExportCreatePage";
import ExportHistoryPage from "./pages/ExportHistoryPage/ExportHistoryPage";
import ExportOrderDetailPage from "./pages/ExportOrderDetailPage/ExportOrderDetailPage";
import CategoryList from "./pages/CategoryList";
import CategoryAdd from "./pages/CategoryAdd";
import CategoryEdit from "./pages/CategoryEdit";
import BrandList from "./pages/BrandList";
import BrandAdd from "./pages/BrandAdd";
import BrandEdit from "./pages/BrandEdit";
import AddProduct from "./pages/AddProduct";
import UpdateProduct from "./pages/UpdateProduct";
import ProductDetail from "./pages/ProductDetail";
import CustomerRechange from "./pages/CustomerRechange";
import ProductWarrantyCheck from "./pages/ProductWarrantyCheck";
import CustomerReturn from "./pages/CustomerReturn";
import CustomerReturnList from "./pages/CustomerReturnList";

const AppRoutes = () => (
  <Routes>
    <Route path="/" element={<LoginPage />} />{" "}
    <Route path="*" element={<LoginPage />} />{" "}
    <Route path="/" element={<AppLayout />}>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="*" element={<LoginPage />} />
      <Route path="dashboard" element={<Dashboard />} />
      <Route path="product-list" element={<ProductList />} />
      <Route path="import-upload" element={<ImportUploadPage />} />
      <Route path="import-history" element={<ImportHistoryPage />} />
      <Route path="export-create" element={<ExportCreatePage />} />
      <Route path="export-history" element={<ExportHistoryPage />} />
      <Route path="export-detail/:id" element={<ExportOrderDetailPage />} />
      <Route path="categories" element={<CategoryList />} />
      <Route path="categories/add" element={<CategoryAdd />} />
      <Route path="categories/edit/:id" element={<CategoryEdit />} />
      <Route path="brands" element={<BrandList />} />
      <Route path="brands/add" element={<BrandAdd />} />
      <Route path="brands/edit/:id" element={<BrandEdit />} />
      <Route path="products/list" element={<ProductList />} />
      <Route path="products/add" element={<AddProduct />} />
      <Route path="products/update/:barcode" element={<UpdateProduct />} />
      <Route path="products/details/:barcode" element={<ProductDetail />} />
      <Route path="customer-return/list" element={<CustomerReturnList />} />
      <Route path="customer-return/:exportDetailId"
        element={<CustomerReturn />}
      <Route path="/report" element={<Report />} />
      <Route path="/staffList" element={<StaffList />} />
      <Route path="/activityList" element={<Activity />} />
      />
      <Route
        path="products/customer-rechange"
        element={<ProductWarrantyCheck />}
      />
    </Route>
  </Routes>
);

export default AppRoutes;
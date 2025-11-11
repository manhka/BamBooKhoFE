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
import LowStockProductList from "./pages/LowStockProductList";
import CategoryList from "./pages/CategoryList";
import CategoryAdd from "./pages/CategoryAdd";
import CategoryEdit from "./pages/CategoryEdit";
import BrandList from "./pages/BrandList";
import BrandAdd from "./pages/BrandAdd";
import BrandEdit from "./pages/BrandEdit";
import AddProduct from "./pages/AddProduct";
import UpdateProduct from "./pages/UpdateProduct";
import ProductDetail from "./pages/ProductDetail";
import ProductWarrantyCheck from "./pages/ProductWarrantyCheck";
import CustomerReturn from "./pages/CustomerReturn";
import StaffDashboard from "./pages/StaffDashboard";
import CustomerReturnList from "./pages/CustomerReturnList";
import Error400 from "./pages/ERROR/Error400";
import Error401 from "./pages/ERROR/Error401";
import Error403 from "./pages/ERROR/Error403";
import Error500 from "./pages/ERROR/Error500";
import Error404 from "./pages/ERROR/Error404";
import ProtectedRoute from "./components/ProtectedRoute ";
const AppRoutes = () => (
  <Routes>
    <Route path="/" element={<LoginPage />} />
    <Route path="/login" element={<LoginPage />} />
    <Route path="/error/400" element={<Error400 />} />
    <Route path="/error/401" element={<Error401 />} />
    <Route path="/error/403" element={<Error403 />} />
    <Route path="/error/404" element={<Error404 />} />
    <Route path="*" element={<Error404 />} />
    <Route path="/error/500" element={<Error500 />} />
    <Route path="/" element={<AppLayout />}>
      <Route
        path="/register"
        element={
          <ProtectedRoute requiredRole={1}>
            <RegisterPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/dashboard"
        element={
          <ProtectedRoute requiredRole={1}>
            <Dashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/staff/dashboard"
        element={
          <ProtectedRoute requiredRole={2}>
            <StaffDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/product-list"
        element={
          <ProtectedRoute requiredRole={2}>
            <ProductList />
          </ProtectedRoute>
        }
      />
      <Route
        path="/categories"
        element={
          <ProtectedRoute requiredRole={2}>
            <CategoryList />
          </ProtectedRoute>
        }
      />
      <Route
        path="/categories/add"
        element={
          <ProtectedRoute requiredRole={2}>
            <CategoryAdd />
          </ProtectedRoute>
        }
      />
      <Route
        path="/categories/edit/:id"
        element={
          <ProtectedRoute requiredRole={2}>
            <CategoryEdit />
          </ProtectedRoute>
        }
      />
      <Route
        path="/brands"
        element={
          <ProtectedRoute requiredRole={2}>
            <BrandList />
          </ProtectedRoute>
        }
      />
      <Route
        path="/brands/add"
        element={
          <ProtectedRoute requiredRole={2}>
            <BrandAdd />
          </ProtectedRoute>
        }
      />
      <Route
        path="/brands/edit/:id"
        element={
          <ProtectedRoute requiredRole={2}>
            <BrandEdit />
          </ProtectedRoute>
        }
      />
      <Route
        path="/products/list"
        element={
          <ProtectedRoute requiredRole={2}>
            <ProductList />
          </ProtectedRoute>
        }
      />
      <Route
        path="/products/stock/list-warning"
        element={
          <ProtectedRoute requiredRole={2}>
            <LowStockProductList />
          </ProtectedRoute>
        }
      />
      <Route
        path="/products/add"
        element={
          <ProtectedRoute requiredRole={2}>
            <AddProduct />
          </ProtectedRoute>
        }
      />
      <Route
        path="/products/update/:barcode"
        element={
          <ProtectedRoute requiredRole={2}>
            <UpdateProduct />
          </ProtectedRoute>
        }
      />
      <Route
        path="/products/details/:barcode"
        element={
          <ProtectedRoute requiredRole={2}>
            <ProductDetail />
          </ProtectedRoute>
        }
      />
      <Route
        path="/customer-return/list"
        element={
          <ProtectedRoute requiredRole={2}>
            <CustomerReturnList />
          </ProtectedRoute>
        }
      />
      <Route
        path="customer-return/:exportDetailId"
        element={
          <ProtectedRoute requiredRole={2}>
            <CustomerReturn />
          </ProtectedRoute>
        }
      />
      <Route
        path="/report"
        element={
          <ProtectedRoute requiredRole={1}>
            <Report />
          </ProtectedRoute>
        }
      />
      <Route
        path="/staffList"
        element={
          <ProtectedRoute requiredRole={1}>
            <StaffList />
          </ProtectedRoute>
        }
      />
      <Route
        path="/activities"
        element={
          <ProtectedRoute requiredRole={1}>
            <Activity />
          </ProtectedRoute>
        }
      />
      <Route
        path="/import"
        element={
          <ProtectedRoute requiredRole={2}>
            <ImportUploadPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/import-history"
        element={
          <ProtectedRoute requiredRole={2}>
            <ImportHistoryPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/export"
        element={
          <ProtectedRoute requiredRole={2}>
            <ExportCreatePage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/export-history"
        element={
          <ProtectedRoute requiredRole={2}>
            <ExportHistoryPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/export-detail/:id"
        element={
          <ProtectedRoute requiredRole={2}>
            <ExportOrderDetailPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/products/customer-rechange"
        element={
          <ProtectedRoute requiredRole={2}>
            <ProductWarrantyCheck />
          </ProtectedRoute>
        }
      />
    </Route>
  </Routes>
);

export default AppRoutes;

import React from "react";
import { Routes, Route } from "react-router-dom";
import AppLayout from "./layouts/AppLayout";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import Dashboard from "./pages/Dashboard";
import ProductList from "./pages/ProductList";
import ImportUploadPage from "./pages/ImportUploadPage";
import ImportHistoryPage from "./pages/ImportHistoryPage";
import ExportCreatePage from "./pages/ExportCreatePage/ExportCreatePage";
import ExportHistoryPage from "./pages/ExportHistoryPage/ExportHistoryPage";
import ExportOrderDetailPage from "./pages/ExportOrderDetailPage/ExportOrderDetailPage";

const AppRoutes = () => (
  <Routes>
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
    </Route>
  </Routes>
);

export default AppRoutes;

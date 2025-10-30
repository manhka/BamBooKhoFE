import React from "react";
import { Routes, Route } from "react-router-dom";
import AppLayout from "./layouts/AppLayout";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import Dashboard from "./pages/Dashboard";
import ProductList from "./pages/ProductList";
import AddProduct from "./pages/AddProduct";
import UpdateProduct from "./pages/UpdateProduct";
import ProductDetail from "./pages/ProductDetail";
import CustomerRechange from "./pages/CustomerRechange";
import ProductWarrantyCheck from "./pages/ProductWarrantyCheck";
import CustomerReturn from "./pages/CustomerReturn";
import CustomerReturnList from "./pages/CustomerReturnList";

const AppRoutes = () => (
  <Routes>
    <Route path="/" element={<AppLayout />}>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="*" element={<LoginPage />} />
      <Route path="dashboard" element={<Dashboard />} />
      <Route path="products/list" element={<ProductList />} />
      <Route path="products/add" element={<AddProduct />} />
      <Route path="products/update/:barcode" element={<UpdateProduct />} />
      <Route path="products/details/:barcode" element={<ProductDetail />} />
      <Route path="customer-return/list" element={<CustomerReturnList />} />

      <Route
        path="customer-return/:exportDetailId"
        element={<CustomerReturn />}
      />

      <Route
        path="products/customer-rechange"
        element={<ProductWarrantyCheck />}
      />
    </Route>
  </Routes>
);

export default AppRoutes;

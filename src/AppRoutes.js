import React from "react";
import { Routes, Route } from "react-router-dom";
import AppLayout from "./layouts/AppLayout";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import Dashboard from "./pages/Dashboard";
import ProductList from "./pages/ProductList";

const AppRoutes = () => (
  <Routes>
    <Route path="/" element={<AppLayout />}>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="*" element={<LoginPage />} />
      <Route path="dashboard" element={<Dashboard />} />
      <Route path="product-list" element={<ProductList />} />
    </Route>
  </Routes>
);

export default AppRoutes;

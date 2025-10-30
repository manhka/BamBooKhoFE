import React from "react";
import { Routes, Route } from "react-router-dom";
import AppLayout from "./layouts/AppLayout";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import Dashboard from "./pages/Dashboard";
import ProductList from "./pages/ProductList";
import CategoryList from "./pages/CategoryList";
import CategoryAdd from "./pages/CategoryAdd";
import CategoryEdit from "./pages/CategoryEdit";
import BrandList from "./pages/BrandList";
import BrandAdd from "./pages/BrandAdd";
import BrandEdit from "./pages/BrandEdit";

const AppRoutes = () => (
  <Routes>
    <Route path="/" element={<AppLayout />}>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="*" element={<LoginPage />} />
      <Route path="dashboard" element={<Dashboard />} />
      <Route path="product-list" element={<ProductList />} />
      <Route path="categories" element={<CategoryList />} />
      <Route path="categories/add" element={<CategoryAdd />} />
      <Route path="categories/edit/:id" element={<CategoryEdit />} />
      <Route path="brands" element={<BrandList />} />
      <Route path="brands/add" element={<BrandAdd />} />
      <Route path="brands/edit/:id" element={<BrandEdit />} />
    </Route>
  </Routes>
);

export default AppRoutes;

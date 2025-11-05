import React from "react";
import { Routes, Route } from "react-router-dom";
import AppLayout from "./layouts/AppLayout"; 
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import Dashboard from "./pages/Dashboard";
import Report from "./pages/Report";
import Activity from "./pages/ActivityList";
import StaffList from "./pages/staffList";
const AppRoutes = () => (
  <Routes>
    <Route path="/" element={<LoginPage />} />
    <Route path="/login" element={<LoginPage />} />
    <Route element={<AppLayout />}>
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/report" element={<Report />} />
      <Route path="/staffList" element={<StaffList />} />
      <Route path="/activityList" element={<Activity />} />
    </Route>
    <Route path="*" element={<LoginPage />} />
  </Routes>
);

export default AppRoutes;
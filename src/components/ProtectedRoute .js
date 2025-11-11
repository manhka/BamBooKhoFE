import React from "react";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children, requiredRole }) => {
  const token = localStorage.getItem("token");
  const userData = localStorage.getItem("user");

  if (!token || !userData) {
    return <Navigate to="/error/401" replace />;
  }

  let user;
  try {
    user = JSON.parse(userData);
  } catch (error) {
    console.error("Invalid user data in localStorage:", error);
    return <Navigate to="/error/500" replace />;
  }

  const roleID = Number(user?.roleID);

  if (requiredRole) {
    if (Array.isArray(requiredRole)) {
      if (!requiredRole.includes(roleID)) {
        return <Navigate to="/error/403" replace />;
      }
    } else {
      if (roleID !== requiredRole) {
        return <Navigate to="/error/403" replace />;
      }
    }
  }

  return children;
};

export default ProtectedRoute;

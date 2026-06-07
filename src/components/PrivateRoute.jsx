import React from "react";
import { Navigate } from "react-router-dom";

const PrivateRoute = ({ children, allowedRoles }) => {
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  if (!token) return <Navigate to="/login" replace />;

  if (allowedRoles && !allowedRoles.includes(user?.role)) {
    // Redirect to their own dashboard if they try to access another role's page
    if (user?.role === "admin") return <Navigate to="/admin_dashboard" replace />;
    if (user?.role === "tutor") return <Navigate to="/tutor_dashboard" replace />;
    return <Navigate to="/student_dashboard" replace />;
  }

  return children;
};

export default PrivateRoute;

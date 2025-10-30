import React from "react";
import { Navigate } from "react-router-dom";
import { useAuthContext } from "../Context/AuthContext";

const ProtectedRoute = ({ children }) => {
  const { user, authReady } = useAuthContext();

  if (!authReady) return <div>Loading...</div>;
  if (!user) return <Navigate to="/signup" replace />;

  return children;
};

export default ProtectedRoute;

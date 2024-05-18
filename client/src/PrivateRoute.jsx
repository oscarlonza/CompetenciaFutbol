import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "./providers/AuthContext";

const PrivateRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>; // Muestra un indicador de carga mientras se verifica la autenticación
  }

  return user ? children : <Navigate to="/login" />;
};

export default PrivateRoute;

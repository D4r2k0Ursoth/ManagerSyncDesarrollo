import React from 'react';
import { Navigate } from 'react-router-dom';
import { useUser } from '../hooks/UserContext'; // Ajusta la ruta según tu estructura

const ProtectedRoute = ({ children }) => {
  const { user } = useUser(); // Obtén el usuario del contexto

  // Si no hay usuario autenticado, redirige a la página de inicio de sesión
  if (!user) {
    return <Navigate to="/LogIn" />;
  }

  // Si hay un usuario, renderiza los hijos (la ruta protegida)
  return children;
};

export default ProtectedRoute;

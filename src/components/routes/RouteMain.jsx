import React, { useEffect, useState } from 'react'; 
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { useUser } from "../hooks/UserContext"; // Hook para manejar el estado del usuario
import { LoadingPage } from '../../LoadingPage.jsx';
import { Login } from '../activity/Login.jsx';
import { Register } from '../activity/Registro.jsx';
import { Sidebar } from '../Sidebar.jsx';
import { HomePage } from '../../HomePage.jsx';
import { Registro_factura } from '../activity/Registro_factura.jsx';
import { Reporte_general } from '../activity/Reporte_general.jsx';
import { Ventas } from '../activity/Ventas.jsx';
import { Compras } from '../activity/Compras.jsx';
import { Settings } from '../activity/Settings.jsx';
import { ResetPassword } from '../activity/ResetPassword.jsx';
import { ForgotPassword } from '../activity/ForgotPassword.jsx';
import { MantenimientoProductos } from '../activity/MantenimientoProductos.jsx';
import { MantenimientoUsuarios } from '../activity/MantenimientoUsuarios.jsx';
import { MantenimientoClientes } from '../activity/MantenimientoClientes.jsx';
import { EstadisticasFacturas } from '../activity/EstadisticasFacturas.jsx';
import { MantenimientoEmpresas } from '../activity/MantenimientoEmpresas.jsx';
import { MantenimientoProveedores } from '../activity/MantenimientoProveedores.jsx';
import ProtectedRoute from './ProtectedRoute'; // Ajusta la ruta
import { Detalle_facturas } from '../activity/Detalle_facturas.jsx';
import { Punto_venta } from '../activity/Punto_venta.jsx';
import { ConsultarCompras } from '../activity/ConsultarCompras.jsx';
import { HistorialInventario } from '../activity/ConsultarProductos.jsx';
// Ruta para redirigir si el usuario está logueado
function PublicRoute({ children }) {
  const { user } = useUser(); // Hook para obtener usuario logueado
  return user ? <Navigate to="/Settings" /> : children;
}

// Ruta para proteger solo para admins
function AdminRoute({ children }) {
  const { isAdmin } = useUser(); // Verifica si el usuario es admin
  const [hasNoPermission, setHasNoPermission] = useState(false);
  const [redirectToSettings, setRedirectToSettings] = useState(false);

  useEffect(() => {
    if (!isAdmin) {
      setHasNoPermission(true);
      const timer = setTimeout(() => {
        setRedirectToSettings(true); // Establecer la redirección después de 5 segundos
      }, 1000); // 5000 ms = 5 segundos
      return () => clearTimeout(timer); // Limpiar el timer si el componente se desmonta
    }
  }, [isAdmin]);

  if (redirectToSettings) {
    return <Navigate to="/Settings" />;
  }

  if (hasNoPermission) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <h1 className="text-6xl font-bold text-red-500">No tienes permisos!</h1>
      </div>
    );
  }

  return isAdmin ? children : null; // Devuelve null si no hay permisos y no se ha redirigido
}

export function RouteMain() {
  return (
    <Router>
      <Routes>
        <Route path="/HomePage" element={<HomePage />} />
        <Route path="/" element={<LoadingPage />} />
        <Route path="/LogIn" element={
          <PublicRoute>
            <Login />
          </PublicRoute>
        } />
        <Route path="/Registro" element={
          <PublicRoute>
            <Register />
          </PublicRoute>
        } />
        <Route path="/Sidebar" element={<ProtectedRoute><Sidebar /></ProtectedRoute>} />
        <Route path="/Registro_factura" element={<Registro_factura />} />
        <Route path="/Punto_venta" element={<ProtectedRoute><Punto_venta /></ProtectedRoute>} />
        <Route path="/Detalle_facturas" element={<ProtectedRoute><Detalle_facturas /></ProtectedRoute>} />
        <Route path="/Reporte_general" element={<Reporte_general />} />
        <Route path="/Ventas" element={<Ventas />} />
        <Route path="/Compras" element={<ProtectedRoute><AdminRoute><Compras /></AdminRoute>
          </ProtectedRoute>} />
        <Route path="/ConsultarCompras" element={<ConsultarCompras />} />
        <Route path="/ConsultarProductos" element={<HistorialInventario/>} />

        <Route path="/MantenimientoUsuarios" element={
          <ProtectedRoute><AdminRoute>
            <MantenimientoUsuarios /></AdminRoute>

          </ProtectedRoute>} />



          <Route path="/EstadisticasFacturas" element={
          <ProtectedRoute><AdminRoute>
            <EstadisticasFacturas /></AdminRoute>

          </ProtectedRoute>} />
        {/* Solo los administradores pueden acceder a MantenimientoProductos */}
        <Route path="/MantenimientoProductos" element={
         <ProtectedRoute><AdminRoute>
            <MantenimientoProductos />
          </AdminRoute></ProtectedRoute> 
        } />
        <Route path="/MantenimientoProveedores" element={
          <ProtectedRoute><AdminRoute>
            <MantenimientoProveedores /> </AdminRoute>
          </ProtectedRoute>} />
        <Route path="/MantenimientoClientes" element={
          <ProtectedRoute>
            <MantenimientoClientes />
          </ProtectedRoute>} />
          <Route path="/MantenimientoEmpresas" element={
         <PublicRoute>
            <MantenimientoEmpresas />
          </PublicRoute>} />
          
        <Route path="/Settings" element={
          <ProtectedRoute>
            <Settings />
          </ProtectedRoute>
        } />
          <Route path="/ResetPassword/:token" element={<ResetPassword />} />
        <Route path="/ForgotPassword" element={<ForgotPassword />} />  
      </Routes>
    </Router>
  );
}

import React, { useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import LayoutApp from './components/layout/layout';
import CrearPedidos from './pages/CrearPedidos';
import MisPedidos from './pages/MisPedidos';
import Home from './pages/Home';
import Login from "./pages/login/login";
import 'antd/dist/reset.css';

// Componente para rutas protegidas
const ProtectedRoute = ({ children }) => {
  const isAuthenticated = localStorage.getItem('token');
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  return <LayoutApp>{children}</LayoutApp>;
};

function App() {
  const [pedidos, setPedidos] = useState([]);

  return (
    <Routes>
      {/* Ruta pública */}
      <Route path="/login" element={<Login />} />
      
      {/* Rutas protegidas */}
      <Route path="/" element={<Navigate to="/home" replace />} />
      
      <Route path="/home" element={
        <ProtectedRoute>
          <Home />
        </ProtectedRoute>
      } />
      
      <Route path="/crear-pedidos" element={
        <ProtectedRoute>
          <CrearPedidos pedidos={pedidos} setPedidos={setPedidos} />
        </ProtectedRoute>
      } />
      
      <Route path="/mis-pedidos" element={
        <ProtectedRoute>
          <MisPedidos pedidos={pedidos} setPedidos={setPedidos} />
        </ProtectedRoute>
      } />

      <Route path="/proveedores" element={
        <ProtectedRoute>
          <div>Página de Proveedores en construcción</div>
        </ProtectedRoute>
      } />

      <Route path="/reportes" element={
        <ProtectedRoute>
          <div>Página de Reportes en construcción</div>
        </ProtectedRoute>
      } />

      <Route path="*" element={<div>Página no encontrada</div>} />
    </Routes>
  );
}

export default App;

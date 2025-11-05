import React, { useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import LayoutApp from './components/layout/layout';
import CrearPedidos from './pages/CrearPedidos';
import ProveedoresContainer from './components/proveedores/ProveedoresContainer';
import MisPedidos from './pages/MisPedidos';
import Home from './pages/login/home/Home';
import Login from "./pages/login/login";
import 'antd/dist/reset.css';
import UpdateProduct from './components/productos/UpdateProduct';
import HistorialPedidos from './components/historial/HistorialPedidos';
import MetricasContainer from './components/metricas/MetricasContainer';


// Rutas protegidas
const ProtectedRoute = ({ children }) => {
  const isAuthenticated = localStorage.getItem('token');
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  return <LayoutApp>{children}</LayoutApp>;
};

function App() {
  const [pedidos, setPedidos] = useState([]);

  return (
    <Routes>
      {/* Ruta pública */}
      <Route path="/login" element={<Login />} />

      {/* Redirección por defecto */}
      <Route path="/" element={<Navigate to="/home" replace />} />

      {/* Rutas protegidas */}
      <Route
        path="/home"
        element={
          <ProtectedRoute>
            <Home />
          </ProtectedRoute>
        }
      />

      {/* Productos */}
      <Route
        path="/productos/new"
        element={
          <ProtectedRoute>
            <UpdateProduct />
          </ProtectedRoute>
        }
      />
      <Route
        path="/productos/gestion"
        element={
          <ProtectedRoute>
            <UpdateProduct />
          </ProtectedRoute>
        }
      />

      {/* Pedidos */}
      <Route
        path="/crear-pedidos"
        element={
          <ProtectedRoute>
            <CrearPedidos pedidos={pedidos} setPedidos={setPedidos} />
          </ProtectedRoute>
        }
      />
      <Route
        path="/mis-pedidos"
        element={
          <ProtectedRoute>
            <MisPedidos pedidos={pedidos} setPedidos={setPedidos} />
          </ProtectedRoute>
        }
      />

      {/* Nueva ruta: Historial de pedidos */}
      <Route
        path="/historial-pedidos"
        element={
          <ProtectedRoute>
            <HistorialPedidos />
          </ProtectedRoute>
        }
      />

      {/* Proveedores */}
      <Route
        path="/proveedores"
        element={
          <ProtectedRoute>
            <ProveedoresContainer />
          </ProtectedRoute>
        }
      />

    {/* Reportes */}
    <Route
         path="/reportes"
           element={
            <ProtectedRoute>
        <MetricasContainer />
      </ProtectedRoute>
     }
   />

      {/* Página 404 */}
      <Route path="*" element={<div>Página no encontrada</div>} />
    </Routes>
  );
}

export default App;

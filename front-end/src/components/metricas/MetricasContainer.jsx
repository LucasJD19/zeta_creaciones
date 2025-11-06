// src/components/MetricasContainer.jsx
import React, { useEffect, useState } from 'react';
import {
  PieChart, Pie, Cell, Tooltip,
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Legend,
  LineChart, Line,
} from 'recharts';
import MetricAPI from '../../api/apiMetricas';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import 'bootstrap/dist/css/bootstrap.min.css';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#AF19FF'];

const MetricasContainer = () => {
  const [gananciaProductos, setGananciaProductos] = useState([]);
  const [stockCategoria, setStockCategoria] = useState([]);
  const [pedidosEstado, setPedidosEstado] = useState([]);
  const [ventasProducto, setVentasProducto] = useState([]);
  const [clientesTop, setClientesTop] = useState([]);
  const [gananciasMes, setGananciasMes] = useState([]);

  const [analisisHtml, setAnalisisHtml] = useState('');
  const [loadingAnalisis, setLoadingAnalisis] = useState(false);

  useEffect(() => {
    MetricAPI.getGananciaProductos().then(setGananciaProductos);
    MetricAPI.getStockCategoria().then(setStockCategoria);
    MetricAPI.getPedidosEstado().then(setPedidosEstado);
    MetricAPI.getVentasProducto().then(setVentasProducto);
    MetricAPI.getClientesTop().then(setClientesTop);
    MetricAPI.getGananciasMes().then(setGananciasMes);
  }, []);

  const handleGenerarAnalisis = async () => {
    setLoadingAnalisis(true);
    setAnalisisHtml('');

    try {
      const body = {
        gananciaProductos,
        stockCategoria,
        pedidosEstado,
        ventasProducto,
        clientesTop,
        gananciasMes,
      };

      const res = await fetch('http://localhost:3001/api/metricas/generar-analisis', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      if (!res.ok) throw new Error('Error al generar análisis');

      const data = await res.json();
      setAnalisisHtml(data.html || '<p>No se generó contenido</p>');

      const modalEl = document.getElementById('analisisModal');
      if (modalEl) {
        const modal = new window.bootstrap.Modal(modalEl);
        modal.show();
      }
    } catch (err) {
      console.error(err);
      alert('Ocurrió un error generando el análisis.');
    } finally {
      setLoadingAnalisis(false);
    }
  };

  return (
    <div className="container py-4">
      <div className="card shadow-sm border-0 rounded-4 p-4 mb-5">
        <h2 className="fw-bold mb-4 text-center">📊 Métricas del Sistema</h2>

        <div className="text-center mb-4">
          <button
            className="btn btn-primary btn-lg px-4 rounded-pill shadow-sm"
            onClick={handleGenerarAnalisis}
            disabled={loadingAnalisis}
            style={{ minWidth: '230px' }}
          >
            {loadingAnalisis ? (
              <>
                <span className="spinner-border spinner-border-sm me-2" />
                Generando análisis...
              </>
            ) : (
              'Generar análisis'
            )}
          </button>
          <p className="text-muted mt-2 mb-0">
            Obtén un reporte completo generado automáticamente 🔍
          </p>
        </div>

        {/* ================== CHARTS ================== */}
        <div className="mt-5">
          <h4 className="fw-semibold mb-3">Porcentaje de Ganancia por Producto</h4>
          <BarChart width={800} height={300} data={gananciaProductos}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="nombre" />
            <YAxis unit="%" />
            <Tooltip />
            <Legend />
            <Bar dataKey="porcentaje_ganancia" fill="#0088FE" />
          </BarChart>

          <h4 className="fw-semibold mt-5 mb-3">Stock Total por Categoría</h4>
          <PieChart width={400} height={300}>
            <Pie
              data={stockCategoria}
              dataKey="stock_total"
              nameKey="categoria"
              cx="50%"
              cy="50%"
              outerRadius={100}
              label
            >
              {stockCategoria.map((entry, index) => (
                <Cell key={index} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>

          <h4 className="fw-semibold mt-5 mb-3">Pedidos por Estado</h4>
          <PieChart width={400} height={300}>
            <Pie
              data={pedidosEstado}
              dataKey="cantidad"
              nameKey="estado"
              cx="50%"
              cy="50%"
              outerRadius={100}
              label={({ name, value }) => `${name}: ${value}`}
            >
              {pedidosEstado.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>

          <h4 className="fw-semibold mt-5 mb-3">Ventas Totales por Producto</h4>
          <LineChart width={800} height={300} data={ventasProducto}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="nombre" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="total_vendido" stroke="#FF8042" />
          </LineChart>

          <h4 className="fw-semibold mt-5 mb-3">Clientes con Más Pedidos</h4>
          <BarChart width={800} height={300} data={clientesTop}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="nombre" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="total_pedidos" fill="#AF19FF" />
          </BarChart>

          <h4 className="fw-semibold mt-5 mb-3">Ganancias Obtenidas por Mes</h4>
          <LineChart width={800} height={300} data={gananciasMes}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="mes" />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="ganancias" stroke="#FFBB28" />
          </LineChart>
        </div>
      </div>

      {/* ================== MODAL ================== */}
      <div
        className="modal fade"
        id="analisisModal"
        tabIndex="-1"
        aria-labelledby="analisisModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-xl modal-dialog-centered modal-dialog-scrollable">
          <div className="modal-content border-0 shadow-lg rounded-4">
            <div className="modal-header bg-primary text-white rounded-top-4">
              <h5 className="modal-title fw-bold" id="analisisModalLabel">
                📈 Análisis de Métricas
              </h5>
              <button
                type="button"
                className="btn-close btn-close-white"
                data-bs-dismiss="modal"
                aria-label="Cerrar"
              ></button>
            </div>
            <div className="modal-body p-4" style={{ backgroundColor: '#f8f9fa' }}>
              {loadingAnalisis ? (
                <div className="text-center py-5">
                  <div className="spinner-border text-primary mb-3" role="status"></div>
                  <p className="text-muted">Analizando métricas, por favor espera...</p>
                </div>
              ) : (
                <div
                  className="p-3 bg-white rounded-4 shadow-sm"
                  dangerouslySetInnerHTML={{ __html: analisisHtml }}
                />
              )}
            </div>
            <div className="modal-footer border-0 justify-content-center pb-4">
              <button
                type="button"
                className="btn btn-outline-secondary px-4 rounded-pill"
                data-bs-dismiss="modal"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MetricasContainer;

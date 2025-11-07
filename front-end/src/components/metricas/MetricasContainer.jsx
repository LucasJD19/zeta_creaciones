import React, { useEffect, useState } from 'react';
import { Tabs } from 'antd';
import {
  PieChart, Pie, Cell, Tooltip,
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Legend,
  LineChart, Line,
} from 'recharts';
import MetricAPI from '../../api/apiMetricas';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import 'bootstrap/dist/css/bootstrap.min.css';
import './MetricasContainer.css';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#AF19FF'];

const MetricasContainerTabs = () => {
  const [gananciaProductos, setGananciaProductos] = useState([]);
  const [pedidosEstado, setPedidosEstado] = useState([]);
  const [ventasProducto, setVentasProducto] = useState([]);
  const [clientesTop, setClientesTop] = useState([]);
  const [gananciasMes, setGananciasMes] = useState([]);
  const [totales, setTotales] = useState({});
  const [ingresos, setIngresos] = useState([]);
  const [egresos, setEgresos] = useState([]);
  const [analisisHtml, setAnalisisHtml] = useState('');
  const [loadingAnalisis, setLoadingAnalisis] = useState(false);

  useEffect(() => {
    MetricAPI.getGananciaProductos().then(setGananciaProductos);
    MetricAPI.getPedidosEstado().then(setPedidosEstado);
    MetricAPI.getVentasProducto().then(setVentasProducto);
    MetricAPI.getClientesTop().then(setClientesTop);
    MetricAPI.getGananciasMes().then(setGananciasMes);
    MetricAPI.getTotales().then(setTotales);
    MetricAPI.getIngresos().then(setIngresos);
    MetricAPI.getEgresos().then(setEgresos);
  }, []);

  const handleGenerarAnalisis = async () => {
    setLoadingAnalisis(true);
    setAnalisisHtml('');

    try {
      const body = { gananciaProductos, pedidosEstado, ventasProducto, clientesTop, gananciasMes };
      const res = await fetch('http://localhost:3001/api/metricas/generar-analisis', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      if (!res.ok) throw new Error('Error al generar análisis');
      const data = await res.json();
      setAnalisisHtml(data.html || '<p>No se generó contenido</p>');

      const modalEl = document.getElementById('analisisModal');
      if (modalEl) new window.bootstrap.Modal(modalEl).show();
    } catch (err) {
      console.error(err);
      alert('Ocurrió un error generando el análisis.');
    } finally {
      setLoadingAnalisis(false);
    }
  };

  const tabItems = [
    {
      key: '1',
      label: 'Resumen Financiero',
      children: (
        <div className="resumen-financiero">
          <div className="metricas-top">
            <div className="metric-card metric-total-pedidos p-4 rounded shadow-sm text-center">
              <h5>Total de Pedidos</h5>
              <h2>{totales.total_pedidos || 0}</h2>
            </div>
          </div>
          <div className="metricas-bottom">
            <div className="metric-card metric-ingresos p-4 rounded text-center">
              <h5>Total de Ingresos</h5>
              <h2>${totales.total_ingresos?.toLocaleString() || 0}</h2>
            </div>
            <div className="metric-card metric-egresos p-4 rounded text-center">
              <h5>Total de Egresos</h5>
              <h2>${totales.total_egresos?.toLocaleString() || 0}</h2>
            </div>
            <div className="metric-card metric-ganancia p-4 rounded text-center">
              <h5>Ganancia Neta</h5>
              <h2>${((totales.total_ingresos || 0) - (totales.total_egresos || 0)).toLocaleString()}</h2>
            </div>
          </div>
        </div>
      ),
    },
    {
      key: '2',
      label: 'Ganancia por Producto',
      children: (
        <div className="chart-wrapper">
          <BarChart width={800} height={300} data={gananciaProductos}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="nombre" />
            <YAxis unit="%" />
            <Tooltip />
            <Legend />
            <Bar dataKey="porcentaje_ganancia" fill="#0088FE" />
          </BarChart>
        </div>
      ),
    },
    {
      key: '3',
      label: 'Ingresos por Producto',
      children: (
        <div className="chart-wrapper">
          <BarChart width={800} height={300} data={ingresos}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="nombre_producto" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="total_ingreso" fill="#00C49F" />
          </BarChart>
        </div>
      ),
    },
    {
      key: '4',
      label: 'Egresos por Proveedor',
      children: (
        <div className="chart-wrapper text-center">
          <BarChart width={500} height={300} data={egresos} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
                 <CartesianGrid strokeDasharray="3 3" />
                   <XAxis dataKey="proveedor" />
                      <YAxis />
                    <Tooltip formatter={(value) => `$${value}`} />
                   <Legend />
                 <Bar dataKey="total_egreso" fill="#8884d8" radius={[6, 6, 0, 0]} />
          </BarChart>
        </div>
      ),
    },
    {
      key: '5',
      label: 'Pedidos por Estado',
      children: (
        <div className="chart-wrapper text-center">
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
        </div>
      ),
    },
    {
      key: '6',
      label: 'Ventas por Producto',
      children: (
        <div className="chart-wrapper">
          <LineChart width={800} height={300} data={ventasProducto}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="nombre" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="total_vendido" stroke="#FF8042" />
          </LineChart>
        </div>
      ),
    },
    {
      key: '7',
      label: 'Clientes Top',
      children: (
        <div className="chart-wrapper">
          <BarChart width={800} height={300} data={clientesTop}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="nombre" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="total_pedidos" fill="#AF19FF" />
          </BarChart>
        </div>
      ),
    },
    {
      key: '8',
      label: 'Ganancias Mensuales',
      children: (
        <div className="chart-wrapper">
          <LineChart width={800} height={300} data={gananciasMes}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="mes" />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="ganancias" stroke="#FFBB28" />
          </LineChart>
        </div>
      ),
    },
    {
      key: '9',
      label: 'Generar Análisis',
      children: (
        <div className="text-center mt-4">
          <button
            className="btn metricas-btn btn-lg px-4 rounded-pill shadow-sm"
            onClick={handleGenerarAnalisis}
            disabled={loadingAnalisis}
          >
            {loadingAnalisis ? (
              <>
                <span className="spinner-border spinner-border-sm me-2" />
                Generando análisis...
              </>
            ) : 'Generar análisis'}
          </button>
          <p className="text-muted mt-2 mb-0">Obtén un reporte completo generado automáticamente</p>

          {/* Modal */}
          <div
            className="modal fade"
            id="analisisModal"
            tabIndex="-1"
            aria-labelledby="analisisModalLabel"
            aria-hidden="true"
          >
            <div className="modal-dialog modal-xl modal-dialog-centered modal-dialog-scrollable">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title" id="analisisModalLabel">Análisis de Métricas</h5>
                  <button type="button" className="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Cerrar"></button>
                </div>
                <div className="modal-body">
                  {loadingAnalisis ? (
                    <div className="text-center py-5">
                      <div className="spinner-border text-primary mb-3" role="status"></div>
                      <p className="text-muted">Analizando métricas, por favor espera...</p>
                    </div>
                  ) : (
                    <div className="analisis-contenido fade-in" dangerouslySetInnerHTML={{ __html: analisisHtml }} />
                  )}
                </div>
                <div className="modal-footer justify-content-center pb-4">
                  <button type="button" className="btn btn-outline-secondary px-4" data-bs-dismiss="modal">Cerrar</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      ),
    },
  ];

  return (
    <div className="metricas-container container">
      <h2 className="text-center mb-4">Métricas del Sistema</h2>
      <Tabs defaultActiveKey="1" items={tabItems} type="line" size="large" />
    </div>
  );
};

export default MetricasContainerTabs;

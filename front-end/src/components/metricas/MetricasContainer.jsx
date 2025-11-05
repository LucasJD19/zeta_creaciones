// src/components/MetricasContainer.jsx
import React, { useEffect, useState } from 'react';
import {
  PieChart, Pie, Cell, Tooltip,
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Legend,
  LineChart, Line,
} from 'recharts';
import MetricAPI from '../../api/apiMetricas';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#AF19FF'];

const MetricasContainer = () => {
  const [gananciaProductos, setGananciaProductos] = useState([]);
  const [stockCategoria, setStockCategoria] = useState([]);
  const [pedidosEstado, setPedidosEstado] = useState([]);
  const [ventasProducto, setVentasProducto] = useState([]);
  const [clientesTop, setClientesTop] = useState([]);
  const [gananciasMes, setGananciasMes] = useState([]);

  useEffect(() => {
    MetricAPI.getGananciaProductos().then(setGananciaProductos);
    MetricAPI.getStockCategoria().then(setStockCategoria);
    MetricAPI.getPedidosEstado().then(setPedidosEstado);
    MetricAPI.getVentasProducto().then(setVentasProducto);
    MetricAPI.getClientesTop().then(setClientesTop);
    MetricAPI.getGananciasMes().then(setGananciasMes);
  }, []);

  return (
    <div style={{ padding: '20px' }}>
      <h2>Métricas del sistema</h2>

      {/* 1. Porcentaje de ganancia por producto - Barra */}
      <h3>Porcentaje de Ganancia por Producto</h3>
      <BarChart width={800} height={300} data={gananciaProductos}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="nombre" />
        <YAxis unit="%" />
        <Tooltip />
        <Legend />
        <Bar dataKey="porcentaje_ganancia" fill="#0088FE" />
      </BarChart>

      {/* 2. Stock total por categoría - Pie */}
      <h3>Stock Total por Categoría</h3>
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

      {/* 3. Pedidos por estado - Torta */}
        <h3>Pedidos por Estado</h3>
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

      {/* 4. Ventas totales por producto - Linea */}
      <h3>Ventas Totales por Producto</h3>
      <LineChart width={800} height={300} data={ventasProducto}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="nombre" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Line type="monotone" dataKey="total_vendido" stroke="#FF8042" />
      </LineChart>

      {/* 5. Clientes con más pedidos - Barra */}
      <h3>Clientes con Más Pedidos</h3>
      <BarChart width={800} height={300} data={clientesTop}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="nombre" />
        <YAxis />
        <Tooltip />
        <Bar dataKey="total_pedidos" fill="#AF19FF" />
      </BarChart>

      {/* 6. Ganancias obtenidas por mes - Linea */}
      <h3>Ganancias Obtenidas por Mes</h3>
      <LineChart width={800} height={300} data={gananciasMes}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="mes" />
        <YAxis />
        <Tooltip />
        <Line type="monotone" dataKey="ganancias" stroke="#FFBB28" />
      </LineChart>
    </div>
  );
};

export default MetricasContainer;

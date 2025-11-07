import React, { useState, useEffect } from "react";
import { Table, Tag, DatePicker, Input, message, Divider, Checkbox } from "antd";
import { CheckCircleOutlined, CloseCircleOutlined, InfoCircleOutlined } from "@ant-design/icons";
import moment from "moment";
import "moment/locale/es";
import apiPedidos from "../../api/apiPedidos";
import ErrorHandler from "../../helpers/ErrorHandler";
import "./HistorialPedidos.css";

moment.locale("es");

const HistorialPedidos = () => {
  const [pedidos, setPedidos] = useState([]);
  const [filteredPedidos, setFilteredPedidos] = useState([]);
  const [filters, setFilters] = useState({ mes: null, cliente: "" });
  const [checkedList, setCheckedList] = useState([]);

  const allColumns = [
    { title: "ID Pedido", dataIndex: "id_pedido", key: "id_pedido", width: 100 },
    {
      title: "Fecha Creación",
      dataIndex: "fecha_creacion",
      key: "fecha_creacion",
      width: 140,
      render: (f) => moment(f).format("DD-MM-YYYY HH:mm"),
    },
    {
      title: "Cliente",
      dataIndex: ["cliente", "nombre"],
      key: "cliente",
      render: (nombre) => <div style={{ whiteSpace: "normal", wordBreak: "break-word" }}>{nombre || "Sin nombre"}</div>,
    },
    {
      title: "DNI",
      dataIndex: ["cliente", "dni"],
      key: "dni",
      render: (dni) => <div style={{ whiteSpace: "normal", wordBreak: "break-word" }}>{dni}</div>,
    },
    {
      title: "Estado",
      dataIndex: "estado",
      key: "estado",
      render: (estado) => (
        <Tag color={estado === "entregado" ? "green" : "blue"} icon={estado === "entregado" ? <CheckCircleOutlined /> : <InfoCircleOutlined />}>
          {estado.toUpperCase()}
        </Tag>
      ),
    },
    {
      title: "Fecha Estimada",
      dataIndex: "fecha_estimada",
      key: "fecha_estimada",
      render: (f) => moment(f).format("DD-MM-YYYY"),
    },
    {
      title: "Productos",
      key: "productos",
      render: (_, record) => <div style={{ whiteSpace: "normal", wordBreak: "break-word" }}>{record.detalles?.map(d => d.producto_nombre).join(", ")}</div>,
    },
    {
      title: "Descripción",
      key: "descripcion",
      render: (_, record) => <div style={{ whiteSpace: "normal", wordBreak: "break-word" }}>{record.detalles?.map(d => d.descripcion).join(" | ")}</div>,
    },
    {
      title: "Total",
      key: "total",
      render: (_, record) => {
        const total = record.detalles?.reduce((acc, d) => acc + Number(d.subtotal || 0), 0);
        return new Intl.NumberFormat("es-AR", { style: "currency", currency: "ARS" }).format(total);
      },
    },
  ];

  const defaultCheckedList = allColumns.map(col => col.key);
  useEffect(() => setCheckedList(defaultCheckedList), []);

  const fetchPedidos = async () => {
    try {
      const data = await apiPedidos.getFinalizados();
      setPedidos(data);
      setFilteredPedidos(data);
    } catch (err) {
      console.error("Error al obtener pedidos entregados:", err);
      ErrorHandler(err);
      message.error("No se pudieron cargar los pedidos entregados");
    }
  };

  useEffect(() => { fetchPedidos(); }, []);

  const handleFilter = () => {
    let result = [...pedidos];
    if (filters.mes) result = result.filter(p => moment(p.fecha_estimada).month() + 1 === filters.mes);
    if (filters.cliente) {
      const clienteLower = filters.cliente.toLowerCase();
      result = result.filter(p => p.cliente?.nombre?.toLowerCase().includes(clienteLower));
    }
    setFilteredPedidos(result);
  };

  useEffect(() => { handleFilter(); }, [filters, pedidos]);

  const visibleColumns = allColumns.filter(col => checkedList.includes(col.key));

  return (
    <div style={{ padding: 24, background: "#f0f2f5", minHeight: "100vh" }}>
      <h2 style={{ color: "#1890ff", marginBottom: 24, display: "flex", alignItems: "center", gap: 8 }}>
        Historial de Pedidos Entregados
      </h2>

      {/* Filtros */}
      <div style={{ marginBottom: 20, display: "flex", gap: 12, flexWrap: "wrap", alignItems: "center" }}>
        <DatePicker
          picker="month"
          placeholder="Filtrar por mes"
          onChange={date => setFilters({ ...filters, mes: date ? date.month() + 1 : null })}
          style={{ width: 180 }}
        />
        <Input
          placeholder="Buscar por cliente"
          onChange={e => setFilters({ ...filters, cliente: e.target.value })}
          style={{ width: 250 }}
        />
      </div>

      {/* Selector de columnas */}
      <Divider style={{ margin: "16px 0" }}>Columnas visibles</Divider>
      <Checkbox.Group
        options={allColumns.map(col => ({ label: col.title, value: col.key }))}
        value={checkedList}
        onChange={list => setCheckedList(list)}
        style={{ marginBottom: 16 }}
      />

      {/* Tabla */}
      <Table
        columns={visibleColumns}
        dataSource={filteredPedidos}
        rowKey="id_pedido"
        pagination={{ pageSize: 10 }}
        bordered
        size="middle"
        rowClassName={(record, index) => index % 2 === 0 ? "table-row-light" : "table-row-dark"}
        style={{ background: "#fff", borderRadius: 8, overflow: "hidden" }}
      />
    </div>
  );
};

export default HistorialPedidos;

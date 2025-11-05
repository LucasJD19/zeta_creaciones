import React, { useState, useEffect } from "react";
import { Table, Tag, DatePicker, Input, Select, message } from "antd";
import moment from "moment";
import apiPedidos from "../../api/apiPedidos";
import ErrorHandler from "../../helpers/ErrorHandler";

const { RangePicker } = DatePicker;
const { Option } = Select;

const HistorialPedidos = () => {
  const [pedidos, setPedidos] = useState([]);
  const [filteredPedidos, setFilteredPedidos] = useState([]);
  const [filters, setFilters] = useState({ fecha: null, cliente: "", prioridad: "" });

  // 🔹 Trae los pedidos entregados (finalizados)
  const fetchPedidos = async () => {
    try {
      const data = await apiPedidos.getFinalizados(); // 👈 usa la ruta correcta
      setPedidos(data);
      setFilteredPedidos(data);
    } catch (err) {
      console.error("Error al obtener pedidos entregados:", err);
      ErrorHandler(err);
      message.error("No se pudieron cargar los pedidos entregados");
    }
  };

  useEffect(() => {
    fetchPedidos();
  }, []);

  // Filtros dinámicos
  const handleFilter = () => {
  let result = [...pedidos];
   if (filters.fecha) {
   const [inicio, fin] = filters.fecha;
  
  result = result.filter((p) => {
    const fecha = moment(p.fecha_estimada).local().startOf("day"); // fecha en local
    const inicioDia = inicio.startOf("day");
    const finDia = fin.endOf("day");
    return fecha.isBetween(inicioDia, finDia, null, "[]");
  });
}

    if (filters.cliente) {
      result = result.filter((p) =>
        p.cliente?.nombre
          ?.toLowerCase()
          .includes(filters.cliente.toLowerCase())
      );
    }

    if (filters.prioridad) {
      result = result.filter(
        (p) => p.prioridad?.toLowerCase() === filters.prioridad.toLowerCase()
      );
    }

    setFilteredPedidos(result);
  };

  useEffect(() => {
    handleFilter();
  }, [filters, pedidos]);

  // Configuración de columnas
  const columns = [
    {
      title: "ID Pedido",
      dataIndex: "id_pedido",
      key: "id_pedido",
      width: 100,
    },
    {
      title: "Fecha Creación",
      dataIndex: "fecha_creacion",
      key: "fecha_creacion",
      width: 100,
      width: 120,
      render: (f) => moment(f).format("DD-MM-YYYY HH:mm") // o solo "DD-MM-YYYY"
    },
    {
      title: "Cliente",
      dataIndex: ["cliente", "nombre"],
      key: "cliente",
      render: (nombre) => nombre || "Sin nombre",
    },
    {
      title: "DNI",
      dataIndex: ["cliente", "dni"],
      key: "dni",
    },
    {
      title: "Prioridad",
      dataIndex: "prioridad",
      key: "prioridad",
      render: (p) => {
        const color =
          p === "alta" ? "red" : p === "media" ? "orange" : "green";
        return <Tag color={color}>{p?.toUpperCase()}</Tag>;
      },
    },
    {
      title: "Estado",
      dataIndex: "estado",
      key: "estado",
      render: (estado) => (
        <Tag color={estado === "entregado" ? "green" : "blue"}>
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
      title: "Total",
      key: "total",
      render: (_, record) => {
        const total = record.detalles?.reduce(
          (acc, d) => acc + Number(d.subtotal || 0),
          0
        );
        return new Intl.NumberFormat("es-AR", {
          style: "currency",
          currency: "ARS",
        }).format(total);
      },
    },
  ];

  return (
    <div className="historial-container">
      <h2> Historial de Pedidos Entregados</h2>

      {/*  Filtros */}
      <div style={{ marginBottom: 20, display: "flex", gap: 12, flexWrap: "wrap" }}>
        <RangePicker
          onChange={(value) => setFilters({ ...filters, fecha: value })}
          format="DD-MM-YYYY"
        />
        <Input
          placeholder="Buscar por cliente"
          onChange={(e) =>
            setFilters({ ...filters, cliente: e.target.value })
          }
          style={{ width: 200 }}
        />
        <Select
          placeholder="Filtrar por prioridad"
          onChange={(value) => setFilters({ ...filters, prioridad: value })}
          allowClear
          style={{ width: 180 }}
        >
          <Option value="alta">Alta</Option>
          <Option value="media">Media</Option>
          <Option value="baja">Baja</Option>
        </Select>
      </div>

      {/* Tabla */}
      <Table
        columns={columns}
        dataSource={filteredPedidos}
        rowKey="id_pedido"
        pagination={{ pageSize: 10 }}
        bordered
      />
    </div>
  );
};

export default HistorialPedidos;

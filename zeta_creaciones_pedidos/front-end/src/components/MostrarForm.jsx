import React, { useState, useEffect } from 'react';
import { Table, Select, Tag, message, Popconfirm } from 'antd';
import moment from 'moment';
import AppRequest from '../helpers/AppRequest';
import ErrorHandler from '../helpers/ErrorHandler';
import EditButton from './buttons/EditButton';
import DeleteButton from './buttons/DeleteButton';
import './MostrarForm.css';


const { Option } = Select;

const estadoColors = {
  pendiente: "red",
  iniciado: "gold",
  finalizado: "green",
  entregado: "blue"
};

const prioridadColors = {
  alta: "red",
  media: "gold",
  baja: "green"
};

const MostrarForm = () => {
  const [pedidos, setPedidos] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchPedidos = async () => {
    setLoading(true);
    try {
      const data = await AppRequest.get('/pedidos');
      setPedidos(data);
    } catch (err) {
      console.error(err);
      ErrorHandler(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPedidos();
  }, []);

  // Componente interno para manejar el selector de estado
  const EstadoSelector = React.memo(({ record }) => {
    const [seleccion, setSeleccion] = useState(record.estado?.toLowerCase() || 'pendiente');
    const [visibleConfirm, setVisibleConfirm] = useState(false);

    const handleChange = (value) => {
      setSeleccion(value);
      setVisibleConfirm(true); // mostrar popup solo cuando se elige un valor nuevo
    };

    const handleConfirm = async () => {
      try {
        // Actualizamos localmente
        const updatedPedidos = pedidos.map(p =>
          p.id_pedido === record.id_pedido ? { ...p, estado: seleccion } : p
        );
        setPedidos(updatedPedidos);

        // Actualizamos en la base de datos
        await AppRequest.put(`/pedidos/${record.id_pedido}`, {
          estado: seleccion
        });
        message.success('Estado actualizado correctamente');
      } catch (err) {
        console.error(err);
        ErrorHandler(err);
      } finally {
        setVisibleConfirm(false); // ocultar el popup después de confirmar
      }
    };

    const handleCancel = () => {
      setSeleccion(record.estado?.toLowerCase() || 'pendiente'); // revertir al valor original
      setVisibleConfirm(false);
    };

    return (
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <Tag color={estadoColors[seleccion]}>{seleccion.toUpperCase()}</Tag>

        <Popconfirm
          title="¿Desea guardar los cambios?"
          open={visibleConfirm}
          onConfirm={handleConfirm}
          onCancel={handleCancel}
          okText="Sí"
          cancelText="No"
        >
          <Select
            value={seleccion}
            size="small"
            style={{ width: 120 }}
            onChange={handleChange}
          >
            {[
              { value: 'pendiente', label: 'Pendiente' },
              { value: 'iniciado', label: 'Iniciado' },
              { value: 'finalizado', label: 'Finalizado' },
              { value: 'entregado', label: 'Entregado' }
            ].map(option => (
              <Option key={option.value} value={option.value}>
                {option.label}
              </Option>
            ))}
          </Select>
        </Popconfirm>
      </div>
    );
  });

  const columns = [
    { title: 'ID', dataIndex: 'id_pedido', key: 'id_pedido' },
    { 
      title: 'Cliente', 
      dataIndex: ['cliente', 'nombre'], 
      key: 'cliente_nombre'
    },
    { 
      title: 'DNI', 
      dataIndex: ['cliente', 'dni'], 
      key: 'cliente_dni' 
    },
    { 
      title: 'Productos', 
      dataIndex: 'detalles', 
      key: 'productos',
      width: 150,
      render: (detalles) => (
        <div className="detalles-container productos-cell">
          {detalles?.map((detalle, index) => (
            <div key={detalle.id_detalle || index}>
              {detalle.producto_nombre}
            </div>
          ))}
        </div>
      )
    },
    { 
      title: 'Cantidad', 
      dataIndex: 'detalles', 
      key: 'cantidad',
      width: 100,
      render: (detalles) => (
        <div className="detalles-container cantidades-cell">
          {detalles?.map((detalle, index) => (
            <div key={detalle.id_detalle || index}>
              {detalle.cantidad}
            </div>
          ))}
        </div>
      )
    },
    { 
      title: 'Precio', 
      dataIndex: 'detalles', 
      key: 'precio', 
      render: (detalles) => (
        <div>
          {detalles?.map((detalle, index) => (
            <div key={detalle.id_detalle || index}>
              {new Intl.NumberFormat('es-AR', { 
                style: 'currency', 
                currency: 'ARS' 
              }).format(detalle.precio_unitario)}
            </div>
          ))}
        </div>
      )
    },
    { 
      title: 'Fecha Estimada', 
      dataIndex: 'fecha_estimada', 
      key: 'fecha', 
      render: (fecha, record) => (
        <span key={`fecha-${record.id_pedido || 'temp'}`}>
          {fecha ? moment(fecha).format('DD-MM-YYYY') : '-'}
        </span>
      ),
      width: 200
    },
    { 
      title: 'Dirección', 
      dataIndex: ['cliente', 'direccion'], 
      key: 'direccion' 
    },
    { 
      title: 'Teléfono', 
      dataIndex: ['cliente', 'telefono'], 
      key: 'telefono' 
    },
    {
      title: 'Estado',
      dataIndex: 'estado',
      key: 'estado',
      render: (_, record) => (
        <EstadoSelector 
          key={`estado-${record.id_pedido}`} 
          record={record} 
        />
      )
    },
    {
      title: 'Plazo (días)',
      key: 'plazo',
      render: (_, record) => {
        const hoy = moment();
        const fechaEstimada = moment(record.fecha_estimada);
        let diff = fechaEstimada.diff(hoy, 'days') + 1;
        if (diff < 0) diff = 0;
        let color = 'green'
        if (diff <= 10 && diff > 5) color = 'gold';
        if (diff <= 5) color = 'red';
        return (
          <Tag color={color} key={`plazo-${record.id_pedido}`}>
            {diff === 1 ? `${diff} día` : `${diff} días`}
          </Tag>
        );
      },
    },
    {
      title: 'Prioridad',
      dataIndex: 'prioridad',
      key: 'prioridad',
      render: (prioridad, record) => {
        const prioridadKey = prioridad?.toLowerCase() || '-';
        return (
          <Tag 
            color={prioridadColors[prioridadKey]} 
            key={`prioridad-${record.id}`}
          >
            {prioridadKey !== '-' ? prioridadKey.toUpperCase() : '-'}
          </Tag>
        );
      },
    },
    {
      title: 'Acciones',
      key: 'acciones',
      render: (_, record) => (
        <div style={{ display: 'flex', gap: 8 }} key={`acciones-${record.id}`}>
          <EditButton
            key={`edit-${record.id}`}
            record={record}
            onUpdated={(id, nuevoRegistro) => {
              const updated = pedidos.map(p =>
                p.id === id ? { ...p, ...nuevoRegistro } : p
              );
              setPedidos(updated);
            }}
          />
          <DeleteButton
            key={`delete-${record.id}`}
            recordId={record.id}
            onDeleted={(id) => {
              setPedidos(pedidos.filter(p => p.id !== id));
            }}
          />
        </div>
      ),
    }
  ];

  const processedData = React.useMemo(() => 
    pedidos?.map(pedido => ({
      ...pedido,
      key: pedido?.id_pedido?.toString() || `temp-${Math.random()}`
    })) || [],
    [pedidos]
  );

  return (
    <div className="mostrar-form-container">
      <h2>Pedidos en curso</h2>
      <Table
        className="mostrar-form-table"
        columns={columns}
        dataSource={processedData}
        rowKey={(record) => record?.id_pedido?.toString() || record.key}
        pagination={{
          defaultPageSize: 10,
          showSizeChanger: true,
          showQuickJumper: true,
          responsive: true
        }}
        scroll={{ x: 'max-content' }}
        loading={loading}
      />
    </div>
  );
};

export default MostrarForm;

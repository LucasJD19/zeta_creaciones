import React, { useState, useEffect } from 'react';
import { Table, Select, Tag, message, Popconfirm, Modal } from 'antd';
import moment from 'moment';
import { SyncOutlined } from '@ant-design/icons';
import apiPedidos from '../../api/apiPedidos';
import ErrorHandler from '../../helpers/ErrorHandler';
import EditButton from '../buttons/EditButton';
import DeleteButton from '../buttons/DeleteButton';
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
  const [modalVisible, setModalVisible] = useState(false);
  const [pedidoDetalle, setPedidoDetalle] = useState(null);

  const fetchPedidos = async () => {
    setLoading(true);
    try {
      const data = await apiPedidos.getActivos(); // <--- Usamos solo pedidos activos
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

  // Selector de Estado
  const EstadoSelector = React.memo(({ record }) => {
    const [seleccion, setSeleccion] = useState(record.estado?.toLowerCase() || 'pendiente');
    const [visibleConfirm, setVisibleConfirm] = useState(false);

    const handleChange = (value) => {
      setSeleccion(value);
      setVisibleConfirm(true);
    };

    const handleConfirm = async () => {
      try {
        await apiPedidos.updateEstado(record.id_pedido, seleccion);
        let updatedPedidos;
        if (seleccion === 'entregado') {
          // Sacamos el pedido de la lista actual
          updatedPedidos = pedidos.filter(p => p.id_pedido !== record.id_pedido);
          message.success('Pedido entregado y movido al historial');
        } else {
          // Actualizamos su estado normalmente
          updatedPedidos = pedidos.map(p =>
            p.id_pedido === record.id_pedido ? { ...p, estado: seleccion } : p
          );
          message.success('Estado actualizado correctamente');
        }
        setPedidos(updatedPedidos);
      } catch (err) {
        console.error(err);
        ErrorHandler(err);
      } finally {
        setVisibleConfirm(false);
      }
    };

    const handleCancel = () => {
      setSeleccion(record.estado?.toLowerCase() || 'pendiente');
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
            {['pendiente', 'iniciado', 'finalizado', 'entregado'].map(value => (
              <Option key={value} value={value}>{value.charAt(0).toUpperCase() + value.slice(1)}</Option>
            ))}
          </Select>
        </Popconfirm>
      </div>
    );
  });

  // Columnas de la tabla
// Columnas de la tabla
const columns = [
  { 
    title: 'Cliente', 
    dataIndex: ['cliente', 'nombre'], 
    key: 'cliente_nombre', 
    width: 120,
    ellipsis: true 
  },
  { 
    title: 'Dirección', 
    dataIndex: ['cliente', 'direccion'], 
    key: 'direccion', 
    width: 160, 
    ellipsis: true 
  },
  {
    title: 'Prioridad',
    dataIndex: 'prioridad',
    key: 'prioridad',
    width: 100,
    render: prioridad => {
      const key = prioridad?.toLowerCase() || '-';
      return (
        <Tag color={prioridadColors[key]} style={{ fontSize: 11, padding: '2px 6px' }}>
          {key !== '-' ? key.toUpperCase() : '-'}
        </Tag>
      );
    }
  },
  { 
    title: 'Estado', 
    dataIndex: 'estado', 
    key: 'estado', 
    width: 140,
    render: (_, record) => (
      <EstadoSelector key={`estado-${record.id_pedido}`} record={record} />
    )
  },
  {
    title: 'Plazo',
    key: 'plazo',
    width: 90,
    render: (_, record) => {
      const hoy = moment();
      const fechaEstimada = moment(record.fecha_estimada);
      let diff = fechaEstimada.diff(hoy, 'days') + 1;
      if (diff < 0) diff = 0;
      let color = diff <= 5 ? 'red' : diff <= 10 ? 'gold' : 'green';
      return (
        <Tag color={color} style={{ fontSize: 11, padding: '2px 6px' }}>
          {diff} {diff === 1 ? 'día' : 'días'}
        </Tag>
      );
    }
  },
  {
    title: 'Detalle Pedido',
    key: 'detalle',
    width: 110,
    render: (_, record) => (
      <a 
        style={{ fontSize: 12 }}
        onClick={() => { 
          setPedidoDetalle(record); 
          setModalVisible(true); 
        }}
      >
        Ver Detalle
      </a>
    )
  },
  {
    title: 'Acciones',
    key: 'acciones',
    width: 120,
    render: (_, record) => (
      <div style={{ display: 'flex', gap: 4, justifyContent: 'center' }}>
        <EditButton 
          record={record} 
          onUpdated={async (id, nuevoRegistro) => {
            try {
              await apiPedidos.update(id, nuevoRegistro);
              const updated = pedidos.map(p => 
                p.id_pedido === id ? { ...p, ...nuevoRegistro } : p
              );
              setPedidos(updated);
              message.success('Pedido actualizado correctamente');
            } catch (err) {
              console.error(err);
              ErrorHandler(err);
            }
          }} 
        />
        <DeleteButton
          recordId={record.id_pedido}
          pedidos={pedidos}
          setPedidos={setPedidos}
          fetchPedidos={fetchPedidos}
        />
      </div>
    )
  }
];


  const processedData = React.useMemo(() => 
    pedidos?.map(pedido => ({ ...pedido, key: pedido.id_pedido?.toString() || `temp-${Math.random()}` })) || [], 
    [pedidos]
  );

  return (
    <div className="mostrar-form-container">
      <h2 className="mostrar-form-title">
         Pedidos en curso
     </h2>
      <Table
        className="mostrar-form-table"
        columns={columns}
        dataSource={processedData}
        rowKey={record => record.id_pedido?.toString() || record.key}
        pagination={{ pageSize: 10, showSizeChanger: true, showQuickJumper: true  }}
        scroll={{ x: 'max-content' }}
        loading={loading}
      />

     <Modal
        title={
          <span className="detalle-modal-title">
            Detalle del Pedido #{pedidoDetalle?.id_pedido}
          </span>
        }
        open={modalVisible}
        onCancel={() => setModalVisible(false)}
        footer={null}
        width={700}
        className="detalle-pedido-modal"
      >
        <div className="detalle-modal-container">
          {pedidoDetalle?.detalles?.map((d) => (
            <div key={d.id_detalle} className="detalle-item">
              <div className="detalle-header">
                <span className="detalle-producto">{d.producto_nombre}</span>
                <span className="detalle-cantidad">x{d.cantidad}</span>
              </div>

              <div className="detalle-info">
                <p><b>Precio Unitario:</b> {new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS' }).format(d.precio_unitario)}</p>
                <p><b>Precio Venta:</b> {new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS' }).format(d.precio_venta)}</p>
                <p><b>Subtotal:</b> <span className="detalle-subtotal">{new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS' }).format(d.subtotal)}</span></p>
                <p><b>Descripción:</b> {d.descripcion || '-'}</p>
              </div>
            </div>
          ))}
        </div>
      </Modal>

    </div>
  );
};

export default MostrarForm;

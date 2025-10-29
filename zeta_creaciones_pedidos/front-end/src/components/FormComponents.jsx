import React, { useEffect, useState } from 'react';
import { Form, Input, InputNumber, DatePicker, Button, Select, Divider, Space } from 'antd';
import { EditOutlined } from '@ant-design/icons';
import apiPedidos from '../api/apiPedidos';
import apiProductos from '../api/apiProductos';
import MessageNotifier from '../helpers/MessageNotifier';

const { Option } = Select;

const FormComponents = ({ pedidos, setPedidos }) => {
  const [form] = Form.useForm();
  const [productos, setProductos] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState(null);
  const [precioVentaEditable, setPrecioVentaEditable] = useState(false);

  // Cargar productos y categorías
  useEffect(() => {
    apiProductos.getAll()
      .then(res => {
        setProductos(res);

        // Crear lista única de categorías
        const cats = [...new Set(res.map(p => p.categoria_nombre))];
        setCategorias(cats);
      })
      .catch(err => console.error("Error cargando productos:", err));
  }, []);

  const handleCategoriaChange = (categoria) => {
    setCategoriaSeleccionada(categoria);
    form.setFieldsValue({ producto: undefined });
  };

  const handleProductoChange = (id_producto) => {
    const productoSeleccionado = productos.find(p => p.id_producto === id_producto);
    if (productoSeleccionado) {
      form.setFieldsValue({ 
        precio_unitario: productoSeleccionado.precio_unitario,
        precio_venta: productoSeleccionado.precio_unitario
      });
      setPrecioVentaEditable(false);
    } else {
      form.setFieldsValue({ precio_unitario: 0, precio_venta: 0 });
      setPrecioVentaEditable(false);
    }
  };

  // Filtrar productos por categoría seleccionada
  const productosFiltrados = categoriaSeleccionada 
    ? productos
        .filter(p => p.categoria_nombre === categoriaSeleccionada)
        .sort((a, b) => a.precio_unitario - b.precio_unitario)
    : [];

  const onFinish = async (values) => {
    try {
      const nuevoPedido = {
        nombreCliente: values.cliente,
        dni: values.dni,
        direccion: values.direccion,
        telefono: values.telefono,
        id_producto: values.producto,
        cantidad: values.cantidad,
        precio_unitario: values.precio_unitario,
        precio_venta: values.precio_venta,
        descripcion: values.descripcion,
        fecha_estimada: values.fecha_estimada.format("YYYY-MM-DD"),
        prioridad: values.prioridad,
        estado: "pendiente"
      };

      const res = await apiPedidos.create(nuevoPedido);
      setPedidos([...pedidos, { id: res.id_pedido, ...nuevoPedido }]);
      form.resetFields();
      setCategoriaSeleccionada(null);
      setPrecioVentaEditable(false);
      MessageNotifier.success('El pedido se registró correctamente');
    } catch (error) {
      console.error(error);
      MessageNotifier.error('Hubo un problema al registrar el pedido');
    }
  };

  return (
    <div>
      <h2>Registro de Pedido</h2>
      <Form form={form} layout="vertical" onFinish={onFinish} style={{ maxWidth: 600, marginBottom: 30 }}>
        <Divider orientation="left">Datos del Cliente</Divider>
        <Form.Item name="cliente" label="Nombre del Cliente" rules={[{ required: true }]}>
          <Input placeholder="Nombre del cliente" />
        </Form.Item>
        <Form.Item name="dni" label="DNI del cliente" rules={[{ required: true }]}>
          <Input placeholder="DNI del cliente" />
        </Form.Item>
        <Form.Item name="direccion" label="Dirección" rules={[{ required: true }]}>
          <Input placeholder="Dirección del cliente" />
        </Form.Item>
        <Form.Item name="telefono" label="Teléfono" rules={[{ required: true, pattern: /^[0-9]+$/, message: 'Ingrese solo números' }]}>
          <Input placeholder="Teléfono del cliente" />
        </Form.Item>

        <Divider orientation="left">Datos del Pedido</Divider>

        {/* Selector de categoría */}
        <Form.Item name="categoria" label="Categoría">
          <Select placeholder="Seleccione una categoría" onChange={handleCategoriaChange}>
            {categorias.map(c => (
              <Option key={c} value={c}>{c}</Option>
            ))}
          </Select>
        </Form.Item>

        {/* Selector de producto */}
        <Form.Item name="producto" label="Producto" rules={[{ required: true }]}>
          <Select 
            placeholder="Seleccione un producto" 
            onChange={handleProductoChange} 
            disabled={!categoriaSeleccionada}
          >
            {productosFiltrados.map(p => (
              <Option key={p.id_producto} value={p.id_producto}>
                {`${p.nombre} - $${p.precio_unitario}`}
              </Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item name="cantidad" label="Cantidad" rules={[{ required: true }]}>
          <InputNumber min={1} style={{ width: '100%' }} />
        </Form.Item>

        <Form.Item name="precio_unitario" label="Precio Unitario">
          <InputNumber
            min={0}
            style={{ width: '100%' }}
            formatter={value => `$ ${value}`}
            disabled
          />
        </Form.Item>

        <Form.Item label="Precio de Venta" required>
          <Space>
            <Form.Item name="precio_venta" noStyle rules={[{ required: true }]}>
              <InputNumber
                min={0}
                style={{ width: 200 }}
                formatter={value => `$ ${value}`}
                disabled={!precioVentaEditable}
              />
            </Form.Item>
            <Button icon={<EditOutlined />} onClick={() => setPrecioVentaEditable(!precioVentaEditable)}>
              {precioVentaEditable ? 'Bloquear' : 'Editar'}
            </Button>
          </Space>
        </Form.Item>

        <Form.Item name="descripcion" label="Descripción del Pedido">
          <Input.TextArea placeholder="Detalle del pedido (color, logo, etc.)" rows={3} />
        </Form.Item>

        <Form.Item name="prioridad" label="Prioridad" rules={[{ required: true }]}>
          <Select placeholder="Seleccione prioridad">
            <Option value="alta">Alta</Option>
            <Option value="media">Media</Option>
            <Option value="baja">Baja</Option>
          </Select>
        </Form.Item>

        <Form.Item name="fecha_estimada" label="Fecha Estimada" rules={[{ required: true }]}>
          <DatePicker style={{ width: '100%' }} />
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit">Registrar Pedido</Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default FormComponents;

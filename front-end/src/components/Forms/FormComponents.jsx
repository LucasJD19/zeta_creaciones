import React, { useEffect, useState } from 'react';
import {
  Form,
  Input,
  InputNumber,
  DatePicker,
  Button,
  Select,
  Divider,
  Space,
  Radio
} from 'antd';
import { EditOutlined } from '@ant-design/icons';
import apiPedidos from '../../api/apiPedidos';
import apiProductos from '../../api/apiProductos';
import apiClientes from '../../api/apiClientes';
import MessageNotifier from '../../helpers/MessageNotifier';
import './FormComponents.css';
const { Option } = Select;

const FormComponents = ({ pedidos, setPedidos }) => {
  const [form] = Form.useForm();
  const [productos, setProductos] = useState([]);
  const [clientes, setClientes] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState(null);
  const [precioVentaEditable, setPrecioVentaEditable] = useState(false);
  const [modoCliente, setModoCliente] = useState('nuevo'); // 'nuevo' o 'existente'
  const [camposBloqueados, setCamposBloqueados] = useState(false); // 🧩 nuevo estado

  // Cargar productos, categorías y clientes
  useEffect(() => {
    apiProductos
      .getAll()
      .then((res) => {
        setProductos(res);
        const cats = [...new Set(res.map((p) => p.categoria_nombre))];
        setCategorias(cats);
      })
      .catch((err) => console.error('Error cargando productos:', err));

    apiClientes
      .getAll()
      .then(setClientes)
      .catch((err) => console.error('Error cargando clientes:', err));
  }, []);

  const handleCategoriaChange = (categoria) => {
    setCategoriaSeleccionada(categoria);
    form.setFieldsValue({ producto: undefined });
  };

  const handleProductoChange = (id_producto) => {
    const productoSeleccionado = productos.find((p) => p.id_producto === id_producto);
    if (productoSeleccionado) {
      form.setFieldsValue({
        precio_unitario: productoSeleccionado.precio_unitario,
        precio_venta: productoSeleccionado.precio_unitario,
      });
      setPrecioVentaEditable(false);
    } else {
      form.setFieldsValue({ precio_unitario: 0, precio_venta: 0 });
      setPrecioVentaEditable(false);
    }
  };

  // Cuando selecciona un cliente existente
  const handleClienteExistente = (id_cliente) => {
    const clienteSeleccionado = clientes.find((c) => c.id_cliente === id_cliente);
    if (clienteSeleccionado) {
      form.setFieldsValue({
        nombreCliente: clienteSeleccionado.nombre,
        dni: clienteSeleccionado.dni,
        direccion: clienteSeleccionado.direccion,
        telefono: clienteSeleccionado.telefono,
      });
      setCamposBloqueados(true); //bloquea los campos
    }
  };

  // Cuando cambia entre "nuevo" o "existente"
  const handleModoClienteChange = (e) => {
    const modo = e.target.value;
    setModoCliente(modo);

    if (modo === 'nuevo') {
      setCamposBloqueados(false); //desbloquea campos
      form.resetFields(['clienteExistente', 'nombreCliente', 'dni', 'direccion', 'telefono']);
    } else {
      setCamposBloqueados(true);
      form.resetFields(['nombreCliente', 'dni', 'direccion', 'telefono']);
    }
  };

  const productosFiltrados = categoriaSeleccionada
    ? productos
        .filter((p) => p.categoria_nombre === categoriaSeleccionada)
        .sort((a, b) => a.precio_unitario - b.precio_unitario)
    : [];

  const onFinish = async (values) => {
    try {
      const productoSeleccionado = productos.find(
        (p) => p.id_producto === values.producto
      );
      if (!productoSeleccionado)
        return MessageNotifier.error('Producto no seleccionado');

      if (values.cantidad > productoSeleccionado.stock)
        return MessageNotifier.error('Stock insuficiente para este producto');

      const nuevoPedido = {
         nombreCliente: values.nombreCliente,
         dni: values.dni,
         direccion: values.direccion,
         telefono: values.telefono,
         id_producto: values.producto,
         cantidad: values.cantidad,
         precio_unitario: values.precio_unitario,
         precio_venta: values.precio_venta,
         descripcion: values.descripcion,
         fecha_estimada: values.fecha_estimada.format('YYYY-MM-DD'),
         prioridad: values.prioridad,
         estado: 'pendiente',
         estado_pago: values.estado_pago || 'pendiente',
         monto_pago: values.monto_pago || 0,
         metodo_pago: values.metodo_pago || 'efectivo',
       };

      console.log('Enviando pedido al backend:', nuevoPedido);

      const res = await apiPedidos.create(nuevoPedido);

      setPedidos([...pedidos, { id: res.id_pedido, ...nuevoPedido }]);
      form.resetFields();
      setCategoriaSeleccionada(null);
      setPrecioVentaEditable(false);
      setCamposBloqueados(false);
      setModoCliente('nuevo');
      MessageNotifier.success('El pedido se registró correctamente');
    } catch (error) {
      console.error('Error al registrar pedido:', error);
      MessageNotifier.error('Hubo un problema al registrar el pedido');
    }
  };

  return (
  <div className="form-container">
    <h2>Registro de Pedido</h2>

    <Form
      form={form}
      layout="vertical"
      onFinish={onFinish}
      style={{ marginBottom: 30 }}
    >
{/* === DATOS DEL CLIENTE === */}
<Divider orientation="left">Datos del Cliente</Divider>

<div className="form-section-cliente">
  <Form.Item name="nombreCliente" label="Nombre del Cliente" rules={[{ required: true, message: 'Ingrese el nombre del cliente' }]}>
    <Input placeholder="Nombre del cliente" disabled={camposBloqueados} />
  </Form.Item>

  <Form.Item name="dni" label="DNI" rules={[{ required: true, message: 'Ingrese el DNI del cliente' }]}>
    <Input placeholder="DNI del cliente" disabled={camposBloqueados} />
  </Form.Item>

  <Form.Item name="direccion" label="Dirección" className="direccion" rules={[{ required: true, message: 'Ingrese la dirección del cliente' }]}>
    <Input placeholder="Dirección del cliente" disabled={camposBloqueados} />
  </Form.Item>

  <Form.Item name="telefono" label="Teléfono" className="telefono" rules={[{ required: true, pattern: /^[0-9]+$/, message: 'Ingrese solo números' }]}>
    <Input placeholder="Teléfono del cliente" disabled={camposBloqueados} />
  </Form.Item>
</div>

{/* === DATOS DEL PEDIDO === */}
<Divider orientation="left">Datos del Pedido</Divider>

<div className="form-section-pedido">
  <Form.Item name="categoria" label="Categoría">
    <Select placeholder="Seleccione una categoría" onChange={handleCategoriaChange}>
      {categorias.map((c) => (
        <Option key={c} value={c}>{c}</Option>
      ))}
    </Select>
  </Form.Item>

  <Form.Item name="producto" label="Producto" rules={[{ required: true, message: 'Seleccione un producto' }]}>
    <Select
      placeholder="Seleccione un producto"
      onChange={handleProductoChange}
      disabled={!categoriaSeleccionada}
    >
      {productosFiltrados.map((p) => (
        <Option key={p.id_producto} value={p.id_producto}>
          {`${p.nombre} - $${p.precio_unitario}`}
        </Option>
      ))}
    </Select>
  </Form.Item>

  <Form.Item name="cantidad" label="Cantidad" rules={[{ required: true, message: 'Ingrese la cantidad' }]}>
    <InputNumber min={1} style={{ width: '100%' }} />
  </Form.Item>

  <Form.Item name="precio_unitario" label="Precio Unitario">
    <InputNumber
      min={0}
      style={{ width: '100%' }}
      formatter={(value) => `$ ${value}`}
      disabled
    />
  </Form.Item>

  <Form.Item label="Precio de Venta" className="precio-venta" required>
    <Space>
      <Form.Item name="precio_venta" noStyle rules={[{ required: true, message: 'Ingrese el precio de venta' }]}>
        <InputNumber
          min={0}
          style={{ width: 200 }}
          formatter={(value) => `$ ${value}`}
          disabled={!precioVentaEditable}
        />
      </Form.Item>
      <Button
        icon={<EditOutlined />}
        onClick={() => setPrecioVentaEditable(!precioVentaEditable)}
      >
        {precioVentaEditable ? 'Bloquear' : 'Editar'}
      </Button>
    </Space>
  </Form.Item>

  <Form.Item name="descripcion" label="Descripción del Pedido" className="form-descripcion">
    <Input.TextArea placeholder="Detalle del pedido (color, logo, etc.)" rows={3} />
  </Form.Item>
</div>


      <div className="form-section">
        <Form.Item name="prioridad" label="Prioridad" rules={[{ required: true, message: 'Seleccione la prioridad' }]}>
          <Select placeholder="Seleccione prioridad">
            <Option value="alta">Alta</Option>
            <Option value="media">Media</Option>
            <Option value="baja">Baja</Option>
          </Select>
        </Form.Item>

        <Form.Item name="fecha_estimada" label="Fecha Estimada" rules={[{ required: true, message: 'Seleccione la fecha estimada' }]}>
          <DatePicker style={{ width: '100%' }} />
        </Form.Item>
      </div>

      <Divider orientation="left">Datos de Pago</Divider>

      <div className="form-section">
        <Form.Item name="metodo_pago" label="Método de Pago" rules={[{ required: true, message: 'Seleccione el método de pago' }]}>
          <Select placeholder="Seleccione método de pago">
            <Option value="efectivo">Efectivo</Option>
            <Option value="transferencia">Transferencia</Option>
            <Option value="tarjeta">Tarjeta</Option>
          </Select>
        </Form.Item>

        <Form.Item name="monto_pago" label="Monto Pagado">
          <InputNumber
            min={0}
            style={{ width: '100%' }}
            formatter={(value) => `$ ${value}`}
            placeholder="Ingrese monto pagado (0 si no pagó aún)"
          />
        </Form.Item>

        <Form.Item name="estado_pago" label="Estado del Pago">
          <Select placeholder="Seleccione estado del pago">
            <Option value="pendiente">Pendiente</Option>
            <Option value="parcial">Parcial</Option>
            <Option value="completo">Completo</Option>
          </Select>
        </Form.Item>
      </div>

      <Form.Item style={{ textAlign: 'center', marginTop: 20 }}>
        <Button type="primary" htmlType="submit" size="large">
          Registrar Pedido
        </Button>
      </Form.Item>
    </Form>
  </div>
);

};

export default FormComponents;

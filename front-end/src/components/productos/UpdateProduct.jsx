import React, { useEffect, useState } from 'react';
import { Table, Button, Space, Modal, Form, Input, InputNumber, Select, message } from 'antd';
import { EditOutlined, DeleteOutlined, PlusOutlined } from '@ant-design/icons';
import apiProductos from '../../api/apiProductos';
import apiProveedores from '../../api/apiProveedores';
import './UpdateProduct.css'; // nuevo CSS moderno

const { Option } = Select;

const UpdateProduct = () => {
  const [productos, setProductos] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [proveedores, setProveedores] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingProducto, setEditingProducto] = useState(null);

  const [form] = Form.useForm();

  useEffect(() => {
    fetchProductos();
    fetchCategorias();
    fetchProveedores();
  }, []);

  const fetchProductos = async () => {
    try {
      const res = await apiProductos.getAll();
      setProductos(res);
    } catch (error) {
      console.error(error);
      message.error('Error al obtener productos');
    }
  };

  const fetchCategorias = async () => {
    try {
      const res = await apiProductos.getCategorias();
      setCategorias(res);
    } catch (error) {
      console.error(error);
      message.error('Error al obtener categorías');
    }
  };

  const fetchProveedores = async () => {
    try {
      const res = await apiProveedores.getAll();
      setProveedores(res);
    } catch (error) {
      console.error(error);
      message.error('Error al obtener proveedores');
    }
  };

  const openModal = (producto = null) => {
    setEditingProducto(producto);
    if (producto) {
      form.setFieldsValue({
        nombre: producto.nombre,
        descripcion: producto.descripcion,
        precio_unitario: producto.precio_unitario,
        precio_venta: producto.precio_venta,
        stock: producto.stock,
        id_categoria: producto.id_categoria,
        id_proveedor: producto.id_proveedor,
      });
    } else {
      form.resetFields();
    }
    setModalVisible(true);
  };

  const handleDelete = async (id) => {
    try {
      await apiProductos.delete(id);
      message.success('Producto eliminado');
      fetchProductos();
    } catch (error) {
      console.error(error);
      message.error('Error al eliminar producto');
    }
  };

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      if (editingProducto) {
        await apiProductos.update(editingProducto.id_producto, values);
        message.success('Producto actualizado');
      } else {
        await apiProductos.create(values);
        message.success('Producto creado');
      }
      setModalVisible(false);
      fetchProductos();
    } catch (error) {
      console.error(error);
      message.error('Error al guardar producto');
    }
  };

  const columns = [
    { title: 'Nombre', dataIndex: 'nombre', key: 'nombre' },
    { title: 'Precio Unitario', dataIndex: 'precio_unitario', key: 'precio_unitario', render: (p) => `$ ${p}` },
    { title: 'Precio Venta', dataIndex: 'precio_venta', key: 'precio_venta', render: (p) => `$ ${p}` },
    { title: 'Stock', dataIndex: 'stock', key: 'stock' },
    { title: 'Categoría', dataIndex: 'categoria_nombre', key: 'categoria_nombre' },
    { title: 'Proveedor', dataIndex: 'proveedor_nombre', key: 'proveedor_nombre' },
    {
      title: 'Acciones',
      key: 'acciones',
      render: (_, record) => (
        <Space>
          <Button icon={<EditOutlined />} onClick={() => openModal(record)}>Editar</Button>
          <Button icon={<DeleteOutlined />} danger onClick={() => handleDelete(record.id_producto)}>Eliminar</Button>
        </Space>
      ),
    },
  ];

  return (
    <div className="productos-container container">
      <div className="header-section">
        <h2 className="productos-title">Gestión de Productos</h2>
        <div className="title-divider"></div>
      </div>

      <div className="d-flex justify-content-center mb-3">
      <Button 
        type="primary"
        icon={<PlusOutlined />}
        onClick={() => openModal()}
        className="btn-nuevo-producto"
      >
        Nuevo Producto
      </Button>
      </div>
      <Table
        className="tabla-productos"
        columns={columns}
        dataSource={productos}
        rowKey="id_producto"
        bordered
      />

      <Modal
        title={editingProducto ? 'Editar Producto' : 'Nuevo Producto'}
        open={modalVisible}
        onOk={handleSubmit}
        onCancel={() => setModalVisible(false)}
        okText="Guardar"
        className="modal-producto"
      >
        <Form form={form} layout="vertical" className="form-producto">
          <Form.Item
            name="nombre"
            label="Nombre"
            rules={[{ required: true, message: 'Ingrese el nombre' }]}
          >
            <Input placeholder="Ej: Remera oversize blanca" />
          </Form.Item>

          <Form.Item
            name="precio_unitario"
            label="Precio Unitario"
            rules={[{ required: true, message: 'Ingrese el precio unitario' }]}
          >
            <InputNumber min={0} style={{ width: '100%' }} formatter={value => `$ ${value}`} />
          </Form.Item>

          <Form.Item
            name="precio_venta"
            label="Precio Venta"
            rules={[{ required: true, message: 'Ingrese el precio de venta' }]}
          >
            <InputNumber min={0} style={{ width: '100%' }} formatter={value => `$ ${value}`} />
          </Form.Item>

          <Form.Item
            name="stock"
            label="Stock"
            rules={[{ required: true, message: 'Ingrese el stock' }]}
          >
            <InputNumber min={0} style={{ width: '100%' }} />
          </Form.Item>

          <Form.Item
            name="id_categoria"
            label="Categoría"
            rules={[{ required: true, message: 'Seleccione categoría' }]}
          >
            <Select placeholder="Seleccione categoría">
              {categorias.map(cat => (
                <Option key={cat.id_categoria} value={cat.id_categoria}>
                  {cat.nombre}
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item name="id_proveedor" label="Proveedor">
            <Select placeholder="Seleccione proveedor" allowClear>
              {proveedores.map(prov => (
                <Option key={prov.id_proveedor} value={prov.id_proveedor}>
                  {prov.nombre}
                </Option>
              ))}
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default UpdateProduct;

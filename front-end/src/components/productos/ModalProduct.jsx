import React, { useEffect } from 'react';
import { Modal, Form, Input, InputNumber, Select, message } from 'antd';
import apiProductos from '../../api/apiProductos';
const { Option } = Select;
import './ModalProduct.css';

const FormProducto = ({ visible, onClose, onSuccess, producto }) => {
  const [form] = Form.useForm();
  const [categorias, setCategorias] = React.useState([]);
  const [proveedores, setProveedores] = React.useState([]);

  useEffect(() => {
    fetchCategorias();
    fetchProveedores();
    if (producto) {
      form.setFieldsValue({
        nombre: producto.nombre,
        descripcion: producto.descripcion,
        precio: producto.precio,
        stock: producto.stock,
        id_categoria: producto.id_categoria,
        id_proveedor: producto.id_proveedor,
      });
    } else {
      form.resetFields();
    }
  }, [producto]);

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
      // Aquí deberías tener un endpoint de proveedores real
      const res = await apiProductos.getAll(); 
      const uniqueProveedores = Array.from(new Set(res.map(p => p.nombre_proveedor)))
        .map(nombre => ({ id: nombre, nombre }));
      setProveedores(uniqueProveedores);
    } catch (error) {
      console.error(error);
      message.error('Error al obtener proveedores');
    }
  };

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      if (producto) {
        await apiProductos.update(producto.id_producto, values);
        message.success('Producto actualizado');
      } else {
        await apiProductos.create(values);
        message.success('Producto creado');
      }
      onSuccess();
      onClose();
    } catch (error) {
      console.error(error);
      message.error('Error al guardar producto');
    }
  };

  return (
<Modal
  title={
    <div className="modal-header-producto text-center">
      <h3>{producto ? 'Editar Producto' : 'Nuevo Producto'}</h3>
      <p className="modal-subtitle">
        {producto ? 'Modifica los datos existentes' : 'Completa los datos para agregar un nuevo producto'}
      </p>
    </div>
  }
  open={visible}
  onOk={handleSubmit}
  onCancel={onClose}
  okText="Guardar"
  cancelText="Cancelar"
  className="modal-producto"
  centered
>
  <Form form={form} layout="vertical" className="form-producto">
    <div className="row">
      <div className="col-md-6">
        <Form.Item
          name="nombre"
          label="Nombre del Producto"
          rules={[{ required: true, message: 'Ingrese el nombre del producto' }]}
        >
          <Input placeholder="Ej: Remera oversize blanca" />
        </Form.Item>
      </div>

      <div className="col-md-6">
        <Form.Item
          name="stock"
          label="Stock Disponible"
          rules={[{ required: true, message: 'Ingrese el stock' }]}
        >
          <InputNumber min={0} style={{ width: '100%' }} placeholder="Ej: 20" />
        </Form.Item>
      </div>

      <div className="col-md-6">
        <Form.Item
          name="precio_unitario"
          label="Precio Unitario"
          rules={[{ required: true, message: 'Ingrese el precio unitario' }]}
        >
          <InputNumber
            min={0}
            step={0.01}
            style={{ width: '100%' }}
            placeholder="Ej: 2500"
            formatter={value => `$ ${value}`}
          />
        </Form.Item>
      </div>

      <div className="col-md-6">
        <Form.Item
          name="precio_venta"
          label="Precio de Venta"
          rules={[{ required: true, message: 'Ingrese el precio de venta' }]}
        >
          <InputNumber
            min={0}
            step={0.01}
            style={{ width: '100%' }}
            placeholder="Ej: 4000"
            formatter={value => `$ ${value}`}
          />
        </Form.Item>
      </div>

      <div className="col-md-6">
        <Form.Item
          name="id_categoria"
          label="Categoría"
          rules={[{ required: true, message: 'Seleccione una categoría' }]}
        >
          <Select placeholder="Seleccione categoría">
            {categorias.map(cat => (
              <Option key={cat.id_categoria} value={cat.id_categoria}>
                {cat.nombre}
              </Option>
            ))}
          </Select>
        </Form.Item>
      </div>

      <div className="col-md-6">
        <Form.Item
          name="id_proveedor"
          label="Proveedor"
          rules={[{ required: true, message: 'Seleccione un proveedor' }]}
        >
          <Select placeholder="Seleccione proveedor">
            {proveedores.map(prov => (
              <Option key={prov.id} value={prov.id}>
                {prov.nombre}
              </Option>
            ))}
          </Select>
        </Form.Item>
      </div>
    </div>
  </Form>
</Modal>

  );
};

export default FormProducto;

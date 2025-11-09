import React, { useEffect, useState } from 'react';
import {
  Table,
  Button,
  Space,
  Modal,
  Form,
  Input,
  message,
} from 'antd';
import {
  EditOutlined,
  DeleteOutlined,
  PlusOutlined,
} from '@ant-design/icons';
import apiProveedores from '../../api/apiProveedores';
import './proveedores.css'; // nuevo CSS moderno
const UpdateProveedores = () => {
  const [proveedores, setProveedores] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingProveedor, setEditingProveedor] = useState(null);
  const [form] = Form.useForm();

  useEffect(() => {
    fetchProveedores();
  }, []);

  const fetchProveedores = async () => {
    try {
      const res = await apiProveedores.getAll();
      setProveedores(res);
    } catch (error) {
      console.error(error);
      message.error('Error al obtener proveedores');
    }
  };

  const openModal = (proveedor = null) => {
    setEditingProveedor(proveedor);
    if (proveedor) {
      form.setFieldsValue({
        nombre: proveedor.nombre,
        contacto: proveedor.contacto,
        telefono: proveedor.telefono,
        email: proveedor.email,
        direccion: proveedor.direccion,
      });
    } else {
      form.resetFields();
    }
    setModalVisible(true);
  };

  const handleDelete = async (id) => {
    try {
      await apiProveedores.delete(id);
      message.success('Proveedor eliminado correctamente');
      fetchProveedores();
    } catch (error) {
      console.error(error);
      message.error('Error al eliminar proveedor');
    }
  };

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      if (editingProveedor) {
        await apiProveedores.update(editingProveedor.id_proveedor, values);
        message.success('Proveedor actualizado correctamente');
      } else {
        await apiProveedores.create(values);
        message.success('Proveedor agregado correctamente');
      }
      setModalVisible(false);
      fetchProveedores();
    } catch (error) {
      console.error(error);
      message.error('Error al guardar proveedor');
    }
  };

  const columns = [
    { title: 'Nombre', dataIndex: 'nombre', key: 'nombre' },
    { title: 'Contacto', dataIndex: 'contacto', key: 'contacto' },
    { title: 'Teléfono', dataIndex: 'telefono', key: 'telefono' },
    { title: 'Email', dataIndex: 'email', key: 'email' },
    { title: 'Dirección', dataIndex: 'direccion', key: 'direccion' },
    {
      title: 'Acciones',
      key: 'acciones',
      align: 'center',
      render: (_, record) => (
        <Space>
          <Button
            icon={<EditOutlined />}
            onClick={() => openModal(record)}
          >
            Editar
          </Button>
          <Button
            icon={<DeleteOutlined />}
            danger
            onClick={() => handleDelete(record.id_proveedor)}
          >
            Eliminar
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <div className="proveedores-container container">
      <div className="header-section">
        <h2 className="proveedores-title">Gestión de Proveedores</h2>
        <div className="title-divider"></div>
      </div>

      <div className="d-flex justify-content-center mb-3">
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => openModal()}
          className="btn-nuevo-proveedor"
        >
          Nuevo Proveedor
        </Button>
      </div>

      <Table
        className="tabla-proveedores"
        columns={columns}
        dataSource={proveedores}
        rowKey="id_proveedor"
        bordered
      />

      <Modal
        title={editingProveedor ? 'Editar Proveedor' : 'Nuevo Proveedor'}
        open={modalVisible}
        onOk={handleSubmit}
        onCancel={() => setModalVisible(false)}
        okText="Guardar"
        cancelText="Cancelar"
        className="modal-proveedor"
        centered
      >
        <Form form={form} layout="vertical" className="form-proveedor">
          <Form.Item
            name="nombre"
            label="Nombre del Proveedor"
            rules={[{ required: true, message: 'Ingrese el nombre del proveedor' }]}
          >
            <Input placeholder="Ej: Textiles Mendoza" />
          </Form.Item>

          <Form.Item
            name="contacto"
            label="Nombre de Contacto"
            rules={[{ required: true, message: 'Ingrese el nombre de contacto' }]}
          >
            <Input placeholder="Ej: Juan Pérez" />
          </Form.Item>

          <Form.Item
            name="telefono"
            label="Teléfono"
            rules={[{ required: true, message: 'Ingrese el teléfono' }]}
          >
            <Input placeholder="Ej: +54 9 11 1234-5678" />
          </Form.Item>

          <Form.Item
            name="email"
            label="Correo Electrónico"
            rules={[{ type: 'email', message: 'Ingrese un email válido' }]}
          >
            <Input placeholder="Ej: contacto@textilesmendoza.com" />
          </Form.Item>

          <Form.Item name="direccion" label="Dirección">
            <Input placeholder="Ej: Av. San Martín 123, Mendoza" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default UpdateProveedores;

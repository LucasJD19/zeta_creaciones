import React, { useState, useEffect } from 'react';
import {
  Table,
  Form,
  Input,
  Button,
  Popconfirm,
  message,
  Space,
  Card,
  Tooltip,
} from 'antd';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';
import apiProveedores from '../../api/apiProveedores';

const ProveedoresContainer = () => {
  const [proveedores, setProveedores] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form] = Form.useForm();

  // Cargar proveedores
  const fetchProveedores = async () => {
    setLoading(true);
    try {
      const data = await apiProveedores.getAll();
      setProveedores(data);
    } catch (error) {
      message.error('Error al cargar los proveedores');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProveedores();
  }, []);

  // Crear o actualizar proveedor
  const onFinish = async (values) => {
    try {
      if (editingId) {
        await apiProveedores.update(editingId, values);
        message.success('Proveedor actualizado correctamente');
      } else {
        await apiProveedores.create(values);
        message.success('Proveedor agregado correctamente');
      }
      form.resetFields();
      setEditingId(null);
      fetchProveedores();
    } catch (error) {
      message.error('Error al guardar el proveedor');
    }
  };

  // Eliminar proveedor
  const eliminarProveedor = async (id) => {
    try {
      await apiProveedores.delete(id);
      message.success('Proveedor eliminado');
      fetchProveedores();
    } catch (error) {
      message.error('Error al eliminar proveedor');
    }
  };

  // Editar proveedor (rellena el form)
  const editarProveedor = (record) => {
    form.setFieldsValue(record);
    setEditingId(record.id_proveedor);
  };

  const columns = [
    {
      title: 'Nombre',
      dataIndex: 'nombre',
      key: 'nombre',
    },
    {
      title: 'Contacto',
      dataIndex: 'contacto',
      key: 'contacto',
    },
    {
      title: 'Teléfono',
      dataIndex: 'telefono',
      key: 'telefono',
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: 'Dirección',
      dataIndex: 'direccion',
      key: 'direccion',
    },
    {
      title: 'Acciones',
      key: 'acciones',
      align: 'center',
      render: (_, record) => (
        <Space size="middle">
          <Tooltip title="Editar">
            <Button
              type="text"
              icon={<EditOutlined style={{ color: '#1677ff' }} />}
              onClick={() => editarProveedor(record)}
            />
          </Tooltip>

          <Tooltip title="Eliminar">
            <Popconfirm
              title="¿Seguro que deseas eliminar este proveedor?"
              onConfirm={() => eliminarProveedor(record.id_proveedor)}
              okText="Sí"
              cancelText="No"
            >
              <Button
                type="text"
                icon={<DeleteOutlined style={{ color: 'red' }} />}
              />
            </Popconfirm>
          </Tooltip>
        </Space>
      ),
    },
  ];

  return (
    <Card
      title={editingId ? 'Editar Proveedor' : 'Agregar Proveedor'}
      bordered={false}
      style={{ maxWidth: 900, margin: '0 auto', textAlign: 'center' }}
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={onFinish}
        style={{
          marginBottom: 24,
          maxWidth: 500,
          marginLeft: 'auto',
          marginRight: 'auto',
          textAlign: 'left',
        }}
      >
        <Form.Item
          name="nombre"
          label="Nombre"
          rules={[{ required: true, message: 'El nombre es obligatorio' }]}
        >
          <Input placeholder="Nombre del proveedor" />
        </Form.Item>

        <Form.Item
        rules={[{ required: true, message: 'El nombre es obligatorio' }]}
         name="contacto" label="Contacto">
          <Input placeholder="Nombre de contacto" />
          
        </Form.Item>

        <Form.Item
         name="telefono" label="Teléfono">
          <Input placeholder="Teléfono del proveedor" />
        </Form.Item>

        <Form.Item name="email" label="Email">
          <Input placeholder="Correo electrónico" type="email" />
        </Form.Item>

        <Form.Item name="direccion" label="Dirección">
          <Input placeholder="Dirección del proveedor" />
        </Form.Item>

        <Form.Item style={{ textAlign: 'center' }}>
          <Space>
            <Button type="primary" htmlType="submit">
              {editingId ? 'Actualizar' : 'Agregar'}
            </Button>
            {editingId && (
              <Button
                onClick={() => {
                  form.resetFields();
                  setEditingId(null);
                }}
              >
                Cancelar
              </Button>
            )}
          </Space>
        </Form.Item>
      </Form>

      <Table
        columns={columns}
        dataSource={proveedores}
        rowKey="id_proveedor"
        loading={loading}
        pagination={{ pageSize: 5 }}
      />
    </Card>
  );
};

export default ProveedoresContainer;

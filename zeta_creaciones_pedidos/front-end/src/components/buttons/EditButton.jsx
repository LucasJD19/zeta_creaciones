import React, { useState } from 'react';
import { Button, Modal, Input, InputNumber, Select, DatePicker, Form, message } from 'antd';
import dayjs from 'dayjs';
import AppRequest from '../../helpers/AppRequest';
import ErrorHandler from '../../helpers/ErrorHandler';

const { Option } = Select;

const EditButton = ({ record, onUpdated }) => {
  const [visible, setVisible] = useState(false);
  const [form] = Form.useForm();

  const initialValues = {
    cliente: record.cliente || '',
    direccion: record.direccion || '',
    telefono: record.telefono || '',
    producto: record.producto || '',
    cantidad: record.cantidad || 1,
    precio: record.precio || 0,
    fecha_estimada: record.fecha_estimada ? dayjs(record.fecha_estimada, 'YYYY-MM-DD') : null,
    estado: record.estado || 'pendiente',
    prioridad: record.prioridad || 'media'
  };

  const openModal = () => {
    setVisible(true);
    form.setFieldsValue(initialValues); // setear valores cada vez que se abre
  };

  const handleUpdate = async () => {
    try {
      const values = await form.validateFields();

      // payload adaptado a tu backend
      const payload = {
        nombre: values.cliente,            // cliente → nombre en tabla cliente
        direccion: values.direccion,
        telefono: values.telefono,
        producto: values.producto,
        cantidad: values.cantidad,
        precio: values.precio,
        fecha_estimada: values.fecha_estimada
          ? values.fecha_estimada.format('YYYY-MM-DD')
          : null,
        estado: values.estado?.toLowerCase() || 'pendiente',
        prioridad: values.prioridad?.toLowerCase() || 'media'
      };

      // llamamos al PUT usando el id_pedido
      await AppRequest.put(`/pedidos/${record.id_pedido}`, payload);

      message.success('Pedido y cliente actualizados correctamente');

      // actualizamos frontend: mapeamos nombre → cliente
      onUpdated(record.id_pedido, {
        ...payload,
        cliente: payload.nombre || record.cliente,
      });

      setVisible(false);
    } catch (err) {
      ErrorHandler(err);
    }
  };

  return (
    <>
      <Button type="primary" size="small" onClick={openModal}>
        Editar
      </Button>
      <Modal
        title={`Editar Pedido #${record.id}`}
        open={visible}
        onOk={handleUpdate}
        onCancel={() => setVisible(false)}
        okText="Guardar"
      >
        <Form form={form} layout="vertical">
          <Form.Item
            label="Nombre del Cliente"
            name="cliente"
            rules={[{ required: true, message: 'Ingrese el nombre del cliente' }]}
          >
            <Input placeholder="Cliente" />
          </Form.Item>

          <Form.Item
            label="Dirección"
            name="direccion"
            rules={[{ required: true, message: 'Ingrese la dirección' }]}
          >
            <Input placeholder="Dirección" />
          </Form.Item>

          <Form.Item
            label="Teléfono"
            name="telefono"
            rules={[{ required: true, message: 'Ingrese el teléfono' }]}
          >
            <Input placeholder="Teléfono" />
          </Form.Item>

          <Form.Item
            label="Producto"
            name="producto"
            rules={[{ required: true, message: 'Ingrese el producto' }]}
          >
            <Input placeholder="Producto" />
          </Form.Item>

          <Form.Item
            label="Cantidad"
            name="cantidad"
            rules={[{ required: true, message: 'Ingrese la cantidad' }]}
          >
            <InputNumber min={1} style={{ width: '100%' }} />
          </Form.Item>

          <Form.Item
            label="Precio"
            name="precio"
            rules={[{ required: true, message: 'Ingrese el precio' }]}
          >
            <InputNumber
              min={0}
              style={{ width: '100%' }}
              formatter={value => `$ ${value}`}
            />
          </Form.Item>

          <Form.Item
            label="Prioridad"
            name="prioridad"
            rules={[{ required: true, message: 'Seleccione la prioridad' }]}
          >
            <Select>
              <Option value="alta">Alta</Option>
              <Option value="media">Media</Option>
              <Option value="baja">Baja</Option>
            </Select>
          </Form.Item>

          <Form.Item
            label="Estado"
            name="estado"
            rules={[{ required: true, message: 'Seleccione el estado' }]}
          >
            <Select>
              <Option value="pendiente">Pendiente</Option>
              <Option value="iniciado">Iniciado</Option>
              <Option value="finalizado">Finalizado</Option>
              <Option value="entregado">Entregado</Option>
            </Select>
          </Form.Item>

          <Form.Item
            label="Fecha Estimada"
            name="fecha_estimada"
            rules={[{ required: true, message: 'Seleccione la fecha estimada' }]}
          >
            <DatePicker style={{ width: '100%' }} format="YYYY-MM-DD" />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default EditButton;

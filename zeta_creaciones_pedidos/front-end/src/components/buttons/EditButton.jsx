import React, { useState } from 'react';
import { Button, Modal, Select, DatePicker, Form, message, Divider } from 'antd';
import dayjs from 'dayjs';
import AppRequest from '../../helpers/AppRequest';
import ErrorHandler from '../../helpers/ErrorHandler';

const { Option } = Select;

const EditButton = ({ record, onUpdated }) => {
  const [visible, setVisible] = useState(false);
  const [form] = Form.useForm();

  // Bloque corregido
  const initialValues = {
    fecha_estimada: record.fecha_estimada
      ? dayjs(record.fecha_estimada, 'YYYY-MM-DD') // ← mantiene el formato interno correcto
      : null,
    estado: record.estado || 'pendiente',
    prioridad: record.prioridad || 'media'
  };

  const openModal = () => {
    setVisible(true);
    form.setFieldsValue(initialValues);
  };

  const handleUpdate = async () => {
    try {
      const values = await form.validateFields();

      const payload = {
        fecha_estimada: values.fecha_estimada
          ? values.fecha_estimada.format('YYYY-MM-DD') // ← formato para guardar
          : null,
        estado: values.estado?.toLowerCase() || 'pendiente',
        prioridad: values.prioridad?.toLowerCase() || 'media'
      };

      await AppRequest.put(`/pedidos/${record.id_pedido}`, payload);

      message.success('Pedido actualizado correctamente');

      // actualiza el pedido en la tabla (frontend)
      onUpdated(record.id_pedido, { ...record, ...payload });

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
        title={`Editar Pedido #${record.id_pedido}`}
        open={visible}
        onOk={handleUpdate}
        onCancel={() => setVisible(false)}
        okText="Guardar"
        cancelText="Cancelar"
      >
        {/* Información del cliente (solo lectura) */}
        <div style={{ marginBottom: 10 }}>
          <p><strong>Cliente:</strong> {record.cliente?.nombre}</p>
          <p><strong>Teléfono:</strong> {record.cliente?.telefono}</p>
          <p><strong>Dirección:</strong> {record.cliente?.direccion}</p>
        </div>

        <Divider />

        <Form form={form} layout="vertical">
          {/* DatePicker con formato de visualización */}
          <Form.Item
            label="Fecha Estimada"
            name="fecha_estimada"
            rules={[{ required: true, message: 'Seleccione la fecha estimada' }]}
          >
            <DatePicker style={{ width: '100%' }} format="DD-MM-YYYY" />
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
        </Form>
      </Modal>
    </>
  );
};

export default EditButton;

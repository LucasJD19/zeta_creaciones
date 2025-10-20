import React from 'react';
import { Form, Input, InputNumber, DatePicker, Button, message, Select, Divider } from 'antd';
import AppRequest from '../helpers/AppRequest'; // 👈 importamos helper
import MessageNotifier from '../helpers/MessageNotifier'

const { Option } = Select;

const FormComponents = ({ pedidos, setPedidos }) => {
  const [form] = Form.useForm();

  const onFinish = async (values) => {
    try {
      const nuevoPedido = {
        nombre: values.cliente,
        dni: values.dni,
        direccion: values.direccion,
        telefono: values.telefono,
        producto: values.producto,
        cantidad: values.cantidad,
        precio: values.precio,
        fecha_estimada: values.fecha_estimada.format('YYYY-MM-DD'),
        estado: "pendiente",
        prioridad: values.prioridad
      };

      console.log("json: ",nuevoPedido);

      // Se envía al backend
      const res = await AppRequest.createPedido(nuevoPedido);

      // si sale bien, se agrega el pedido al local
      setPedidos([...pedidos, { id: res.id, ...nuevoPedido }]);

      form.resetFields();
      MessageNotifier.success('El pedido se registró correctamente');
    } catch (error) {
      console.error(error);
      MessageNotifier.error('Hubo un problema al registrar el pedido');
    }
  };

  return (
    <div>
      <h2>Registro de Pedido</h2>
      <Form
        form={form}
        layout="vertical"
        onFinish={onFinish}
        style={{ maxWidth: 600, marginBottom: 30 }}
      >
        <Divider orientation="left">Datos del Cliente</Divider>
        <Form.Item name="cliente" label="Nombre del Cliente" rules={[{ required: true }]}>
          <Input placeholder="Nombre del cliente" />
         </Form.Item>
        <Form.Item name= "dni" label = "DNI del cliente" rules={[{ required: true }]}>
          <Input placeholder="Dni del cliente"></Input>
        </Form.Item>
        <Form.Item name="direccion" label="Dirección" rules={[{ required: true }]}>
          <Input placeholder="Dirección del cliente" />
        </Form.Item>
        <Form.Item name="telefono" label="Teléfono" rules={[{ required: true, pattern: /^[0-9]+$/, message: 'Ingrese solo números' }]}>
          <Input placeholder="Teléfono del cliente" />
        </Form.Item>

        <Divider orientation="left">Datos del Pedido</Divider>
        <Form.Item name="producto" label="Pedido" rules={[{ required: true }]}>
          <Input placeholder="Ingrese un pedido" />
        </Form.Item>
        <Form.Item name="cantidad" label="Cantidad" rules={[{ required: true }]}>
          <InputNumber min={1} style={{ width: '100%' }} />
        </Form.Item>
        <Form.Item name="precio" label="Precio" rules={[{ required: true }]}>
          <InputNumber min={0} style={{ width: '100%' }} formatter={(value) => `$ ${value}`} />
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

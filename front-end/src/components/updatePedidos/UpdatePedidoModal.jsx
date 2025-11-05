import React, { useState, useEffect } from "react";
import { Modal, Form, Input, InputNumber, Select, DatePicker, Button, message } from "antd";
import dayjs from "dayjs";
import apiPedidos from "../../api/apiPedidos";
import ErrorHandler from "../../helpers/ErrorHandler";

const { Option } = Select;

const UpdatePedidoModal = ({ visible, onClose, pedido }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

useEffect(() => {
  if (pedido) {
    console.log("Pedido recibido en modal:", pedido);
    form.setFieldsValue({
      id_pedido: pedido?.id_pedido || "",
      nombreCliente: pedido?.cliente?.nombre || "",
      dni: pedido?.cliente?.dni || "",
      direccion: pedido?.cliente?.direccion || "",
      telefono: pedido?.cliente?.telefono || "",
      id_producto: pedido?.detalles?.[0]?.producto?.id_producto 
        || pedido?.detalles?.[0]?.id_producto 
        || "",
      cantidad: pedido?.detalles?.[0]?.cantidad || 1,
      precio_unitario: pedido?.detalles?.[0]?.precio_unitario || 0,
      precio_venta: pedido?.detalles?.[0]?.precio_venta || 0,
      descripcion: pedido?.detalles?.[0]?.descripcion || "",
      estado_pago: pedido?.detalles?.[0]?.estado_pago || "pendiente",
      fecha_estimada: pedido?.fecha_estimada ? dayjs(pedido.fecha_estimada) : null,
      prioridad: pedido?.prioridad || "media",
      estado: pedido?.estado || "pendiente",
      metodo_pago: pedido?.metodo_pago || "efectivo",
      monto_pago:
        pedido?.monto_pago_total ??
        pedido?.detalles?.[0]?.monto_pago ??
        0,
    });
  }
}, [pedido, form]);


const handleSubmit = async (values) => {
  try {
    setLoading(true);

    const idPedido = pedido.id_pedido;
    const idCliente = pedido?.id_cliente; // CORREGIDO
    const idDetalle = pedido?.detalles?.[0]?.id_detalle;
    const idPago = pedido?.pagos?.[0]?.id_pago;

    // 1 Actualizar pedido principal
    await apiPedidos.update(idPedido, {
      fecha_estimada: values.fecha_estimada
        ? dayjs(values.fecha_estimada).format("YYYY-MM-DD")
        : pedido.fecha_estimada,
      estado: values.estado || pedido.estado,
      prioridad: values.prioridad || pedido.prioridad,
    });

    // 2 Actualizar cliente
    if (idCliente) {
      await apiPedidos.updateCliente(idCliente, {
        nombre: values.nombreCliente || pedido.cliente_nombre,
        direccion: values.direccion || pedido.cliente_direccion,
        telefono: values.telefono || pedido.cliente_telefono,
        dni: values.dni || pedido.cliente_dni,
      });
    }

    // 3 Actualizar detalle
    await apiPedidos.updateDetalle(idDetalle, {
        id_producto: values.id_producto,
        cantidad: values.cantidad,
        precio_unitario: values.precio_unitario || pedido.detalles[0]?.precio_unitario || 0,
        precio_venta: values.precio_venta,
        subtotal: (values.precio_unitario || pedido.detalles[0]?.precio_unitario || 0) * values.cantidad,
        descripcion: values.descripcion,
        estado_pago: values.estado_pago,
        monto_pago: values.monto_pago ?? 0,
    });

    // 4 Actualizar pago
    if (idPago) {
      await apiPedidos.updatePago(idPago, {
        metodo: values.metodo_pago,
        monto: values.monto_pago,
        fecha_pago: dayjs().format("YYYY-MM-DD"),
      });
    }

    message.success("Pedido actualizado correctamente");
    onClose(true);
  } catch (err) {
    console.error("Error al actualizar:", err);
    ErrorHandler(err);
  } finally {
    setLoading(false);
  }
};



return (
  <Modal
    title={`Editar Pedido #${pedido?.id_pedido}`}
    open={visible}
    onCancel={() => onClose(false)}
    footer={null}
    width={700}
  >
    <Form form={form} layout="vertical" onFinish={handleSubmit}>
      
      <h3>Datos del Cliente</h3>
      <Form.Item name="id_pedido" label="ID del Pedido">
        <Input disabled />
      </Form.Item>
      <Form.Item name="nombreCliente" label="Nombre del Cliente" rules={[{ required: true }]}>
        <Input disabled />
      </Form.Item>
      <Form.Item name="dni" label="DNI" rules={[{ required: true }]}>
        <Input disabled />
      </Form.Item>
      <Form.Item name="direccion" label="Dirección">
        <Input />
      </Form.Item>
      <Form.Item name="telefono" label="Teléfono">
        <Input />
      </Form.Item>

      <h3>Detalle del Producto</h3>
      <Form.Item name="id_producto" label="ID del Producto" rules={[{ required: true }]}>
        <Input disabled />
      </Form.Item>
      <Form.Item name="descripcion" label="Descripción">
        <Input.TextArea rows={2} />
      </Form.Item>
      <Form.Item name="cantidad" label="Cantidad" rules={[{ required: true }]}>
        <InputNumber min={1} style={{ width: "100%" }} />
      </Form.Item>
      <Form.Item name="precio_unitario" label="Precio Unitario">
        <InputNumber min={0} step={0.01} prefix="$" disabled style={{ width: "100%" }} />
      </Form.Item>
      <Form.Item name="precio_venta" label="Precio de Venta" rules={[{ required: true }]}>
        <InputNumber min={0} step={0.01} prefix="$" style={{ width: "100%" }} />
      </Form.Item>

      <h3>Información del Pedido</h3>
      <Form.Item name="fecha_estimada" label="Fecha Estimada">
        <DatePicker format="DD-MM-YYYY" style={{ width: "100%" }} />
      </Form.Item>
      <Form.Item name="prioridad" label="Prioridad">
        <Select>
          <Option value="alta">Alta</Option>
          <Option value="media">Media</Option>
          <Option value="baja">Baja</Option>
        </Select>
      </Form.Item>
      <Form.Item name="estado" label="Estado del Pedido">
        <Select>
          <Option value="pendiente">Pendiente</Option>
          <Option value="iniciado">Iniciado</Option>
          <Option value="finalizado">Finalizado</Option>
          <Option value="entregado">Entregado</Option>
        </Select>
      </Form.Item>

      <h3>Información de Pago</h3>
      <Form.Item name="estado_pago" label="Estado del Pago" rules={[{ required: true }]}>
        <Select>
          <Option value="pendiente">Pendiente</Option>
          <Option value="pagado">Pagado</Option>
          <Option value="parcial">Parcial</Option>
        </Select>
      </Form.Item>
      <Form.Item name="metodo_pago" label="Método de Pago">
        <Select>
          <Option value="efectivo">Efectivo</Option>
          <Option value="transferencia">Transferencia</Option>
          <Option value="tarjeta">Tarjeta</Option>
        </Select>
      </Form.Item>
      <Form.Item name="monto_pago" label="Monto Pagado">
        <InputNumber min={0} step={0.01} prefix="$" style={{ width: "100%" }} />
      </Form.Item>

      <div style={{ textAlign: "right", marginTop: 20 }}>
        <Button onClick={() => onClose(false)} style={{ marginRight: 8 }}>
          Cancelar
        </Button>
        <Button type="primary" htmlType="submit" loading={loading}>
          Guardar Cambios
        </Button>
      </div>
    </Form>
  </Modal>
);

};

export default UpdatePedidoModal;

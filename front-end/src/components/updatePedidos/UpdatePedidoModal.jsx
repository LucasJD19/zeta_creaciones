import React, { useState, useEffect } from "react";
import {
  Modal,
  Form,
  Input,
  InputNumber,
  Select,
  DatePicker,
  Button,
  Divider,
  Space,
} from "antd";
import dayjs from "dayjs";
import apiPedidos from "../../api/apiPedidos";
import ErrorHandler from "../../helpers/ErrorHandler";
import "./updateModal.css";
const { Option } = Select;

const UpdatePedidoModal = ({ visible, onClose, pedido }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (pedido) {
      const detalle = pedido.detalles?.[0] || {};
      const producto = detalle.producto || {};
      const pago = pedido.pagos?.[0] || {};

      form.setFieldsValue({
        id_pedido: pedido.id_pedido || "",
        id_pago: pedido.id_pago || "",
        nombreCliente: pedido.cliente?.nombre || "",
        dni: pedido.cliente?.dni || "",
        direccion: pedido.cliente?.direccion || "",
        telefono: pedido.cliente?.telefono || "",
        id_producto: detalle.id_producto || producto.id_producto || "",
        cantidad: detalle.cantidad || 1,
        precio_unitario: detalle.precio_unitario || 0,
        precio_venta: detalle.precio_venta || 0,
        descripcion: detalle.descripcion || "",
        estado_pago: detalle.estado_pago || "pendiente",
        fecha_estimada: pedido.fecha_estimada ? dayjs(pedido.fecha_estimada) : null,
        prioridad: pedido.prioridad || "media",
        estado: pedido.estado || "pendiente",
        metodo_pago: pago.metodo || pedido.metodo_pago || "efectivo",
        monto_pago: pago.monto ?? pedido.monto_pago_total ?? 0,
      });
    }
  }, [pedido, form]);

  const handleSubmit = async (values) => {
    try {
      setLoading(true);
      const idPedido = pedido.id_pedido;
      const idCliente = pedido?.cliente?.id_cliente;
      const idDetalle = pedido?.detalles?.[0]?.id_detalle;
      const idPago = values.id_pago || pedido?.id_pago || pedido?.pagos?.[0]?.id_pago;

      await apiPedidos.update(idPedido, {
        fecha_estimada: values.fecha_estimada
          ? dayjs(values.fecha_estimada).format("YYYY-MM-DD")
          : pedido.fecha_estimada,
        estado: values.estado || pedido.estado,
        prioridad: values.prioridad || pedido.prioridad,
      });

      if (idCliente) {
        await apiPedidos.updateCliente(idCliente, {
          nombre: values.nombreCliente,
          direccion: values.direccion,
          telefono: values.telefono,
          dni: values.dni,
        });
      }

      await apiPedidos.updateDetalle(idDetalle, {
        id_producto: values.id_producto,
        cantidad: values.cantidad,
        precio_unitario: values.precio_unitario,
        precio_venta: values.precio_venta,
        subtotal: (values.precio_unitario || 0) * values.cantidad,
        descripcion: values.descripcion,
        estado_pago: values.estado_pago,
        monto_pago: values.monto_pago,
      });

      if (idPago) {
        await apiPedidos.updatePago(idPago, {
          metodo: values.metodo_pago,
          monto: values.monto_pago,
          fecha_pago: dayjs().format("YYYY-MM-DD"),
        });
      }

      onClose(true);
    } catch (err) {
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
      width={750}
      className="update-pedido-modal"
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        className="update-pedido-form"
      >
        <Divider orientation="left">Datos del Cliente</Divider>
        <div className="form-section">
          <Form.Item name="nombreCliente" label="Nombre del Cliente">
            <Input disabled />
          </Form.Item>
          <Form.Item name="dni" label="DNI">
            <Input disabled />
          </Form.Item>
          <Form.Item name="direccion" label="Dirección">
            <Input />
          </Form.Item>
          <Form.Item name="telefono" label="Teléfono">
            <Input />
          </Form.Item>
        </div>

        <Divider orientation="left">Detalle del Producto</Divider>
        <div className="form-section">
          <Form.Item name="id_producto" label="ID del Producto">
            <Input disabled />
          </Form.Item>
          <Form.Item name="cantidad" label="Cantidad">
            <InputNumber min={1} style={{ width: "100%" }} />
          </Form.Item>
          <Form.Item name="precio_unitario" label="Precio Unitario">
            <InputNumber
              min={0}
              prefix="$"
              disabled
              style={{ width: "100%" }}
            />
          </Form.Item>
          <Form.Item name="precio_venta" label="Precio de Venta">
            <InputNumber min={0} prefix="$" style={{ width: "100%" }} />
          </Form.Item>
        </div>

        <Form.Item name="descripcion" label="Descripción del Pedido">
          <Input.TextArea rows={3} />
        </Form.Item>

        <Divider orientation="left">Información del Pedido</Divider>
        <div className="form-section">
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
        </div>

        <Divider orientation="left">Información de Pago</Divider>
        <div className="form-section">
          <Form.Item name="estado_pago" label="Estado del Pago">
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
            <InputNumber min={0} prefix="$" style={{ width: "100%" }} />
          </Form.Item>
        </div>

        <div className="form-buttons">
          <Space>
            <Button onClick={() => onClose(false)}>Cancelar</Button>
            <Button type="primary" htmlType="submit" loading={loading}>
              Guardar Cambios
            </Button>
          </Space>
        </div>
      </Form>
    </Modal>
  );
};

export default UpdatePedidoModal;

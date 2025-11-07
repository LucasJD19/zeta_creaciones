import React from 'react';
import { Button, Popconfirm, message } from 'antd';
import apiPedidos from '../../api/apiPedidos';
import ErrorHandler from '../../helpers/ErrorHandler';

const DeleteButton = ({ recordId, pedidos, setPedidos, fetchPedidos }) => {
  const handleDelete = async () => {
    try {
      // Primero borramos en backend
      await apiPedidos.deletePedido(recordId);

      // Actualizamos estado local de forma segura
      setPedidos(prev => prev.filter(p => p.id_pedido !== recordId));

      message.success('Pedido eliminado correctamente');

      // Refrescamos desde backend por si hubo cambios externos
      if (fetchPedidos) {
        await fetchPedidos();
      }

    } catch (err) {
      console.error(err);
      ErrorHandler(err);
    }
  };

  return (
    <Popconfirm
      title="¿Seguro que quieres eliminar este pedido?"
      onConfirm={handleDelete}
      okText="Sí"
      cancelText="No"
    >
      <Button danger size="small"
        style={{ borderRadius: 4, fontSize: 13, padding: '10px 8px' }}
      >Borrar</Button>
    </Popconfirm>
  );
};

export default DeleteButton;

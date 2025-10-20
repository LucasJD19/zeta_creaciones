// src/components/buttons/DeleteButton.jsx
import React from 'react';
import { Button, Popconfirm, message } from 'antd';
import AppRequest from '../../helpers/AppRequest';
import ErrorHandler from '../../helpers/ErrorHandler';

const DeleteButton = ({ recordId, onDeleted }) => {
  const handleDelete = async () => {
    try {
      await AppRequest.delete(`/pedidos/${recordId}`);
      message.success('Pedido eliminado');
      onDeleted(recordId);
    } catch (err) {
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
      <Button danger size="small">Borrar</Button>
    </Popconfirm>
  );
};

export default DeleteButton;

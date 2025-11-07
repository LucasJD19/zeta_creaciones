import React, { useState } from "react";
import { Button } from "antd";
import UpdatePedidoModal from "../updatePedidos/UpdatePedidoModal";


const EditButton = ({ record, onUpdated }) => {
  const [visible, setVisible] = useState(false);

  // Manejar el cierre del modal
  const handleClose = (recargar) => {
    setVisible(false);
    if (recargar) {
      // Si el modal retorna true, recargamos los datos actualizados
      onUpdated(record.id_pedido);
    }
  };

  return (
    <>
      <Button
        type="primary"
        size="small"
        style={{ backgroundColor: '#1677ff', borderRadius: 4, fontSize: 13, padding: '10px 8px' }}
        onClick={() => setVisible(true)}
      >
        Editar
      </Button>

      {/* Nuevo modal de actualización */}
      <UpdatePedidoModal
        visible={visible}
        onClose={handleClose}
        pedido={record}
      />
    </>
  );
};

export default EditButton;

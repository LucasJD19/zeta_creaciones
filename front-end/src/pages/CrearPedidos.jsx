// src/pages/CrearPedidos.jsx
import React from 'react';
import FormComponents from '../components/FormComponents';

const CrearPedidos = ({ pedidos, setPedidos }) => {
  return (
    <div>
      {/* Pasamos los props al form para que pueda actualizar el estado global */}
      <FormComponents pedidos={pedidos} setPedidos={setPedidos} />
    </div>
  );
};

export default CrearPedidos;

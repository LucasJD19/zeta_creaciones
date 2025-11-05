// src/pages/MisPedidos.jsx
import React from 'react';
import MostrarForm from '../components/MostrarForm';

const MisPedidos = ({ pedidos, setPedidos }) => {
  return (
    <div>
      <MostrarForm pedidos={pedidos} setPedidos={setPedidos} />
    </div>
  );
};

export default MisPedidos;
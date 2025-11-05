// src/layout/FooterBar.jsx
import React from 'react';

const FooterBar = () => (
  <footer
    style={{
      textAlign: 'center',
      background: 'transparent',
      padding: '16px'
    }}
  >
    © Gestión de Pedidos - Todos los derechos reservados {new Date().getFullYear()}
  </footer>
);

export default FooterBar;

// src/pages/Home.jsx
import React, { useEffect, useState } from "react";
import bienvenidaGif from "../../../assets/zetalogo5.gif";
import apiUsuarios from "../../../api/apiUsuarios";
import './home.css';

const Home = () => {
  const [usuario, setUsuario] = useState(null);

  useEffect(() => {
    const fetchUsuario = async () => {
      try {
        const data = await apiUsuarios.getMe();
        console.log("Usuario recibido del backend:", data);
        setUsuario(data);
      } catch (err) {
        console.error("Error al cargar usuario:", err);
      }
    };
    fetchUsuario();
  }, []);

  const rolTexto = (rol) => {
    switch (rol) {
      case 1: return "Administrador";
      case 2: return "Empleado";
      default: return "Usuario";
    }
  };

  return (
    <div className="home-container">
      {usuario ? (
        <div className="home-text">
          <h1>
            Bienvenido/a: <b>{usuario.nombre} {usuario.apellido}</b>
          </h1>
          <p>Rol: <b>{rolTexto(usuario.id_rol)}</b></p>
        </div>
      ) : (
        <h1>Cargando usuario...</h1>
      )}

      <div className="home-logo-container">
        <img src={bienvenidaGif} alt="Bienvenida" />
      </div>
    </div>
  );
};

export default Home;


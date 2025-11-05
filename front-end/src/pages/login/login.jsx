import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import wallpaper from "../../assets/wallpaper2_fondo.mp4";
import "./Login.css";
import AppRequest from "../../helpers/AppRequest";

const Login = () => {
  const [user, setUser] = useState("");
  const [pass, setPass] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const response = await AppRequest.post("/auth/login", {
        usuario: user,
        password: pass,
      });

      localStorage.setItem("token", response.token);
      localStorage.setItem("usuario", JSON.stringify(response.usuario));
      AppRequest.setAuthToken(response.token);

      navigate("/home");
    } catch (err) {
      setError(
        err.response?.data?.error || "Usuario o contraseña incorrectos"
      );
    }
  };

  return (
    <div className="login-viewport">
      {/* Video de fondo */}
      <video className="login-video" autoPlay muted loop>
        <source src={wallpaper} type="video/mp4" />
      </video>

      {/* Contenedor principal */}
      <div className="login-main">
        <h1>Sistema de <br />Gestión de Pedidos</h1>
        {error && <p className="error-message">{error}</p>}

        {/* Contenedor blanco del formulario */}
        <div className="login-form-container">
          <form onSubmit={handleSubmit} className="login-form">
            <label className="login-label">
              Usuario <span className="required">*</span>
            </label>
            <input
              type="text"
              className="loginForm-input"
              placeholder="Ingrese su usuario"
              value={user}
              onChange={(e) => setUser(e.target.value)}
              required
            />

            <label className="login-label">
              Contraseña <span className="required">*</span>
            </label>
            <input
              type="password"
              className="loginForm-input"
              placeholder="Ingrese su contraseña"
              value={pass}
              onChange={(e) => setPass(e.target.value)}
              required
            />

            <button type="submit" className="loginForm-button">
              Ingresar
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;

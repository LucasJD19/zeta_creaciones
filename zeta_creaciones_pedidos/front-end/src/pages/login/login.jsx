import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import wallpaper from "../../assets/login_fondo.mp4";
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
      const response = await AppRequest.post('/auth/login', {
        usuario: user,
        password: pass
      });
      
      // Guardar el token y datos del usuario en localStorage
      localStorage.setItem("token", response.token);
      localStorage.setItem("usuario", JSON.stringify(response.usuario));
      
      // Configurar el token para futuras peticiones
      AppRequest.setAuthToken(response.token);
      
      navigate("/home");
    } catch (err) {
      setError(err.response?.data?.error || "Error al iniciar sesión");
    }
  };

  return (
    <div className="login-container">
      <video autoPlay muted loop className="login-video">
        <source src={wallpaper} type="video/mp4" />
      </video>

      <div className="overlay"></div>

      <div className="login-form">
        <h2 className="text-white mb-4">Iniciar Sesión</h2>
        {error && <p className="text-danger">{error}</p>}
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <input
              type="text"
              className="form-control"
              placeholder="Usuario"
              value={user}
              onChange={(e) => setUser(e.target.value)}
            />
          </div>
          <div className="mb-3">
            <input
              type="password"
              className="form-control"
              placeholder="Contraseña"
              value={pass}
              onChange={(e) => setPass(e.target.value)}
            />
          </div>
          <button type="submit" className="btn btn-primary w-100">
            Entrar
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;

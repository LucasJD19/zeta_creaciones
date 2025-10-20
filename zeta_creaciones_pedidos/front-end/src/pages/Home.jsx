// src/pages/Home.jsx
import React from "react";
import bienvenidaGif from "../assets/zetalogo5.gif"; 

const Home = () => {
  return (
    <div style={{ textAlign: "center" }}>
      <h1>Bienvenido</h1>
      <img 
        src={bienvenidaGif} 
        alt="Bienvenida" 
        style={{ marginTop: "10px", width: "290px", borderRadius: "10px" }}
      />
    </div>
  );
};

export default Home;
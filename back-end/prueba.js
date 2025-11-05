import db from "./db/db.js";

// Consulta de prueba: traer todos los pedidos
const traerPedidos = () => {
  db.query("SELECT * FROM pedido", (err, results) => {
    if (err) {
      console.error("Error ejecutando la consulta:", err);
      process.exit(1);
    }

    console.log("Pedidos encontrados:", results);
    process.exit(0); 
  });
};

// Ejecutar la función
traerPedidos();

import express from "express";
import cors from "cors"; 
import db from "./db/db.js";
import { verificarToken, login } from './middleware/auth.js';
import metricasRoutes from "./routes/metricas.js";


const app = express();
app.use(express.json());

// Habilitar CORS para todas las rutas y orígenes
app.use(cors({
  origin: "http://localhost:3000", // frontend
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.get("/", (req, res) => {
  res.send("Servidor funcionando");
});

// Usar rutas de métricas
app.use("/metricas", metricasRoutes);

// Ruta de autenticación (sin token)
app.post("/auth/login", login);


// Middleware de autenticación para las rutas protegidas
app.use(verificarToken);

// Importar rutas
import pedidosRoutes from "./routes/pedidos.js";
import clientesRoutes from "./routes/clientes.js";
import proveedoresRoutes from "./routes/proveedores.js";
import productosRoutes from "./routes/productos.js";
import usuariosRoutes from "./routes/usuarios.js";
import pagosRoutes from "./routes/pagos.js";



// Usar rutas
app.use("/pedidos", pedidosRoutes);
app.use("/clientes", clientesRoutes);
app.use("/proveedores", proveedoresRoutes);
app.use("/productos", productosRoutes);
app.use("/usuarios", usuariosRoutes);
app.use("/pagos", pagosRoutes);


app.listen(3001, () => {
  console.log("Servidor corriendo en http://localhost:3001");
});

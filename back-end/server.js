// server.js
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import db from "./db/db.js";
import { verificarToken, login } from "./middleware/auth.js";

// Cargar variables de entorno (.env)
dotenv.config();

// Rutas normales
import metricasRoutes from "./routes/metricas.js";
import pedidosRoutes from "./routes/pedidos.js";
import clientesRoutes from "./routes/clientes.js";
import proveedoresRoutes from "./routes/proveedores.js";
import productosRoutes from "./routes/productos.js";
import usuariosRoutes from "./routes/usuarios.js";
import pagosRoutes from "./routes/pagos.js";

// IA: análisis automático
import metricasAIRoutes from "./routes/metricasAI.js"; // 👈 OJO: el archivo es AI, no IA

const app = express();
app.use(express.json());

// CORS
app.use(
  cors({
    origin: "http://localhost:3000",
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// Ruta base
app.get("/", (req, res) => {
  res.send("Servidor funcionando");
});

// Rutas públicas
app.use("/metricas", metricasRoutes);
app.use("/api/metricas", metricasAIRoutes); // 👈 Esta es la ruta del análisis con IA
app.post("/auth/login", login);

// Middleware de autenticación para rutas protegidas
app.use(verificarToken);

// Rutas protegidas
app.use("/pedidos", pedidosRoutes);
app.use("/clientes", clientesRoutes);
app.use("/proveedores", proveedoresRoutes);
app.use("/productos", productosRoutes);
app.use("/usuarios", usuariosRoutes);
app.use("/pagos", pagosRoutes);

app.listen(3001, () => {
  console.log("✅ Servidor corriendo en http://localhost:3001");
});

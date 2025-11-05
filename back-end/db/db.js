
import mysql from "mysql2";
import dotenv from "dotenv";

dotenv.config(); //cargar la variable del env

const db = mysql.createConnection({
  host: process.env.DB_HOST,    // localhost
  user: process.env.DB_USER,    // root
  password: process.env.DB_PASS,// LucasZottola120600
  database: process.env.DB_NAME // zeta_creaciones
});

db.connect((err) => {
  if (err) {
    console.error(" Error conectando a MySQL:", err);
    return;
  }
  console.log("Se ha creado la conexión exitósamente.");
});

export default db;
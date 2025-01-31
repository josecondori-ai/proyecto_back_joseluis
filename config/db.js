// backend/config/db.js
const mysql = require('mysql2/promise');
require('dotenv').config();

const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'datos_polizas',
  waitForConnections: true,
  connectionLimit: 10, // Evita saturación de conexiones
  queueLimit: 0
});

// Test de conexión
pool.getConnection()
  .then(connection => {
    console.log('✅ Conexión a la base de datos exitosa');
    connection.release(); // Liberar conexión
  })
  .catch(err => {
    console.error('❌ Error en la conexión a la base de datos:', err.message);
  });

module.exports = pool;

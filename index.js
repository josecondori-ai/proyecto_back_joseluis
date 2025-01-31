require('dotenv').config(); // Cargar variables de entorno
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const { 
    
    obtenerEstadisticasDesdeBD,
  
  } = require('./controllers/polizasControllers');
const app = express();
const port = process.env.PORT || 3000;

// Middlewares
app.use(cors({
    origin: "http://localhost:5173", // ⚠ Cambia según el puerto del frontend
    methods: "GET,POST",
    allowedHeaders: "Content-Type"
  }));
app.use(bodyParser.json());
app.use(express.json()); 
// Rutas
const polizasRoutes = require('./routes/polizasRoutes');
const authRoutes = require('./routes/authRoutes');

app.use('/api', polizasRoutes);
app.use('/api/auth', authRoutes);

app.get("/estadisticas/fecha", async (req, res) => {
  try {
      console.log("🛠️ Parámetros recibidos en el backend:", req.query);

      const fechaInicio = new Date(req.query.fechaInicio).toISOString().split("T")[0];
      const fechaFin = new Date(req.query.fechaFin).toISOString().split("T")[0];

      console.log("📆 Fechas procesadas:", fechaInicio, fechaFin);

      const datos = await obtenerEstadisticasDesdeBD(fechaInicio, fechaFin);
      console.log("📊 Datos obtenidos de la BD:", datos);

      res.status(200).json(datos);
  } catch (error) {
      console.error("❌ Error al obtener estadísticas:", error);
      res.status(500).json({ message: "Error en el servidor", error });
  }
});



  
// Ruta de prueba
app.get("/test", (req, res) => {
  res.json({ message: "Conexión exitosa con el backend" });
});

// Servidor
app.listen(port, () => {
  console.log(`🚀 Servidor corriendo en http://localhost:${port}`);
});


/*
Total de pólizas activas y anuladas.
http://localhost:3000/api/estadisticas
*/

/*Cantidad de pólizas por compañía.
http://localhost:3000/api/cantidad-polizas-compania
*/
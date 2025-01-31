const express = require('express');
const router = express.Router();
const { 
  getAllPolizas, 
  createPoliza, 
  getEstadisticasGenerales, 
  getEstadisticasPorFechas, 
  getCantidadPolizasPorCompania, 
  obtenerEstadisticasDesdeBD,
  obtenerPolizasFiltradas, 
  getPolizaById, 
  exportarReporte 
} = require('../controllers/polizasControllers'); // Verifica que las funciones están siendo importadas correctamente


const { Poliza } = require('../models/poliza');

router.get('/poliza-activa-anulada', getEstadisticasGenerales);



router.get('/estadisticas/fecha', obtenerEstadisticasDesdeBD);

router.get('/ver-todas-polizas', getAllPolizas);
router.get('/polizas/:id', getPolizaById);
router.get('/cantidad-polizas-compania', getCantidadPolizasPorCompania);
router.get('/filtrado',obtenerPolizasFiltradas)


router.post("/createpoliza", createPoliza);






module.exports = router;

const PDFDocument = require('pdfkit');
const ExcelJS = require('exceljs');
const pool = require('../config/db');
const { Poliza } = require('../models/poliza');


const getAllPolizas = async (req, res) => {
  try {
    const [polizas] = await pool.query('SELECT * FROM polizas');
    res.json(polizas);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener las pólizas' });
  }
};

const  insertPoliza  = require("../models/poliza"); // Asegúrate de que este modelo tiene la función correcta para la base de datos

const createPoliza = async (req, res) => {
    try {
        console.log("req.body:", req.body); // Depuración para ver el cuerpo de la solicitud

        const { id_compania, numero_poliza, fecha_emision, estado, prima, id_seccion } = req.body;
    
        if (!id_compania || !numero_poliza || !fecha_emision || !estado || !prima || !id_seccion) {
            return res.status(400).json({ message: "Todos los campos son obligatorios." });
        }

        // Llamamos a la función correcta que inserta los datos en la base de datos
        const result = await Poliza.insertPoliza({ id_compania, numero_poliza, fecha_emision, estado, prima, id_seccion });

        res.status(201).json({ message: "Póliza creada con éxito", id: result.insertId });
    } catch (error) {
        console.error("Error en createPoliza:", error);
        res.status(500).json({ message: "Error al crear la póliza", error: error.message });
    }
};

module.exports = { createPoliza };

const getCantidadPolizasPorCompania = async (req, res) => {
  try {
    const [result] = await pool.query(
      'SELECT companias.nombre AS nombre_compania, COUNT(*) AS total_policies FROM polizas INNER JOIN companias ON polizas.id_compania = companias.id GROUP BY polizas.id_compania'
    );
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener las estadísticas de pólizas por compañía' });
  }
};

const getEstadisticasGenerales = async (req, res) => {
  try {
    const [result] = await pool.query(
      `SELECT 
        SUM(CASE WHEN estado = 'activa' THEN 1 ELSE 0 END) AS total_activas,
        SUM(CASE WHEN estado = 'anulada' THEN 1 ELSE 0 END) AS total_anuladas
      FROM polizas`
    );
    res.json(result[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al obtener las estadísticas generales' });
  }
};

const getEstadisticasPorFechas = async (req, res) => {
  try {
    const { fechaInicio, fechaFin } = req.query;
    if (!fechaInicio || !fechaFin) {
      return res.status(400).json({ error: 'Se requieren fechaInicio y fechaFin' });
    }
    const estadisticas = await obtenerEstadisticasDesdeBD(fechaInicio, fechaFin);
    res.json(estadisticas);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al obtener estadísticas por fechas' });
  }

  //
};

//funcion de obtener datos
const obtenerEstadisticasDesdeBD = async (fechaInicio, fechaFin) => {
    fechaInicio = String(fechaInicio);
    fechaFin = String(fechaFin);

    console.log("🔍 Ejecutando consulta SQL con fechas:", fechaInicio, fechaFin);

    console.log("Valores recibidos en la consulta SQL:");
    console.log("Fecha Inicio:", fechaInicio, "Tipo:", typeof fechaInicio);
    console.log("Fecha Fin:", fechaFin, "Tipo:", typeof fechaFin);
    const query = `
      SELECT 
        c.nombre AS compania,
        s.nombre AS seccion,
        SUM(p.prima) AS prima_total
      FROM 
        polizas p
      JOIN 
        companias c ON p.id_compania = c.id
      JOIN 
        secciones s ON p.id_seccion = s.id
      WHERE 
        p.fecha_emision BETWEEN ? AND ?
      GROUP BY 
        c.nombre, s.nombre
      ORDER BY 
        c.nombre, s.nombre;
    `;
  
    const [resultados] = await pool.query(query, [fechaInicio, fechaFin]);
    return resultados;
  };

  const obtenerPolizasFiltradas = async (req, res) => {
    try {
      const filters = {
        id_compania: req.query.id_compania,
        estado: req.query.estado,
        fecha_inicio: req.query.fecha_inicio,
        fecha_fin: req.query.fecha_fin,
        id_seccion: req.query.id_seccion,
      };
  
      // Llamar a la función que construye y ejecuta la consulta SQL
      const polizas = await getPolizasFiltradas(filters);
      res.status(200).json(polizas);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Error al obtener pólizas filtradas', error });
    }
  };
  
  // Función para construir y ejecutar la consulta SQL
  const getPolizasFiltradas = async (filters) => {
    let query = 'SELECT * FROM polizas WHERE 1=1';
    const params = [];
  
    // Añadir filtros dinámicamente
    if (filters.id_compania) {
      query += ' AND id_compania = ?';
      params.push(filters.id_compania);
    }
    if (filters.estado) {
      query += ' AND estado = ?';
      params.push(filters.estado);
    }
    if (filters.fecha_inicio && filters.fecha_fin) {
      query += ' AND fecha_emision BETWEEN ? AND ?';
      params.push(
        new Date(filters.fecha_inicio).toISOString().split('T')[0],
        new Date(filters.fecha_fin).toISOString().split('T')[0]
      );
    }
    if (filters.id_seccion) {
      query += ' AND id_seccion = ?';
      params.push(filters.id_seccion);
    }
  
    // Depurar consulta SQL y parámetros
    console.log("Consulta SQL:", query);
    console.log("Parámetros:", params);
  
    // Ejecutar la consulta
    const [rows] = await pool.query(query, params);
    return rows;
  };
  

const getPolizaById = async (req, res) => {
    console.log('Request recibido:', req);
    console.log('Response recibido:', res);
  
    try {
      const { id } = req.params;
      console.log('Número de póliza recibido:', id);
      
      const [result] = await pool.query('SELECT * FROM polizas WHERE id = ?', [id]);
  
      if (result.length === 0) {
        return res.status(404).json({ mensaje: 'Póliza no encontrada' });
      }
  
      res.json(result[0]);
    } catch (error) {
      console.error('Error en getPolizaById:', error);
      res.status(500).json({ error: 'Error al obtener la póliza' });
    }
  };


const exportarReporte = async (req, res) => {
  try {
    const { tipo } = req.params;
    const [result] = await pool.query(
      'SELECT companias.nombre AS nombre_compania, polizas.estado, COUNT(*) AS total_policies, SUM(polizas.prima) AS total_prima FROM polizas INNER JOIN companias ON polizas.id_compania = companias.id GROUP BY polizas.id_compania, polizas.estado'
    );
    
    if (tipo === 'pdf') {
      generarPDF(result, res);
    } else if (tipo === 'excel') {
      generarExcel(result, res);
    } else {
      res.status(400).json({ error: 'Formato no soportado. Usa pdf o excel' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Error generando reporte' });
  }
};

module.exports = { 
    getAllPolizas, 
    createPoliza, 
    getEstadisticasPorFechas, // ✅ Esta sí está definida en este archivo
    getCantidadPolizasPorCompania, 
    getEstadisticasGenerales, 
    obtenerPolizasFiltradas, 
    getPolizaById, 
    exportarReporte,
    obtenerPolizasFiltradas,
    obtenerEstadisticasDesdeBD
  };
  
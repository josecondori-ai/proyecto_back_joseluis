const pool = require('../config/db');

const Poliza = {
  getAllPolizas: async () => {
    try {
      const query = `
        SELECT 
          p.id, 
          c.nombre AS compania, 
          p.numero_poliza, 
          p.fecha_emision, 
          p.estado, 
          p.prima, 
          s.nombre AS seccion
        FROM polizas p
        JOIN companias c ON p.id_compania = c.id
        JOIN secciones s ON p.id_seccion = s.id
      `;
      const [results] = await pool.query(query);
      return results;
    } catch (err) {
      throw err;
    }
  },

  insertPoliza: async (data) => {
    try {
      const { id_compania, numero_poliza, fecha_emision, estado, prima, id_seccion } = data;
      const query = `
        INSERT INTO polizas (id_compania, numero_poliza, fecha_emision, estado, prima, id_seccion) 
        VALUES (?, ?, ?, ?, ?, ?)`;
      const [results] = await pool.query(query, [id_compania, numero_poliza, fecha_emision, estado, prima, id_seccion]);
      return results;
    } catch (err) {
      throw err;
    }
  },

  getPolizaById: async (id) => {
    try {
      const query = `
        SELECT p.*, c.nombre AS nombre_compania, s.nombre AS nombre_seccion
        FROM polizas p
        JOIN companias c ON p.id_compania = c.id
        JOIN secciones s ON p.id_seccion = s.id
        WHERE p.id = ?`;
      const [results] = await pool.query(query, [id]);
      return results.length > 0 ? results[0] : null;
    } catch (err) {
      throw err;
    }
  },

  getEstadisticasGenerales: async () => {
    try {
      const query = `
        SELECT 
          SUM(CASE WHEN estado = 'activa' THEN 1 ELSE 0 END) AS total_activas,
          SUM(CASE WHEN estado = 'anulada' THEN 1 ELSE 0 END) AS total_anuladas
        FROM polizas`;
      const [results] = await pool.query(query);
      return results.length > 0 ? results[0] : { total_activas: 0, total_anuladas: 0 };
    } catch (err) {
      throw err;
    }
  },

  getCantidadPolizasPorCompania: async () => {
    try {
      const query = `
        SELECT c.nombre AS nombre_compania, COUNT(*) AS cantidad_polizas
        FROM polizas p
        JOIN companias c ON p.id_compania = c.id
        GROUP BY c.nombre`;
      const [results] = await pool.query(query);
      return results;
    } catch (err) {
      throw err;
    }
  },

  getEstadisticasPorFechas: async (fechaInicio, fechaFin) => {
    try {
      const query = `
        SELECT 
          c.nombre AS nombre_compania, 
          s.nombre AS nombre_seccion, 
          SUM(p.prima) AS total_prima
        FROM polizas p
        JOIN companias c ON p.id_compania = c.id
        JOIN secciones s ON p.id_seccion = s.id
        WHERE p.fecha_emision BETWEEN ? AND ?
        GROUP BY c.nombre, s.nombre`;
      
      const [results] = await pool.query(query, [fechaInicio, fechaFin]);
      return results;
    } catch (err) {
      throw err;
    }
  },

  getPolizasFiltradas: async (filters) => {
    try {
      let query = "SELECT * FROM polizas WHERE 1=1";
      let values = [];
  
      if (filters.id_compania) {
        query += " AND id_compania = ?";
        values.push(filters.id_compania);
      }
      if (filters.estado) {
        query += " AND estado = ?";
        values.push(filters.estado);
      }
      if (filters.fecha_inicio && filters.fecha_fin) {
        query += " AND fecha_emision BETWEEN ? AND ?";
        values.push(filters.fecha_inicio, filters.fecha_fin);
      }
      if (filters.id_seccion) {
        query += " AND id_seccion = ?";
        values.push(filters.id_seccion);
      }
  
      const [rows] = await pool.query(query, values);
      return rows;
    } catch (error) {
      throw error;
    }
  }
};

module.exports = { Poliza };

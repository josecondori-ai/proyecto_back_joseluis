const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { validationResult } = require('express-validator');
const pool = require('../config/db') // Conexión a la base de datos


// Función para login
exports.login = async (req, res) => {
    const { email, password } = req.body;

    try {
        // Validar errores del request
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        // Buscar usuario en la base de datos
        const query = 'SELECT * FROM usuarios WHERE email = ?';
        const [rows] = await pool.query(query, [email]);

        if (rows.length === 0) {
            return res.status(401).json({ error: 'Credenciales inválidas' });
        }

        const usuario = rows[0];

        // Comparar contraseña encriptada
        const esValido = await bcrypt.compare(password, usuario.password);
        if (!esValido) {
            return res.status(401).json({ error: 'Credenciales inválidas' });
        }

        // Generar token JWT
        const token = jwt.sign({ id: usuario.id, email: usuario.email }, 'secreto_jwt', { expiresIn: '2h' });

        // Enviar el token al frontend
        res.json({
            token,
            user: {
                id: usuario.id,
                email: usuario.email,
                nombre: usuario.nombre
            }
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error en el servidor' });
    }
};



exports.registrar = async (req, res) => {
    const { email, password, nombre } = req.body;

    try {
        // Validar errores del request
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        // Verificar si el correo ya existe
        const query = 'SELECT * FROM usuarios WHERE email = ?';
        const [rows] = await pool.query(query, [email]);

        if (rows.length > 0) {
            return res.status(400).json({ error: 'El correo electrónico ya está registrado' });
        }

        // Encriptar la contraseña
        const hashedPassword = await bcrypt.hash(password, 10);

        // Insertar el nuevo usuario en la base de datos
        const insertQuery = 'INSERT INTO usuarios (email, password, nombre) VALUES (?, ?, ?)';
        await pool.query(insertQuery, [email, hashedPassword, nombre]);

        res.status(201).json({ message: 'Usuario registrado con éxito' });

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error en el servidor' });
    }
};
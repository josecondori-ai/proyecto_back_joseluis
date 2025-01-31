const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    const token = req.header('Authorization');

    if (!token) {
        return res.status(401).json({ error: 'Acceso denegado. No hay token.' });
    }

    try {
        const verificado = jwt.verify(token.replace('Bearer ', ''), 'secreto_jwt');
        req.usuario = verificado; // Guardar usuario en el request
        next();
    } catch (error) {
        res.status(401).json({ error: 'Token no válido.' });
    }
};

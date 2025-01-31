const express = require('express');
const router = express.Router();
const authController = require('../controllers/authControllers');
const { body } = require('express-validator');

router.post(
    '/login',
    [
        body('email').isEmail().withMessage('Debe ser un email válido'),
        body('password').notEmpty().withMessage('La contraseña es obligatoria'),
    ],
    authController.login
);

router.post(
    '/register',
    [
        body('email').isEmail().withMessage('Debe ser un email válido'),
        body('password').notEmpty().withMessage('La contraseña es obligatoria'),
        body('nombre').notEmpty().withMessage('El nombre es obligatorio'),
    ],
    authController.registrar
);

module.exports = router;

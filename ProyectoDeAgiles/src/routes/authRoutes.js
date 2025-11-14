const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { 
  registerValidation, 
  loginValidation, 
  handleValidationErrors 
} = require('../middlewares/validators');

/**
 * @route   POST /api/auth/register
 * @desc    Registrar nuevo usuario (HU1)
 * @access  Public
 */
router.post(
  '/register',
  registerValidation,
  handleValidationErrors,
  authController.register
);

/**
 * @route   POST /api/auth/login
 * @desc    Iniciar sesión (HU2)
 * @access  Public
 */
router.post(
  '/login',
  loginValidation,
  handleValidationErrors,
  authController.login
);

/**
 * @route   GET /api/auth/users
 * @desc    Obtener todos los usuarios (solo desarrollo)
 * @access  Public
 */
router.get('/users', authController.getAllUsers);

module.exports = router;
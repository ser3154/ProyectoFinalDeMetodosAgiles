const { body, validationResult } = require('express-validator');

/**
 * Validación para registro de usuario
 * Criterio: La contraseña debe tener mínimo 8 caracteres, incluir mayúsculas, minúsculas y números
 */
const registerValidation = [
  body('email')
    .isEmail()
    .withMessage('Debe proporcionar un correo electrónico válido')
    .normalizeEmail(),
  
  body('password')
    .isLength({ min: 8 })
    .withMessage('La contraseña debe tener al menos 8 caracteres')
    .matches(/[A-Z]/)
    .withMessage('La contraseña debe incluir al menos una letra mayúscula')
    .matches(/[a-z]/)
    .withMessage('La contraseña debe incluir al menos una letra minúscula')
    .matches(/[0-9]/)
    .withMessage('La contraseña debe incluir al menos un número'),
  
  body('confirmPassword')
    .custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new Error('Las contraseñas no coinciden');
      }
      return true;
    }),

  body('role')
    .optional()
    .isIn(['visitante', 'proveedor'])
    .withMessage('El rol debe ser "visitante" o "proveedor"')
];

/**
 * Validación para login
 */
const loginValidation = [
  body('email')
    .isEmail()
    .withMessage('Debe proporcionar un correo electrónico válido')
    .normalizeEmail(),
  
  body('password')
    .notEmpty()
    .withMessage('La contraseña es obligatoria')
];

/**
 * Middleware para manejar errores de validación
 */
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Errores de validación',
      errors: errors.array().map(error => ({
        field: error.path,
        message: error.msg
      }))
    });
  }
  
  next();
};

module.exports = {
  registerValidation,
  loginValidation,
  handleValidationErrors
};
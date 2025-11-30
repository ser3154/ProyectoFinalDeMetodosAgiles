const { body, validationResult } = require("express-validator");

const reservaValidator = [
  body("experienciaId")
    .notEmpty()
    .withMessage("El ID de la experiencia es obligatorio"),

  body("numPersonas")
    .notEmpty()
    .withMessage("El número de personas es obligatorio")
    .isInt({ min: 1 })
    .withMessage("Debe ser al menos 1 persona"),

  body("usuario.nombre")
    .notEmpty()
    .withMessage("El nombre del usuario es obligatorio"),

  body("usuario.email")
    .isEmail()
    .withMessage("Email inválido"),

  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }
    next();
  },
];

module.exports = reservaValidator;
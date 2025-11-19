const { body, validationResult } = require("express-validator");

const experienciaValidator = [
  body("nombre").notEmpty().withMessage("El nombre es obligatorio"),

  body("descripcion").notEmpty().withMessage("La descripción es obligatoria"),

  body("precio")
    .notEmpty()
    .withMessage("El precio es obligatorio")
    .isFloat({ min: 0 })
    .withMessage("El precio debe ser un número válido y mayor o igual a 0"),

  body("fecha")
    .notEmpty()
    .withMessage("La fecha es obligatoria")
    .isISO8601()
    .withMessage("La fecha debe ser válida"),

  body("ubicacion").notEmpty().withMessage("La ubicación es obligatoria"),

  body("cupo")
    .notEmpty()
    .withMessage("El cupo es obligatorio")
    .isInt({ min: 1 })
    .withMessage("El cupo debe ser un número entero mayor a 0"),

  body("estado")
    .optional()
    .isIn(["APROBADA", "REVISION_PENDIENTE"])
    .withMessage("Estado inválido"),

  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const files = req.files || [];

    if (files.length > 3) {
      return res.status(400).json({
        errors: [{ msg: "Solo se permiten hasta 3 imágenes" }],
      });
    }

    for (const file of files) {
      if (file.size > 5 * 1024 * 1024) {
        return res.status(400).json({
          errors: [
            { msg: `La imagen ${file.originalname} excede los 5MB permitidos` },
          ],
        });
      }
    }

    next();
  },
];

module.exports = experienciaValidator;

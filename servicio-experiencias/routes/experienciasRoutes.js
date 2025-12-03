const express = require("express");
const router = express.Router();

const upload = require("../middleware/upload");
const experienciaController = require("../controllers/experienciaController");
const experienciaValidator = require("../middleware/validators");

/**
 * @route   POST /api/experiencias/registrar
 * @desc    Crear una nueva experiencia
 * @access  Private (solo proveedores)
 */
router.post(
  "/registrar",
  upload.array("fotos", 3),
  experienciaValidator,
  experienciaController.registrarExperiencia,
);

/**
 * @route   GET /api/experiencias/all
 * @desc    Obtener todas las experiencias
 * @access  Public
 */
router.get("/all", experienciaController.getExperiencias);

/**
 * @route   GET /api/experiencias/encontrar
 * @desc    Obtener una experiencia por su nombre y fecha
 * @access  Public
 */
router.get("/encontrar", experienciaController.getExperiencia);

/**
 * @route   GET /api/experiencias/mis-experiencias
 * @desc    Obtener todas las experiencias de un proveedor
 * @access  Public
 */
router.get(
  "/mis-experiencias",
  experienciaController.getExperienciasPorProveedor,
);

module.exports = router;

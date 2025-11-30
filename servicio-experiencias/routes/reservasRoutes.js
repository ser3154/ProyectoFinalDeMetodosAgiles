const express = require("express");
const router = express.Router();
const reservaController = require("../controllers/reservaController");

/**
 * @route   POST /api/reservas
 * @desc    Crear una nueva reserva
 * @access  Public (requeriría autenticación en producción)
 */
router.post("/", reservaController.crearReserva);

/**
 * @route   GET /api/reservas/:numeroConfirmacion
 * @desc    Obtener detalles de una reserva
 * @access  Public
 */
router.get("/:numeroConfirmacion", reservaController.obtenerReserva);

module.exports = router;
const express = require("express");
const router = express.Router();
const reservaController = require("../controllers/reservaController");

/**
 * @route   POST /api/reservas/crear
 * @desc    Crea una nueva reserva (recibe datos del visitante en body)
 */
router.post("/crear", reservaController.crearReserva);

/**
 * @route   GET /api/reservas/mis-reservas
 * @desc    Obtiene reservas de un proveedor
 */
router.get("/mis-reservas", reservaController.getReservasPorProveedor);

module.exports = router;

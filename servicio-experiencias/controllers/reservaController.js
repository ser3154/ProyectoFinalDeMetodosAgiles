const Reserva = require("../models/Reserva");
const Experiencia = require("../models/Experiencia");

// Generar número de confirmación único
function generarNumeroConfirmacion() {
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = Math.random().toString(36).substring(2, 8).toUpperCase();
  return `EXP-${timestamp}-${random}`;
}

const crearReserva = async (req, res) => {
  try {
    const { experienciaId, numPersonas, usuario } = req.body;

    // Buscar la experiencia
    const experiencia = await Experiencia.findById(experienciaId);
    
    if (!experiencia) {
      return res.status(404).json({
        success: false,
        message: "Experiencia no encontrada"
      });
    }

    // Verificar cupos disponibles
    if (experiencia.cupo < numPersonas) {
      return res.status(400).json({
        success: false,
        message: "No hay suficientes cupos disponibles"
      });
    }

    // Calcular precio total
    const precioTotal = experiencia.precio * numPersonas;

    // Generar número de confirmación
    const numeroConfirmacion = generarNumeroConfirmacion();

    // Crear la reserva
    const reserva = new Reserva({
      experiencia: experienciaId,
      usuario: {
        nombre: usuario.nombre,
        email: usuario.email
      },
      fecha: experiencia.fecha,
      numPersonas,
      precioTotal,
      numeroConfirmacion,
      proveedor: {
        nombre: experiencia.proveedor?.nombre || "Proveedor",
        email: experiencia.proveedor?.email || ""
      }
    });

    await reserva.save();

    // Actualizar cupos de la experiencia
    experiencia.cupo -= numPersonas;
    await experiencia.save();

    // En producción, aquí enviarías el email
    // await enviarEmailConfirmacion(reserva);

    res.status(201).json({
      success: true,
      message: "Reserva creada exitosamente",
      data: {
        numeroConfirmacion: reserva.numeroConfirmacion,
        experiencia: {
          nombre: experiencia.nombre,
          fecha: experiencia.fecha,
          ubicacion: experiencia.ubicacion
        },
        numPersonas: reserva.numPersonas,
        precioTotal: reserva.precioTotal,
        usuario: reserva.usuario
      }
    });

  } catch (error) {
    console.error("Error al crear reserva:", error);
    res.status(500).json({
      success: false,
      message: "Error interno del servidor"
    });
  }
};

const obtenerReserva = async (req, res) => {
  try {
    const { numeroConfirmacion } = req.params;

    const reserva = await Reserva.findOne({ numeroConfirmacion })
      .populate("experiencia");

    if (!reserva) {
      return res.status(404).json({
        success: false,
        message: "Reserva no encontrada"
      });
    }

    res.json({
      success: true,
      data: reserva
    });

  } catch (error) {
    console.error("Error al obtener reserva:", error);
    res.status(500).json({
      success: false,
      message: "Error interno del servidor"
    });
  }
};

module.exports = {
  crearReserva,
  obtenerReserva
};
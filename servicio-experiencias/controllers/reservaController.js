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

    const experiencia = await Experiencia.findById(experienciaId);
    
    if (!experiencia) {
      return res.status(404).json({
        success: false,
        message: "Experiencia no encontrada"
      });
    }

    if (experiencia.cupo < numPersonas) {
      return res.status(400).json({
        success: false,
        message: "No hay suficientes cupos disponibles"
      });
    }

    const precioTotal = experiencia.precio * numPersonas;
    const numeroConfirmacion = generarNumeroConfirmacion();

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

    experiencia.cupo -= numPersonas;
    await experiencia.save();

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

// NUEVA FUNCIONALIDAD: HU14 - Cancelar Reserva
const cancelarReserva = async (req, res) => {
  try {
    const { numeroConfirmacion } = req.params;

    // Buscar la reserva
    const reserva = await Reserva.findOne({ numeroConfirmacion })
      .populate("experiencia");

    if (!reserva) {
      return res.status(404).json({
        success: false,
        message: "Reserva no encontrada"
      });
    }

    // VALIDACIÓN: Solo se pueden cancelar reservas con estado "CONFIRMADA"
    if (reserva.estado !== "CONFIRMADA") {
      return res.status(400).json({
        success: false,
        message: `No se puede cancelar una reserva con estado "${reserva.estado}". Solo se pueden cancelar reservas confirmadas.`
      });
    }

    // Calcular tiempo hasta la experiencia
    const fechaExperiencia = new Date(reserva.fecha);
    const ahora = new Date();
    const horasRestantes = (fechaExperiencia - ahora) / (1000 * 60 * 60);

    // Política de cancelación: con más de 48 horas = reembolso 100%, menos = 50%
    let porcentajeReembolso = 100;
    if (horasRestantes < 48) {
      porcentajeReembolso = 50;
    }

    const montoReembolso = (reserva.precioTotal * porcentajeReembolso) / 100;

    // Actualizar estado de la reserva
    reserva.estado = "CANCELADA";
    await reserva.save();

    // Liberar cupos en la experiencia
    const experiencia = await Experiencia.findById(reserva.experiencia);
    if (experiencia) {
      experiencia.cupo += reserva.numPersonas;
      await experiencia.save();
    }

    res.json({
      success: true,
      message: "Reserva cancelada exitosamente",
      data: {
        numeroConfirmacion: reserva.numeroConfirmacion,
        estado: reserva.estado,
        porcentajeReembolso,
        montoReembolso,
        cuposLiberados: reserva.numPersonas
      }
    });

  } catch (error) {
    console.error("Error al cancelar reserva:", error);
    res.status(500).json({
      success: false,
      message: "Error interno del servidor"
    });
  }
};

module.exports = {
  crearReserva,
  obtenerReserva,
  cancelarReserva
};
const Reserva = require("../models/Reserva");
const Experiencia = require("../models/Experiencia");

const crearReserva = async (req, res) => {
  try {
    const {
      experienciaId,
      cantidadPersonas,
      visitanteId,
      nombreVisitante,
      emailVisitante,
    } = req.body;

    if (!experienciaId || !cantidadPersonas || !visitanteId) {
      return res.status(400).json({
        success: false,
        message: "Faltan datos obligatorios",
      });
    }

    const experiencia = await Experiencia.findById(experienciaId);

    if (!experiencia) {
      return res
        .status(404)
        .json({ success: false, message: "Experiencia no encontrada" });
    }

    if (experiencia.cupo < cantidadPersonas) {
      return res.status(400).json({
        success: false,
        message: `Ups, no hay suficiente espacio. Solo quedan ${experiencia.cupo} lugares.`,
      });
    }

    const nuevaReserva = new Reserva({
      experienciaId: experiencia._id,
      nombreExperiencia: experiencia.nombre,
      precioPagado: experiencia.precio,
      fechaExperiencia: experiencia.fecha,
      ubicacionExperiencia: experiencia.ubicacion,

      visitanteId: visitanteId,
      nombreVisitante: nombreVisitante,
      emailVisitante: emailVisitante,

      proveedorId: experiencia.proveedorId.toString(),

      cantidadPersonas: Number(cantidadPersonas),
      totalCompra: experiencia.precio * Number(cantidadPersonas),
      estado: "CONFIRMADA",
    });

    await nuevaReserva.save();

    experiencia.cupo -= Number(cantidadPersonas);
    await experiencia.save();

    res.status(201).json({
      success: true,
      message: "¡Reserva creada con éxito!",
      data: nuevaReserva,
    });
  } catch (error) {
    console.error("Error creando reserva:", error);
    res
      .status(500)
      .json({ success: false, message: "Error interno del servidor" });
  }
};

const getReservasPorProveedor = async (req, res) => {
  try {
    const { proveedorId, estado, fechaInicio, experienciaId } = req.query;

    if (!proveedorId) {
      return res.status(400).json({
        success: false,
        message: "Necesita indicar el proveedor a buscar.",
      });
    }

    let filtros = { proveedorId: proveedorId };

    if (estado) {
      filtros.estado = estado;
    }

    if (fechaInicio) {
      filtros.fechaExperiencia = { $gte: new Date(fechaInicio) };
    }

    if (experienciaId) {
      filtros.experienciaId = experienciaId;
    }

    const reservas = await Reserva.find(filtros).sort({ createdAt: -1 });

    res.json({
      success: true,
      count: reservas.length,
      data: reservas,
    });
  } catch (error) {
    console.error("Error obteniendo reservas:", error);
    res
      .status(500)
      .json({ success: false, message: "Error interno del servidor" });
  }
};

module.exports = {
  crearReserva,
  getReservasPorProveedor,
};

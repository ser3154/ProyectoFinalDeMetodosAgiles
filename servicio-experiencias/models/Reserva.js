const mongoose = require("mongoose");

const reservaSchema = new mongoose.Schema(
  {
    experienciaId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Experiencia",
      required: true,
    },
    nombreExperiencia: String,
    precioPagado: Number,
    fechaExperiencia: Date,
    ubicacionExperiencia: String,

    visitanteId: {
      type: String,
      required: true,
    },
    nombreVisitante: String,
    emailVisitante: String,

    proveedorId: {
      type: String,
      required: true,
      index: true,
    },

    cantidadPersonas: {
      type: Number,
      required: true,
    },

    totalCompra: Number,

    estado: {
      type: String,
      enum: ["CONFIRMADA", "CANCELADA", "COMPLETADA"],
      default: "CONFIRMADA",
    },
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.model("Reserva", reservaSchema);

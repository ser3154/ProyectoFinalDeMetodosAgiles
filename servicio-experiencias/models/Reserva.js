const mongoose = require("mongoose");

const reservaSchema = new mongoose.Schema({
  experiencia: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Experiencia",
    required: true
  },
  
  usuario: {
    nombre: { type: String, required: true },
    email: { type: String, required: true }
  },
  
  fecha: {
    type: Date,
    required: true
  },
  
  numPersonas: {
    type: Number,
    required: true,
    min: 1
  },
  
  precioTotal: {
    type: Number,
    required: true
  },
  
  numeroConfirmacion: {
    type: String,
    required: true,
    unique: true
  },
  
  estado: {
    type: String,
    enum: ["CONFIRMADA", "CANCELADA", "COMPLETADA"],
    default: "CONFIRMADA"
  },
  
  proveedor: {
    nombre: String,
    email: String
  }
  
}, {
  timestamps: true
});

module.exports = mongoose.model("Reserva", reservaSchema);
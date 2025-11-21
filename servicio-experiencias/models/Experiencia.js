const mongoose = require("mongoose");

const experienciaSchema = new mongoose.Schema({
  nombre: {
    type: String,
    required: [true, "El nombre es obligatorio"],
    trim: true,
    minlength: [3, "El nombre debe tener al menos 3 caracteres"],
  },

  descripcion: {
    type: String,
    required: [true, "La descripción es obligatoria"],
    minlength: [10, "La descripción debe tener al menos 10 caracteres"],
  },

  precio: {
    type: Number,
    required: [true, "El precio es obligatorio"],
    min: [0, "El precio no puede ser negativo"],
  },

  fecha: {
    type: Date,
    required: [true, "La fecha es obligatoria"],
  },

  ubicacion: {
    type: String,
    required: [true, "La ubicación es obligatoria"],
  },

  cupo: {
    type: Number,
    required: [true, "El cupo es obligatorio"],
    min: [1, "El cupo debe ser al menos 1"],
  },

  estado: {
    type: String,
    enum: ["APROBADA", "REVISION_PENDIENTE"],
    default: "REVISION_PENDIENTE",
  },

  fotos: {
    type: [String],
    validate: [(array) => array.length <= 3, "Máximo 3 imágenes permitidas"],
  },
});

module.exports = mongoose.model("Experiencia", experienciaSchema);

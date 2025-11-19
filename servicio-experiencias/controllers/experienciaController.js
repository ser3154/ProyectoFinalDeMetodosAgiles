const Experiencia = require("../models/Experiencia");

const registrarExperiencia = async (req, res) => {
  try {
    const rutasImagenes = req.files ? req.files.map((file) => file.path) : [];
    console.log(JSON.stringify(req.body, null, 2));
    const experiencia = new Experiencia({
      nombre: req.body.nombre,
      descripcion: req.body.descripcion,
      precio: req.body.precio,
      fecha: req.body.fecha,
      ubicacion: req.body.ubicacion,
      cupo: req.body.cupo,
      estado: req.body.estado,
      fotos: rutasImagenes,
    });

    await experiencia.save();

    res.status(201).json({
      success: true,
      message: "Experiencia creada correctamente",
      data: experiencia,
    });
  } catch (error) {
    console.error("Error al crear experiencia:", error);
    res.status(500).json({
      success: false,
      message: "Error interno del servidor",
    });
  }
};

const getExperiencias = async (req, res) => {
  try {
    const experiencias = await Experiencia.find({});

    res.json({
      success: true,
      data: experiencias,
    });
  } catch (error) {
    console.error("Error al obtener experiencias:", error);
    res.status(500).json({
      success: false,
      message: "Error interno del servidor",
    });
  }
};

module.exports = {
  registrarExperiencia,
  getExperiencias,
};

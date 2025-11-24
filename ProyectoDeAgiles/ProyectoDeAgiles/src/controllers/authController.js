const jwt = require('jsonwebtoken');
const User = require('../models/User');

/**
 * Registrar nuevo usuario - HU1
 */
const register = async (req, res) => {
  try {
    const { email, password, role = 'visitante', nombre } = req.body;

    // SUBTAREA 3: Validar que el correo no esté registrado
    const existingUser = await User.findOne({ email });
    
    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: 'El correo electrónico ya está registrado'
      });
    }

    // Crear usuario
    const user = new User({
      email,
      password,
      role,
      nombre
    });

    await user.save();

    res.status(201).json({
      success: true,
      message: 'Usuario registrado exitosamente.',
      data: {
        id: user._id,
        email: user.email,
        role: user.role,
        nombre: user.nombre
      }
    });

  } catch (error) {
    console.error('Error en registro:', error);
    res.status(500).json({
      success: false,
      message: 'Error al registrar usuario',
      error: error.message
    });
  }
};

/**
 * Iniciar sesión - HU2
 */
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Credenciales inválidas'
      });
    }

    const isPasswordValid = await user.comparePassword(password);

    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'Credenciales inválidas'
      });
    }

    if (!user.is_active) {
      return res.status(403).json({
        success: false,
        message: 'Tu cuenta ha sido desactivada'
      });
    }

    const token = jwt.sign(
      { 
        id: user._id, 
        email: user.email, 
        role: user.role 
      },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRE }
    );

    res.status(200).json({
      success: true,
      message: 'Inicio de sesión exitoso',
      data: {
        user: {
          id: user._id,
          email: user.email,
          role: user.role,
          nombre: user.nombre
        },
        token
      }
    });

  } catch (error) {
    console.error('Error en login:', error);
    res.status(500).json({
      success: false,
      message: 'Error al iniciar sesión',
      error: error.message
    });
  }
};

/**
 * Obtener perfil del usuario autenticado
 */
const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Usuario no encontrado'
      });
    }

    res.status(200).json({
      success: true,
      data: user
    });

  } catch (error) {
    console.error('Error al obtener perfil:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener perfil',
      error: error.message
    });
  }
};

/**
 * Obtener todos los usuarios (solo para desarrollo/testing)
 */
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find()
      .select('-password') // No incluir contraseñas
      .sort({ createdAt: -1 }); // Más recientes primero

    res.status(200).json({
      success: true,
      count: users.length,
      data: users
    });

  } catch (error) {
    console.error('Error al obtener usuarios:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener usuarios',
      error: error.message
    });
  }
};

module.exports = {
  register,
  login,
  getProfile,
  getAllUsers
};
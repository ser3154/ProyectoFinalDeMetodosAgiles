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

    // ver si esta bloqueado
    if (user.isLocked()) {
      const minutosRestantes = Math.ceil((user.lockUntil - Date.now()) / 60000);
      return res.status(403).json({
        success: false,
        message: `Cuenta bloqueada temporalmente. Intenta de nuevo en ${minutosRestantes} minutos.`
      });
    }

    const isPasswordValid = await user.comparePassword(password);

    // intentos
    if (!isPasswordValid) {
      user.failedAttempts += 1;

      // Máximo 3 intentos fallidos antes de bloqueo temporal (15 minutos)
      if (user.failedAttempts >= 3) {
        user.lockUntil = new Date(Date.now() + 15 * 60 * 1000); // 15 minutos
        await user.save();

        return res.status(403).json({
          success: false,
          message: 'Demasiados intentos fallidos. Cuenta bloqueada por 15 minutos.'
        });
      }

      await user.save();

      return res.status(401).json({
        success: false,
        message: 'Credenciales inválidas'
      });
    }

    // borrar contador con login correcto
    user.failedAttempts = 0;
    user.lockUntil = null;
    await user.save();

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

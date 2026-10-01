const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('../config');
const { User } = require('../models/UserModel');

function usuarioPublico(usuario) {
  return {
    id: usuario.id,
    perfil_id: usuario.perfil_id,
    nombre: usuario.nombre,
    apellidos: usuario.apellidos,
    nick: usuario.nick,
    correo: usuario.correo
  };
}

async function login(request, response) {
  try {
    const usuario = await User.findOne({
      where: {
        correo: request.body.correo,
        activo: true
      }
    });

    const credencialesCorrectas =
      usuario &&
      (await bcrypt.compare(request.body.contrasena, usuario.contrasena));

    if (!credencialesCorrectas) {
      return response.status(401).json({ mensaje: 'Sin autorización' });
    }

    const datosUsuario = usuarioPublico(usuario);
    const token = jwt.sign(
      { usuario: datosUsuario },
      config.jwtSecret,
      { expiresIn: '24h' }
    );

    return response.status(201).json({
      mensaje: 'Login con éxito',
      token,
      usuario: datosUsuario
    });
  } catch (error) {
    console.error('Error iniciando sesión:', error.message);
    return response.status(500).json({ mensaje: 'Error al iniciar sesión' });
  }
}

async function register(request, response) {
  try {
    const contrasena = await bcrypt.hash(request.body.contrasena, 12);
    const usuario = await User.create({
      perfil_id: 2,
      nombre: request.body.nombre,
      apellidos: request.body.apellidos,
      nick: request.body.nick,
      correo: request.body.correo,
      contrasena,
      activo: true
    });

    return response.status(201).json(usuarioPublico(usuario));
  } catch (error) {
    console.error('Error registrando usuario:', error.message);
    return response.status(500).json({ mensaje: 'Error al registrar el usuario' });
  }
}

module.exports = { login, register };

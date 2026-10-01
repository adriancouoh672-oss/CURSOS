const jwt = require('jsonwebtoken');
const config = require('../config');

function leerToken(request) {
  const authorization = request.headers.authorization;
  const coincidencia =
    typeof authorization === 'string'
      ? authorization.match(/^Bearer\s+(.+)$/i)
      : null;

  return coincidencia ? coincidencia[1] : null;
}

function authenticateAny(request, response, next) {
  const token = leerToken(request);

  if (!token) {
    return response.status(401).json({ mensaje: 'No se proporcionó un token' });
  }

  try {
    const contenido = jwt.verify(token, config.jwtSecret, {
      algorithms: ['HS256']
    });
    request.usuario = contenido.usuario;
    return next();
  } catch (error) {
    return response.status(403).json({ mensaje: 'Sin autorización' });
  }
}

function authenticateAdmin(request, response, next) {
  return authenticateAny(request, response, () => {
    if (request.usuario?.perfil_id !== 1) {
      return response.status(403).json({ mensaje: 'Sin autorización' });
    }

    return next();
  });
}

module.exports = { authenticateAdmin, authenticateAny };

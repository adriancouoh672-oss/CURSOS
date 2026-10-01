const { validationResult } = require('express-validator');

function validarSolicitud(request, response, next) {
  const resultado = validationResult(request);

  if (!resultado.isEmpty()) {
    return response.status(422).json({
      mensaje: 'La solicitud contiene datos inválidos',
      errores: resultado.array()
    });
  }

  return next();
}

module.exports = { validarSolicitud };

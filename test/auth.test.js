const test = require('node:test');
const assert = require('node:assert/strict');
const jwt = require('jsonwebtoken');
const { app } = require('../app');
const config = require('../config');
const { connection } = require('../config.db');
const { Profile, User } = require('../models');

test('el registro y login del punto 8.2 generan un JWT válido', async (t) => {
  await connection.authenticate();

  let perfil = await Profile.findByPk(2);
  const perfilCreadoPorPrueba = !perfil;
  if (!perfil) {
    perfil = await Profile.create({ id: 2, nombre: 'Contribuidor' });
  }

  const servidor = app.listen(0);
  await new Promise((resolve) => servidor.once('listening', resolve));

  let usuarioId;
  t.after(async () => {
    if (usuarioId) await User.destroy({ where: { id: usuarioId } });
    if (perfilCreadoPorPrueba) await Profile.destroy({ where: { id: perfil.id } });
    await new Promise((resolve) => servidor.close(resolve));
    await connection.close();
  });

  const { port } = servidor.address();
  const baseUrl = `http://127.0.0.1:${port}/api/auth`;
  const marca = `${Date.now()}-${Math.random().toString(16).slice(2)}`;

  async function post(ruta, datos) {
    const respuesta = await fetch(`${baseUrl}${ruta}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(datos)
    });
    return { respuesta, cuerpo: await respuesta.json() };
  }

  const datosRegistro = {
    nombre: 'Contribuidor',
    apellidos: 'De prueba',
    nick: `c${marca.slice(-10)}`,
    correo: `${marca}@example.com`,
    contrasena: 'clave-segura-123',
    perfil_id: 999
  };

  const registro = await post('/registro', datosRegistro);
  assert.equal(registro.respuesta.status, 201);
  assert.equal(registro.cuerpo.perfil_id, 2);
  assert.equal(Object.hasOwn(registro.cuerpo, 'contrasena'), false);
  usuarioId = registro.cuerpo.id;

  const accesoDenegado = await post('/login', {
    correo: datosRegistro.correo,
    contrasena: 'clave-incorrecta'
  });
  assert.equal(accesoDenegado.respuesta.status, 401);

  const acceso = await post('/login', {
    correo: datosRegistro.correo,
    contrasena: datosRegistro.contrasena
  });
  assert.equal(acceso.respuesta.status, 201);
  assert.equal(acceso.cuerpo.mensaje, 'Login con éxito');

  const contenido = jwt.verify(acceso.cuerpo.token, config.jwtSecret);
  assert.equal(contenido.usuario.id, usuarioId);
  assert.equal(contenido.usuario.perfil_id, 2);
});

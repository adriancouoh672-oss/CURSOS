const test = require('node:test');
const assert = require('node:assert/strict');
const { app } = require('../app');
const { connection } = require('../config.db');
const { Profile, Category, State, User, New } = require('../models');
const jwt = require('jsonwebtoken');
const config = require('../config');

test('las rutas CRUD y validaciones del punto 7.2 funcionan', async (t) => {
  await connection.authenticate();

  const servidor = app.listen(0);
  await new Promise((resolve) => servidor.once('listening', resolve));

  const ids = {};

  t.after(async () => {
    if (ids.noticia) await New.destroy({ where: { id: ids.noticia } });
    if (ids.usuario) await User.destroy({ where: { id: ids.usuario } });
    if (ids.categoria) await Category.destroy({ where: { id: ids.categoria } });
    if (ids.estado) await State.destroy({ where: { id: ids.estado } });
    if (ids.perfil) await Profile.destroy({ where: { id: ids.perfil } });

    await new Promise((resolve) => servidor.close(resolve));
    await connection.close();
  });

  const { port } = servidor.address();
  const baseUrl = `http://127.0.0.1:${port}/api`;
  const marca = `${Date.now()}-${Math.random().toString(16).slice(2)}`;
  const tokenAdmin = jwt.sign(
    { usuario: { id: 1, perfil_id: 1, correo: 'admin@example.com' } },
    config.jwtSecret,
    { expiresIn: '10m' }
  );

  async function solicitar(ruta, opciones = {}) {
    const respuesta = await fetch(`${baseUrl}${ruta}`, {
      ...opciones,
      headers: opciones.body
        ? {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${tokenAdmin}`,
            ...opciones.headers
          }
        : { Authorization: `Bearer ${tokenAdmin}`, ...opciones.headers }
    });
    const texto = await respuesta.text();
    const cuerpo = texto ? JSON.parse(texto) : null;
    return { respuesta, cuerpo };
  }

  async function crear(ruta, datos) {
    const { respuesta, cuerpo } = await solicitar(ruta, {
      method: 'POST',
      body: JSON.stringify(datos)
    });
    assert.equal(respuesta.status, 201);
    return cuerpo;
  }

  const perfilInvalido = await solicitar('/perfiles', {
    method: 'POST',
    body: JSON.stringify({ nombre: 'A' })
  });
  assert.equal(perfilInvalido.respuesta.status, 422);
  assert.equal(perfilInvalido.cuerpo.errores[0].path, 'nombre');

  const categoriaInvalida = await solicitar('/categorias', {
    method: 'POST',
    body: JSON.stringify({ nombre: 'abc', descripcion: 'x' })
  });
  assert.equal(categoriaInvalida.respuesta.status, 422);
  assert.equal(categoriaInvalida.cuerpo.mensaje, 'La solicitud contiene datos inválidos');
  assert.deepEqual(
    new Set(categoriaInvalida.cuerpo.errores.map((error) => error.path)),
    new Set(['nombre', 'descripcion'])
  );

  const perfil = await crear('/perfiles', {
    nombre: `Perfil ${marca}`
  });
  ids.perfil = perfil.id;

  const usuarioInvalido = await solicitar('/usuarios', {
    method: 'POST',
    body: JSON.stringify({
      perfil_id: perfil.id,
      nombre: 'Usuario',
      apellidos: marca,
      nick: `i${marca.slice(-10)}`,
      correo: 'correo-invalido',
      contrasena: 'corta'
    })
  });
  assert.equal(usuarioInvalido.respuesta.status, 422);
  assert.deepEqual(
    new Set(usuarioInvalido.cuerpo.errores.map((error) => error.path)),
    new Set(['correo', 'contrasena'])
  );
  assert.equal(
    Object.hasOwn(
      usuarioInvalido.cuerpo.errores.find((error) => error.path === 'contrasena'),
      'value'
    ),
    false
  );

  const categoria = await crear('/categorias', {
    nombre: `Categoria ${marca}`,
    descripcion: 'Categoría creada por la prueba del punto 6.2'
  });
  ids.categoria = categoria.id;

  const estado = await crear('/estados', {
    nombre: `Estado ${marca}`,
    abreviacion: `E${marca.slice(-3)}`
  });
  ids.estado = estado.id;

  const estadoDuplicado = await solicitar('/estados', {
    method: 'POST',
    body: JSON.stringify({
      nombre: estado.nombre,
      abreviacion: `D${marca.slice(-3)}`
    })
  });
  assert.equal(estadoDuplicado.respuesta.status, 422);
  assert.equal(estadoDuplicado.cuerpo.errores[0].path, 'nombre');

  const usuario = await crear('/usuarios', {
    perfil_id: perfil.id,
    nombre: 'Usuario',
    apellidos: marca,
    nick: `u${marca.slice(-10)}`,
    correo: `${marca}@example.com`,
    contrasena: 'clave-de-prueba'
  });
  ids.usuario = usuario.id;
  assert.equal(Object.hasOwn(usuario, 'contrasena'), false);

  const noticiaInvalida = await solicitar('/noticias', {
    method: 'POST',
    body: JSON.stringify({
      categoria_id: categoria.id,
      estado_id: estado.id,
      usuario_id: usuario.id,
      titulo: 'Noticia inválida',
      fecha_publicacion: new Date().toISOString(),
      descripcion: 'La imagen no está codificada correctamente',
      imagen: 'no-es-base64!'
    })
  });
  assert.equal(noticiaInvalida.respuesta.status, 422);
  assert.equal(noticiaInvalida.cuerpo.errores[0].path, 'imagen');

  const noticia = await crear('/noticias', {
    categoria_id: categoria.id,
    estado_id: estado.id,
    usuario_id: usuario.id,
    titulo: `Noticia ${marca.slice(-12)}`,
    fecha_publicacion: new Date().toISOString(),
    descripcion: 'Noticia creada para comprobar los controladores CRUD',
    imagen: Buffer.from('imagen-prueba').toString('base64')
  });
  ids.noticia = noticia.id;

  const consultaPerfil = await solicitar(
    `/perfiles?nombre=${encodeURIComponent(perfil.nombre)}`
  );
  assert.equal(consultaPerfil.respuesta.status, 200);
  assert.equal(consultaPerfil.cuerpo.length, 1);

  const consultaNoticia = await solicitar(`/noticias/${noticia.id}`);
  assert.equal(consultaNoticia.respuesta.status, 200);
  assert.equal(consultaNoticia.cuerpo.id, noticia.id);

  const actualizacion = await solicitar(`/noticias/${noticia.id}`, {
    method: 'PUT',
    body: JSON.stringify({ titulo: 'Noticia actualizada' })
  });
  assert.equal(actualizacion.respuesta.status, 200);
  assert.equal(actualizacion.cuerpo.recurso.titulo, 'Noticia actualizada');

  const actualizacionCategoria = await solicitar(`/categorias/${categoria.id}`, {
    method: 'PUT',
    body: JSON.stringify({ nombre: categoria.nombre })
  });
  assert.equal(actualizacionCategoria.respuesta.status, 200);

  for (const [ruta, clave] of [
    [`/noticias/${noticia.id}`, 'noticia'],
    [`/usuarios/${usuario.id}`, 'usuario'],
    [`/categorias/${categoria.id}`, 'categoria'],
    [`/estados/${estado.id}`, 'estado'],
    [`/perfiles/${perfil.id}`, 'perfil']
  ]) {
    const eliminacion = await solicitar(ruta, { method: 'DELETE' });
    assert.equal(eliminacion.respuesta.status, 200);
    ids[clave] = null;
  }

  const noEncontrado = await solicitar(`/perfiles/${perfil.id}`);
  assert.equal(noEncontrado.respuesta.status, 404);
});

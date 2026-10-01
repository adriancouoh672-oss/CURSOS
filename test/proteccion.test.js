const test = require('node:test');
const assert = require('node:assert/strict');
const jwt = require('jsonwebtoken');
const { app } = require('../app');
const config = require('../config');

test('los endpoints aplican los permisos del punto 8.3', async (t) => {
  const servidor = app.listen(0);
  await new Promise((resolve) => servidor.once('listening', resolve));
  t.after(() => new Promise((resolve) => servidor.close(resolve)));

  const { port } = servidor.address();
  const baseUrl = `http://127.0.0.1:${port}/api`;
  const tokenContribuidor = jwt.sign(
    { usuario: { id: 20, perfil_id: 2 } },
    config.jwtSecret,
    { expiresIn: '10m' }
  );
  const tokenAdmin = jwt.sign(
    { usuario: { id: 10, perfil_id: 1 } },
    config.jwtSecret,
    { expiresIn: '10m' }
  );

  async function post(ruta, token, cuerpo = {}) {
    return fetch(`${baseUrl}${ruta}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {})
      },
      body: JSON.stringify(cuerpo)
    });
  }

  assert.equal((await post('/categorias')).status, 401);
  assert.equal((await post('/categorias', tokenContribuidor)).status, 403);
  assert.equal((await post('/categorias', tokenAdmin)).status, 422);
  assert.equal((await post('/noticias', tokenContribuidor)).status, 422);
  assert.equal((await post('/noticias', 'token-invalido')).status, 403);
});

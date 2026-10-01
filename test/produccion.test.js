const test = require('node:test');
const assert = require('node:assert/strict');
const { app } = require('../app');

test('la API de producción habilita CORS', async (t) => {
  const servidor = app.listen(0);
  await new Promise((resolve) => servidor.once('listening', resolve));
  t.after(() => new Promise((resolve) => servidor.close(resolve)));

  const { port } = servidor.address();
  const respuesta = await fetch(`http://127.0.0.1:${port}/`, {
    headers: { Origin: 'https://cliente.example.com' }
  });

  assert.equal(respuesta.status, 200);
  assert.equal(respuesta.headers.get('access-control-allow-origin'), '*');
});

const { probarConexion, connection } = require('../config.db');

async function main() {
  try {
    await probarConexion();
    const tablas = await connection.getQueryInterface().showAllTables();
    const tablasEsperadas = ['categories', 'news', 'profiles', 'states', 'users'];
    const tablasFaltantes = tablasEsperadas.filter(
      (tabla) => !tablas.map(String).includes(tabla)
    );

    if (tablasFaltantes.length > 0) {
      throw new Error(`Faltan las tablas: ${tablasFaltantes.join(', ')}`);
    }

    console.log(`Tablas verificadas: ${tablasEsperadas.join(', ')}`);
    console.log('Prueba de conexión completada correctamente');
  } catch (error) {
    console.error('Error de conexión:', error.message);
    process.exitCode = 1;
  } finally {
    await connection.close();
  }
}

main();

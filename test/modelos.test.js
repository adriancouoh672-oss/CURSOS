const test = require('node:test');
const assert = require('node:assert/strict');
const { connection } = require('../config.db');
const { Profile, Category, State, User, New } = require('../models');

test.after(async () => {
  await connection.close();
});

test('se definieron los cinco modelos con sus tablas', () => {
  assert.equal(Profile.getTableName(), 'profiles');
  assert.equal(Category.getTableName(), 'categories');
  assert.equal(State.getTableName(), 'states');
  assert.equal(User.getTableName(), 'users');
  assert.equal(New.getTableName(), 'news');
});

test('el modelo User pertenece a Profile', () => {
  assert.equal(User.associations.perfil.target, Profile);
  assert.equal(User.associations.perfil.foreignKey, 'perfil_id');
});

test('el modelo New pertenece a Category, State y User', () => {
  assert.equal(New.associations.categoria.target, Category);
  assert.equal(New.associations.estado.target, State);
  assert.equal(New.associations.usuario.target, User);
});

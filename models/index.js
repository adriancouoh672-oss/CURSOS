const { Profile } = require('./ProfileModel');
const { Category } = require('./CategoryModel');
const { State } = require('./StateModel');
const { User } = require('./UserModel');
const { New } = require('./NewModel');

Profile.hasMany(User, {
  as: 'usuarios',
  foreignKey: 'perfil_id'
});
User.belongsTo(Profile, {
  as: 'perfil',
  foreignKey: 'perfil_id'
});

Category.hasMany(New, {
  as: 'noticias',
  foreignKey: 'categoria_id'
});
New.belongsTo(Category, {
  as: 'categoria',
  foreignKey: 'categoria_id'
});

State.hasMany(New, {
  as: 'noticias',
  foreignKey: 'estado_id'
});
New.belongsTo(State, {
  as: 'estado',
  foreignKey: 'estado_id'
});

User.hasMany(New, {
  as: 'noticias',
  foreignKey: 'usuario_id'
});
New.belongsTo(User, {
  as: 'usuario',
  foreignKey: 'usuario_id'
});

module.exports = { Profile, Category, State, User, New };

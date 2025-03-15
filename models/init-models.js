var DataTypes = require("sequelize").DataTypes;
var _actor = require("./actor");
var _category = require("./category");
var _film = require("./film");
var _film_actor = require("./film_actor");
var _film_category = require("./film_category");
var _language = require("./language");

function initModels(sequelize) {
  var actor = _actor(sequelize, DataTypes);
  var category = _category(sequelize, DataTypes);
  var film = _film(sequelize, DataTypes);
  var film_actor = _film_actor(sequelize, DataTypes);
  var film_category = _film_category(sequelize, DataTypes);
  var language = _language(sequelize, DataTypes);

  actor.belongsToMany(film, { as: 'film_id_films', through: film_actor, foreignKey: "actor_id", otherKey: "film_id" });
  category.belongsToMany(film, { as: 'film_id_film_film_categories', through: film_category, foreignKey: "category_id", otherKey: "film_id" });
  film.belongsToMany(actor, { as: 'actor_id_actors', through: film_actor, foreignKey: "film_id", otherKey: "actor_id" });
  film.belongsToMany(category, { as: 'category_id_categories', through: film_category, foreignKey: "film_id", otherKey: "category_id" });
  film_actor.belongsTo(actor, { as: "actor", foreignKey: "actor_id"});
  actor.hasMany(film_actor, { as: "film_actors", foreignKey: "actor_id"});
  film_category.belongsTo(category, { as: "category", foreignKey: "category_id"});
  category.hasMany(film_category, { as: "film_categories", foreignKey: "category_id"});
  film_actor.belongsTo(film, { as: "film", foreignKey: "film_id"});
  film.hasMany(film_actor, { as: "film_actors", foreignKey: "film_id"});
  film_category.belongsTo(film, { as: "film", foreignKey: "film_id"});
  film.hasMany(film_category, { as: "film_categories", foreignKey: "film_id"});
  film.belongsTo(language, { as: "language", foreignKey: "language_id"});
  language.hasMany(film, { as: "films", foreignKey: "language_id"});
  film.belongsTo(language, { as: "original_language", foreignKey: "original_language_id"});
  language.hasMany(film, { as: "original_language_films", foreignKey: "original_language_id"});

  return {
    actor,
    category,
    film,
    film_actor,
    film_category,
    language,
  };
}
module.exports = initModels;
module.exports.initModels = initModels;
module.exports.default = initModels;

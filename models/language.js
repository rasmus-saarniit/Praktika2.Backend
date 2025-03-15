const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('language', {
    language_id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    name: {
      type: DataTypes.CHAR(20),
      allowNull: false
    },
    last_update: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: Sequelize.Sequelize.fn('now')
    }
  }, {
    sequelize,
    tableName: 'language',
    schema: 'movies',
    timestamps: false,
    indexes: [
      {
        name: "language_pkey",
        unique: true,
        fields: [
          { name: "language_id" },
        ]
      },
    ]
  });
};

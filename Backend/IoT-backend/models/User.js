const { Sequelize, DataTypes } = require('sequelize');
const db = require('./database');
const Device = require('./Device')

const User = db.define('User', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
    unique: true,
    allowNull: false
  },
  usename: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false
  },
});


User.hasMany(Device, {
  foreignKey: {
      name: 'userId',
      allowNull: false
  },
  onDelete: 'CASCADE',
  onUpdate: 'CASCADE',
});

module.exports = User;
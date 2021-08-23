const { Sequelize, DataTypes } = require('sequelize');
const db = require('./database');

const Device = db.define('Device', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
    unique: true,
    allowNull: false
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  }
});



module.exports = Device;
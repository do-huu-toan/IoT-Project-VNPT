const { Sequelize, DataTypes } = require('sequelize');
const db = require('./database');
const User = require('./User')

const Role = db.define('Role', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
    unique: true,
    allowNull: false
  },
  rolename:{
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
  }
});

Role.hasMany(User, {
    foreignKey: {
        name: 'roleId',
        allowNull: false
    },
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
});

module.exports = Role;
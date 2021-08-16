const { Sequelize, Model } = require('sequelize');

require('dotenv').config();
const db = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASS, {
    host: process.env.DB_HOST,
    dialect: 'mariadb'
});

db.authenticate()
    .then(() => console.log("Connect DB Successful !"))
    .catch(() => console.log("Kiem tra lai DB"));







module.exports = db;
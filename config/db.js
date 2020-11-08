const { Sequelize } = require('sequelize');
require('dotenv').config({ path: 'variables.env' });

// Option 2: Passing parameters separately (other dialects)
const db = new Sequelize(
  process.env.BD_NOMBRE,
  process.env.BD_USER,
  process.env.BD_PASS,
  {
    host: process.env.BD_HOST,
    dialect: 'mysql' /*| 'mariadb' | 'postgres' | 'mssql' */,
    port: process.env.BD_PORT,
    define: {
      timestamps: false,
    },
  }
);

module.exports = db;

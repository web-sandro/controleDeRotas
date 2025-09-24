const mysql = require('mysql2/promise');

const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',        // ajuste se necessário
  password: '',        // ajuste sua senha
  database: 'grid_app'
});

module.exports = pool;

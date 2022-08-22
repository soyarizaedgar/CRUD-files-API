const mysql =  require('mysql');
const dbconfig = require("../config/db.config");

const pool = mysql.createPool({
    host: dbconfig.host,
    user: dbconfig.user,
    password: dbconfig.password,
    database: dbconfig.database,
    connectionLimit: 20
  });

module.exports = pool;
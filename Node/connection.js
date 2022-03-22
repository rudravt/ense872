var mysql = require('mysql');

module.exports = {
  getMySQLConnection: function() {
    return mysql.createConnection({
      host: 'localhost',
      user: 'root',
      password: 'rud@123',
      database: 'Project'
    });
  }
};

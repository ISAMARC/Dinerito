var mysql = require('mysql'),
    connection = mysql.createConnection({
      host     : 'localhost',
      user     : 'root',
      password : '123',
      database : 'documentario',
      multipleStatements: true
    });

module.exports = connection;

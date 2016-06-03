module.exports = function (app, connection) {
  'use strict';
  app.get('/login/usuarios', function (req, res) {
    connection.query('SELECT * from usuarios', function (err, rows) {
      if (err) {
        printLog(err);
        res.status(500).send({code: 500, msg: 'Internal Server Error', dev: err});
      }

      res.json(rows);
    });
  });
};

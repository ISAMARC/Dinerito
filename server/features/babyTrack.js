var express = require('express'),
    rutas = express.Router(),
    db = require('../core/database.js');

// Usados en el api rest angular resource como
rutas.route('/categories')
  .get(function (req, res) { // Cliente.query()
    db.query('SELECT * from baby_categories', function (err, rows) {
      if (err) {
        printLog(err);
        res.status(500).send({code: 500, msg: 'Internal Server Error', dev: err});
      }
      res.json(rows);
    });
  });

rutas.route('/')
  .get(function (req, res) {
    var query = 'select r.*, c.`name` category ' +
      'from baby_records r ' +
      'inner join baby_categories c on c.id = r.category_id ' +
      ' where r.status = 1 order by r.id desc limit 20';
    db.query(query, function (err, rows) {
      if (err) {
        printLog(err);
        res.status(500).send({code: 500, msg: 'Internal Server Error', dev: err});
      }

      res.json(rows);
    });
  })
  .post(function (req, res) {
    var query = 'INSERT INTO baby_records set ' +
      ' category_id = ' + req.body.category_id  +
      ' , created_at = now() ' +
      ' , created_time = "' + req.body.created_time + '"';

    db.query(query, function (err, rows) {
      if (err) {
        printLog(err);
        res.status(500).send({code: 500, msg: 'Internal Server Error', dev: err});
      }
      res.json({results:{code:1, message: 'ok', data: req.body}});
    });
  })
  .delete(function (req, res) {
    var id = req.query.id,
        query = 'update baby_records set status = 0 where id = ' + id;
    db.query(query, function (err, rows) {
      if (err) {
        printLog(err);
        res.status(500).send({code: 500, msg: 'Internal Server Error', dev: err});
      }
      res.json({message: 'ok'});
    });
  });

rutas.route('/:id')
  .get(function (req, res) {
    var query = 'select r.*, c.`name` category ' +
      ' from baby_records r ' +
      ' inner join baby_categories c on c.id = r.category_id ' +
      ' where r.status = 1 and r.category_id = ' + req.params.id +
      ' order by r.id desc limit 20';


    db.query(query, function (err, rows) {
      if (err) {
        printLog(err);
        res.status(500).send({code: 500, msg: 'Internal Server Error', dev: err});
      }

      res.json(rows);
    });
  });

module.exports = rutas;
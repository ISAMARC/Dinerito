var express = require('express'),
  rutas = express.Router(),
  db = require('../core/database.js');

/**
 * GET    /Report/  GET USERS LIST ARRAY ** Resource.query() in angular
 *
 */

rutas.route('/')
  .get(function (req, res) {
    var query = 'select d.date, d.amount, c.`name` category, ac.name account ' +
      ' from dinero d  ' +
      ' left join categories c on c.id = d.category_id ' +
      ' left join accounts ac on ac.id = d.account_id ' +
      ' where d.user_id =' + req.user.id +
      ' order by d.date;';

    db.query(query, function (err, rows) {
      if (err) {
        console.log(err);
        res
          .status(500) // new resource was created
          .json({results:{code:1, message: 'ok', data: err}});
      }
      res
        .status(201) // new resource was created
        .json(rows);
    });

  });



module.exports = rutas;

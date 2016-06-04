var express = require('express'),
  rutas = express.Router(),
  db = require('../core/database.js');

/**
 * GET    /Report/  GET USERS LIST ARRAY ** Resource.query() in angular
 *
 */

rutas.route('/')
  .get(function (req, res) {
    var whereOptions = '  ';


    if(req.query.account_id > 0) {
      whereOptions = whereOptions + ' and d.account_id = ' + req.query.account_id;
    }

    var query = 'select d.date, d.amount, c.`name` category, ac.name account , d.comment' +
      ' from dinero d  ' +
      ' left join categories c on c.id = d.category_id ' +
      ' left join accounts ac on ac.id = d.account_id ' +
      ' where 1 = 1' + whereOptions +
      ' order by d.date desc;';

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

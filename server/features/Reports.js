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
//console.log(req.body);
//console.log(req.params);
//console.log(req.query);

    if(req.query.account > 0) {
      whereOptions = whereOptions + ' and d.account_id = ' + req.query.account;
    }

    if (req.query.start_time > 0 && req.query.end_time > 0) {
      whereOptions = whereOptions + ' and d.date between ' + req.query.start_time + ' and ' + req.query.end_time;

    }

    var query = 'select d.date, d.amount, c.`name` category, ac.name account , d.comment' +
      ' from money_records d  ' +
      ' left join money_categories c on c.id = d.category_id ' +
      ' left join money_accounts ac on ac.id = d.account_id ' +
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
        .status(200) // new resource was created
        .json(rows);
    });

  });



module.exports = rutas;

var express = require('express'),
  rutas = express.Router(),
  db = require('../core/database.js');

/**
 * GET    /Dinero/  GET USERS LIST ARRAY ** Resource.query() in angular
 * POST   /Dinero/  SAVE A NEW dinero OBJECT IN {REQ.BODY} ** instance.$save() in angular
 *
 */

rutas.route('/')
  .post(function (req, res) {
    var query = 'INSERT INTO money_records SET ' +
        ' date = "' + req.body.date + '" , ' +
        ' account_id = ' + req.body.account + ' , ' +
        ' category_id = ' + req.body.category + ' , ' +
        ' amount = ' + req.body.amount + ' , ' +
        ' status = 1 , ' +
        ' created_at = now() ,' +
        ' user_id = ' + req.user.id + ' ,' +
        ' comment = "' + req.body.comment + '"';

    db.query(query, function (err, results) {
      if (err) {
        console.log(err);
        res
          .status(500) // new resource was created
          .json({results:{code:1, message: 'ok', data: err}});
      }
      res
        .status(201) // new resource was created
        .json({results:{code:1, message: 'ok', data: req.body}});
    });

  });



module.exports = rutas;

var express = require('express'),
    rutas = express.Router(),
    db = require('../core/database.js');

/**
 * GET    /Users/  GET USERS LIST ARRAY ** Resource.query() in angular
 * POST   /Users/  SAVE A NEW USER OBJECT IN {REQ.BODY} ** instance.$save() in angular
 *
 * GET    /Users/:ID GET USER ID OBJECT {req.params.id} /Users/3 ** Resource.get({user_id: 3}) in angular
 * PUT    /Users/:ID GET USER ID OBJECT TO MODIFY IT {req.params.id} - req.body.data... /Users/3 ** instance.$update({id: 3}) in angular
 * DELETE /Users/:ID GET USER ID OBJECT  TO REMOVE IT {req.params.id} /Users/3 ** Resource.delete({id: 3}) in angular
 *
 */

rutas.route('/')
  .get(function (req, res) {
    'use strict';
    var query = 'SELECT u.*, ' +
        '(select GROUP_CONCAT(c.description SEPARATOR "<br>")  ' +
          'from USERS_CLIENTS uc  ' +
          'inner join CLIENTS c on c.id = uc.client_id ' +
          'where uc.user_id = u.id) clients ' +
        'FROM USERS u;';
    db.query(query, function (err, rows) {
      if (err) {
        printLog(err);
        res.status(500).send({code: 500, msg: 'Internal Server Error', dev: err});
      }

      res.json({results:{list:rows, totalResults: rows.length}});
    });
  })
  .post(function (req, res) {
    'use strict';

    db.query('select * from users where name = "' + req.body.name + '"', function (err, rows) {
      if (rows.length) {
        res
          .status(422) // unprocessable entity
          .json({error: 422, message: 'El nombre de Usuario que quiere utilizar ya existe'});
      } else {
        var query = 'INSERT INTO USERS SET ' +
            ' name = "' + req.body.name + '" , ' +
            ' password = "' + req.body.password + '" , ' +
            ' status = ' + req.body.status + ' , ' +
            ' role_id = ' + req.body.role_id + ' , ' +
            ' created_at = "' + req.body.created_at + '";',
          userClientQuery = [],
          uCQueries = '',
          uEntities = [],
          uEQueries = '';

        db.query(query , function (err, result) {
          if (err) {
            printLog(err);
            res.status(500).send({code: 500, msg: 'Internal Server Error', dev: err});
            return;
          }

          var userID = result.insertId;
          // Insert allowed Clients
          if (req.body.clients && req.body.clients.length) {
            req.body.clients.forEach(function (item) {
              if (item.selected === true) {
                userClientQuery.push('insert into USERS_CLIENTS SET ' +
                  '   user_id = ' + userID +
                  ' , client_id = ' + item.id);
              }
            });

            if (userClientQuery.length) {
              uCQueries = userClientQuery.join(';');
            }
          }

          // Insert restrictions
          if (req.body.entities && req.body.entities.length) {
            req.body.entities.forEach(function (item) {
              uEntities.push('insert into RESTRICTIONS set ' +
                ' entity_id =' + item.id +
                ' , user_id =' + userID +
                ' , _view = ' +   item._view +
                ' , _create = ' + item._create +
                ' , _edit = ' +   item._edit +
                ' , _delete = ' + item._delete + '');
            });
            // Remove previous restrictions
            uEQueries = '; delete from RESTRICTIONS where user_id = ' + userID + ';'
              + uEntities.join(';');
          }
          db.query(uCQueries + uEQueries, function (err, result) {
            res
              .status(201) // new resource was created
              .json({results:{code:1, message: 'ok', data: req.body}});
          });
        });
      }
    });
  });

rutas.route('/:id')
  .get(function (req, res) {
    'use strict';
    var user,
        query = 'SELECT * FROM USERS WHERE ID = ' + req.params.id,
        CQuery, // client query
        RQuery; // restriction query

    // Add user_clients into the user json
    CQuery = "; SELECT c.id, c.description, IF(uc.id, true, null) selected  " +
      " from CLIENTS c  " +
      " left join USERS_CLIENTS uc on uc.client_id = c.id and uc.status = 1 and uc.user_id = " + req.params.id +
      " where c.status = 1";

    // Add entity restrictions
    RQuery = "; select e.id, e.`name`, r._view, r._create, r._edit, r._delete " +
      "from ENTITIES e  " +
      "left join RESTRICTIONS r on r.entity_id = e.id and r.user_id = " + req.params.id;

    db.query(query + CQuery + RQuery, function (err, results) {
      if (err) {
        printLog(err);
        res.status(500).send({code: 500, msg: 'Internal Server Error', dev: err});
        return;
      }

      user = results[0][0];
      user.clients = results[1];
      user.entities = results[2];
      res.json(user);

    });
  })
  .put(function (req, res) {
    'use strict';
    var query = 'UPDATE USERS SET ' +
          ' name = "' + req.body.name + '" , '+
          ' password = "' + req.body.password + '", '+
          ' status = ' + req.body.status + ' , '+
          ' role_id = ' + req.body.role_id +
          ' where id = ' + req.params.id +
          '; delete from USERS_CLIENTS where user_id = ' + req.params.id + ';', // Remove all rows related to add new ones
        userClientQuery = [],
        uCQueries = '',
        uEntities = [],
        uEQueries = '';

    // Insert allowed Clients
    if (req.body.clients && req.body.clients.length) {
      req.body.clients.forEach(function (item) {
        if (item.selected === true) {
          userClientQuery.push('insert into USERS_CLIENTS SET ' +
            '   user_id = ' + req.params.id +
            ' , client_id = ' + item.id);
        }
      });

      if (userClientQuery.length) {
        uCQueries = userClientQuery.join(';');
      }
    }

    // Insert restrictions
    if (req.body.entities && req.body.entities.length) {
      req.body.entities.forEach(function (item) {
        uEntities.push('insert into RESTRICTIONS set ' +
          ' entity_id =' + item.id +
          ' , user_id =' + req.params.id +
          ' , _view = ' +   item._view +
          ' , _create = ' + item._create +
          ' , _edit = ' +   item._edit +
          ' , _delete = ' + item._delete + '')
      });
      // Remove previous restrictions
      uEQueries = '; delete from RESTRICTIONS where user_id = ' + req.params.id  + ';'
        + uEntities.join(';');
    }

    db.query(query + uCQueries + uEQueries, function (err) {
      if (err) {
        res.status(500).send({code: 500, msg: 'Internal Server Error', dev: err});
        return;
      }
      res
        .status(201)
        .json({results:{code:1, message: 'ok', data: req.body}});
    });
  })
  .delete(function () {
    'use strict';
  });

module.exports = rutas;

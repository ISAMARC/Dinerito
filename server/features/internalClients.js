var express = require('express'),
    routes = express.Router(),
    db = require('../core/database.js');

/**
 * InternalClient Object
 *
 * id
 * legacy_id
 * client_id
 * name
 * short_name
 * address
 * ruc
 * id_ubigeo
 * scope
 * status
 * created_by
 * created_at
 * updated_by
 * updated_at
 */

routes.route('/')
  .get(function (req, res) {
    'use strict';
    var filter = {
          id_client: req.query.id_client,
          pageStart: parseInt(req.query.pageStart || 0, 10),
          pageCount: parseInt(req.query.pageCount || 0, 10),
          orderBy: req.query.orderBy
        },
        dataQuery = 'SELECT * FROM INTERNAL_CLIENTS WHERE 1 ',
        countQuery = 'SELECT COUNT(ID) AS COUNTER FROM INTERNAL_CLIENTS WHERE 1 ',
        commonQuery = 'AND STATUS = 1 ',
        dataParams = [],
        countParams = [];

    if (filter.id_client) {
      commonQuery += 'AND ID_CLIENT = ? ';
      dataParams.push(filter.id_client);
      countParams.push(filter.id_client);
    }

    // Add conditions
    dataQuery += commonQuery;
    countQuery += commonQuery;

    // Add an ORDER BY sentence
    dataQuery += ' ORDER BY ';
    if (filter.orderBy) {
      dataQuery += filter.orderBy;
    } else {
      dataQuery += 'ID DESC';
    }

    // Set always an start for data
    dataQuery += ' LIMIT ?';
    dataParams.push(filter.pageStart);

    if (filter.pageCount) {
      dataQuery += ', ?';
      dataParams.push(filter.pageCount);
    } else {
      // Request 500 records at most if limit is not specified
      dataQuery += ', 500';
    }

    dataQuery += ';';
    countQuery += ';';

    // Execute both queries at once
    dataParams = dataParams.concat(countParams);

    db.query(dataQuery + countQuery, dataParams, function (err, rows) {
      if (err) {
        printLog(err);
        res.status(500).send({code: 500, msg: 'Internal Server Error', dev: err});
      }

      rows = rows || [{}];

      /**
       * Result format: {results:{list:[], totalResults:0}}
       */
      res.json({
        results: {
          list:rows[0],
          count: rows[1][0].COUNTER
        }
      });
    });
  })
  .post(function (req, res) {
    'use strict';
    var internalClientPB = req.body,
        internalClient = {};

    internalClient.client_id = internalClientPB.client_id;
    internalClient.name = internalClientPB.name;
    internalClient.short_name = internalClientPB.short_name;
    internalClient.address = internalClientPB.address;
    internalClient.ruc = internalClientPB.ruc;
    internalClient.id_ubigeo = internalClientPB.id_ubigeo;
    internalClient.scope = internalClientPB.scope;

    // Set default values
    internalClient.status = 1;
    internalClient.created_at = new Date();
    internalClient.created_by = req.user && req.user.id || -1;

    db.query('INSERT INTO INTERNAL_CLIENTS SET ?;', internalClient, function (err, result) {
      if (err) {
        printLog(err);
        res.status(500).send({code: 500, msg: 'Internal Server Error', dev: err});
        return;
      }

      res.json({result: {code: '001', message: 'ok', id: result.insertId}});
    });
  });

routes.route('/:id')
  .get(function (req, res) {
    'use strict';
    var internalClientId = req.params.id,
        dataQuery = 'SELECT * FROM INTERNAL_CLIENTS WHERE ID = ?;';

    db.query(dataQuery, [internalClientId], function (err, rows) {
      if (err) {
        printLog(err);
        res.status(500).send({code: 500, msg: 'Internal Server Error', dev: err});
        return;
      }

      rows = rows || [{}];

      res.json(rows[0]);
    });
  })
  .put(function (req, res) {
    'use strict';
    var id = req.params.id,
        internalClientPB = req.body,
        internalClient = {};

    internalClient.legacy_id = internalClientPB.legacy_id;
    internalClient.client_id = internalClientPB.client_id;
    internalClient.name = internalClientPB.name;
    internalClient.short_name = internalClientPB.short_name;
    internalClient.address = internalClientPB.address;
    internalClient.ruc = internalClientPB.ruc;
    internalClient.id_ubigeo = internalClientPB.id_ubigeo;
    internalClient.scope = internalClientPB.scope;
    // Set default values
    internalClient.updated_at = new Date();
    internalClient.updated_by = req.user && req.user.id || -1;

    db.query('UPDATE INTERNAL_CLIENTS SET ? WHERE ID = ?;', [internalClient, id],
      function (err) {
        if (err) {
          printLog(err);
          res.status(500).send({code: 500, msg: 'Internal Server Error', dev: err});
          return;
        }

        res.json({result: {code: '001', message: 'ok'}});
      });
  })
  .delete(function (req, res) {
    'use strict';
    var id = req.params.id,
        internalClient = {
          // Set default values
          status: -1,
          updated_at: new Date(),
          updated_by: req.user && req.user.id || -1
        };

    db.query('UPDATE INTERNAL_CLIENTS SET ? WHERE ID = ?;', [internalClient, id],
      function (err) {
        if (err) {
          printLog(err);
          res.status(500).send({code: 500, msg: 'Internal Server Error', dev: err});
          return;
        }

        res.json({result: {code: '001', message: 'ok'}});
      });
  });

module.exports = routes;

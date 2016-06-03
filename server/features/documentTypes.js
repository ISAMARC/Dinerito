var express = require('express'),
    routes = express.Router(),
    db = require('../core/database.js'),
    extend = require('util')._extend;

/**
 * DocumentType Object
 *
 * id
 * name
 * status
 * created_by
 * created_at
 * updated_by
 * updated_at
 */

routes.route('/list')
  .get(function (req, res) {
    'use strict';
    var docType = {
          id: req.query.id,
          name: req.query.name
        },
        filter = {
          pageStart: parseInt(req.query.pageStart || 0, 10),
          pageCount: parseInt(req.query.pageCount || 0, 10),
          orderBy: req.query.orderBy
        },
        dataQuery = 'SELECT * FROM DOCUMENT_TYPE WHERE 1 ',
        countQuery = 'SELECT COUNT(ID) AS COUNTER FROM DOCUMENT_TYPE WHERE 1 ',
        commonQuery = 'AND STATUS = 1 ',
        dataParams = [],
        countParams = [];

    if (docType.id) {
      commonQuery += 'AND ID = ? ';
      dataParams.push(docType.id);
    }

    if (docType.name) {
      commonQuery += 'AND NAME like ? ';
      dataParams.push('%' + docType.name + '%');
    }


    // Counter doesn't need exta params so make a copy of data params at this point
    countParams = extend([], dataParams);
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

      rows = rows || [];

      /**
       * Result format: {results:{list:[], totalResults:0}}
       */
      res.json({
        results: {
          list:rows[0],
          totalResults: rows[1][0].COUNTER
        }
      });
    });
  })
  .post(function (req, res) {
    'use strict';
    var docType = req.body;

    // Set default values
    docType.created_at = new Date();
    docType.status = 1;
    // TODO: get logged user Id
    docType.created_by = 1;

    db.query('INSERT INTO DOCUMENT_TYPE SET ?;', docType, function (err, result) {
      if (err) {
        printLog(err);
        res.status(500).send({code: 500, msg: 'Internal Server Error', dev: err});
      }

      res.json({result: {code: '001', message: 'ok', id: result.insertId}});
    });
  })
  .put(function (req, res) {
    'use strict';
    var docType = req.body;

    // Set default values
    docType.updated_at = new Date();
    docType.status = 1;
    // TODO: get logged user Id
    docType.updated_by = 1;

    db.query('UPDATE DOCUMENT_TYPE SET ? WHERE ID = ?;', [docType, docType.id],
      function (err) {
        if (err) {
          printLog(err);
          res.status(500).send({code: 500, msg: 'Internal Server Error', dev: err});
        }

        res.json({result: {code: '001', message: 'ok'}});
      });
  })
  .delete(function (req, res) {
    'use strict';
    var docType = req.body;

    // Set default values
    docType.updated_at = new Date();
    docType.status = -1;
    // TODO: get logged user Id
    docType.updated_by = 1;

    db.query('UPDATE DOCUMENT_TYPE SET ? WHERE ID = ?;', [docType, docType.id], function (err) {
      if (err) {
        printLog(err);
        res.status(500).send({code: 500, msg: 'Internal Server Error', dev: err});
      }

      res.json({result: {code: '001', message: 'ok'}});
    });
  });

module.exports = routes;

var express = require('express'),
    routes = express.Router(),
    db = require('../core/database.js'),
    extend = require('util')._extend;

/**
 * Employee Object
 *
 * id
 * id_client
 * first_name
 * last_name
 * birth_date
 * gender
 * doc_type
 * doc_number
 * address
 * telephone
 * start_date
 * license
 * status
 * charge
 * type
 * created_by
 * created_at
 * updated_by
 * updated_at
 */

routes.route('/list')
  .get(function (req, res) {
    'use strict';
    var employee = {
          id: req.query.id,
          id_client: req.query.id_client,
          name: req.query.name,
          doc_number: req.query.doc_number
        },
        filter = {
          pageStart: parseInt(req.query.pageStart || 0, 10),
          pageCount: parseInt(req.query.pageCount || 0, 10),
          orderBy: req.query.orderBy
        },
        dataQuery = 'SELECT * FROM EMPLOYEES WHERE 1 ',
        countQuery = 'SELECT COUNT(ID) AS COUNTER FROM EMPLOYEES WHERE 1 ',
        commonQuery = 'AND STATUS = 1 ',
        dataParams = [],
        countParams = [];

    if (employee.id) {
      commonQuery += 'AND ID = ? ';
      dataParams.push(employee.id);
    }

    if (employee.name) {
      commonQuery += 'AND FIRST_NAME like ? ';
      dataParams.push('%' + employee.name + '%');
    }

    if (employee.doc_number) {
      commonQuery += 'AND DOC_NUMBER = ? ';
      dataParams.push(employee.doc_number);
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
    var employee = req.body;

    // Set default values
    employee.created_at = new Date();
    // TODO: get logged user Id
    employee.created_by = 1;

    db.query('INSERT INTO EMPLOYEES SET ?;', employee, function (err, result) {
      if (err) {
        printLog(err);
        res.status(500).send({code: 500, msg: 'Internal Server Error', dev: err});
      }

      res.json({result: {code: '001', message: 'ok', id: result.insertId}});
    });
  })
  .put(function (req, res) {
    'use strict';
    var employee = req.body;

    // Set default values
    employee.updated_at = new Date();
    // TODO: get logged user Id
    employee.updated_by = 1;

    db.query('UPDATE EMPLOYEES SET ? WHERE ID = ?;', [employee, employee.id],
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
    var employee = req.body;

    // Set default values
    employee.updated_at = new Date();
    employee.status = -1;
    // TODO: get logged user Id
    employee.updated_by = 1;

    db.query('UPDATE EMPLOYEES SET ? WHERE ID = ?;', [employee, employee.id], function (err) {
      if (err) {
        printLog(err);
        res.status(500).send({code: 500, msg: 'Internal Server Error', dev: err});
      }

      res.json({result: {code: '001', message: 'ok'}});
    });
  });

module.exports = routes;

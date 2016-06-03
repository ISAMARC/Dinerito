var extend = require('util')._extend,
    xlsx = require('node-xlsx'),
    moment = require('moment');

module.exports = function (app, connection, fs) {
  'use strict';
  var API_PATH = '/records/',
      RECEIPT_FILES_PATH = '/Users/macoy/Repositories/Envios/Documentos/PDF/Consolidado/';

  // Error handling middleware.
  app.use(function (err, req, res, next){
    if (err.status === 404) {
      res.statusCode = err.status;
      res.send({code: err.status, msg: 'File not found.', dev: err});
    } else {
      next(err);
    }
  });

  app.post(API_PATH + 'upload', function (req, res) {
    var FILES_PATH,
        WORK_SHEETS,
        records = [],
        client_id,
        data,
        record,
        query = 'INSERT INTO RECORDS(MONTH, PROVINCE, DOCUMENT, DATE, DESTINATION, ' +
          'ADDRESS, DISTRICT, SENDER, CODE, REFERENCE, CREATIONDATE, CREATIONCODE, CLIENT_ID) ' +
          'VALUES ?;',
        // Set date for all the records
        creationDate = new Date(),
        // Set it's creation date as a code to identify
        creationCode = moment(creationDate).format('YYYYMMDDHHmmss'),
        result,
        formatDate,
        i,
        cell;

    if (!req.body.client_id) {
      res.status(500).send({code: 500, msg: 'Error, falta id cliente.', dev: {}});
    }

    client_id = req.body.client_id;

    try {
      FILES_PATH = req.files.uploadFile.path;
      WORK_SHEETS = xlsx.parse(FILES_PATH);

      // Get data from worksheet
      if (WORK_SHEETS && WORK_SHEETS.length) {
        // Get info from first sheet
        data = WORK_SHEETS[0].data;
        if (data && data.length > 1) {
          // Remove sheet headers
          data.shift();
          data.forEach(function (row) {
            if (row && row.length) {
              record = [];
              for (i = 0; i < row.length; i++) {
                cell = row[i] || '';

                switch (i) {
                  case 0: // Month
                    record.push(cell);
                    break;
                  case 1: // Province
                    record.push(cell);
                    break;
                  case 2: // Document
                    record.push(cell);
                    break;
                  case 3: // Date
                    // Get correct date
                    formatDate = new Date(1900, 0, cell-1);
                    record.push(formatDate);
                    break;
                  case 4: // Destination
                    record.push(cell);
                    break;
                  case 5: // Address
                    record.push(cell);
                    break;
                  case 6: // District
                    record.push(cell);
                    break;
                  case 7: // Sender
                    record.push(cell);
                    break;
                  case 8: // Code
                    record.push(cell);
                    break;
                  case 9: // Reference
                    record.push(cell);
                }
              }
              record.push(creationDate, creationCode, client_id);
              records.push(record);
            }
          });
        }
      }

      connection.query(query, [records], function (err, data) {
        if (err) {
          printLog(err);
          res.status(500).send({code: 500, msg: 'Internal Server Error', dev: err});
        } else {
          result = data.affectedRows;

          // Delete file after it was used
          fs.unlink(FILES_PATH, function (err) {
            if (err) {
              printLog(err);
              res.status(500).send({code: 500, msg: 'Internal Server Error', dev: err});
            } else {
              printLog('File successfully deleted ' + req.files.uploadFile.path);
            }

            res.json({count: result});
          });
        }
      });
    } catch (err) {
      printLog(err);
      res.status(500).send({code: 500, msg: 'Internal Server Error', dev: err});
    }
  });

  /*
   * Params definition
   * @QueryParam('pageStart')
   * @QueryParam('pageCount')
   * @QueryParam('orderBy')
   * @QueryParam('code')
   * @QueryParam('document')
   * @QueryParam('destination')
   * @QueryParam('address')
   * @QueryParam('district')
   * @QueryParam('sender')
   * @QueryParam('startDate')
   * @QueryParam('endDate')
   */
  app.get(API_PATH + 'list', function (req, res) {
    var record = {
          code: req.query.code,
          document: req.query.document,
          destination: req.query.destination,
          address: req.query.address,
          district: req.query.district,
          sender: req.query.sender,
          client_id: req.query.client_id
        },
        filter = {
          pageStart: parseInt(req.query.pageStart || 0, 10),
          pageCount: parseInt(req.query.pageCount || 0, 10),
          orderBy: req.query.orderBy,
          startDate: parseFloat(req.query.startDate || 0),
          endDate: parseFloat(req.query.endDate || 0)
        },
        // Build commonQuery
        dataQuery = 'SELECT id, code, document, month, province, ' +
          'district, address, destination, sender, reference, ' +
          'DATE_FORMAT(date,\'%d/%c/%Y\') as date, ' +
          'DATE_FORMAT(creationDate,\'%d/%c/%Y - %H:%i:%S\') as creationDate, ' +
          'creationCode, status, detail FROM RECORDS WHERE 1 ',
        countQuery = 'SELECT COUNT(ID) AS COUNTER FROM RECORDS WHERE 1 ',
        // Filter only available records (status = 1)
        commonQuery = ' AND STATUS = 1 ',
        dataParams = [],
        countParams = [];

    if (record.id) {
      commonQuery += ' AND ID = ? ';
      dataParams.push(record.id);
    }

    if (record.client_id) {
      commonQuery += ' AND CLIENT_ID = ? ';
      dataParams.push(record.client_id);
    }

    if (record.code) {
      commonQuery += ' AND CODE LIKE ? ';
      dataParams.push('%' + record.code + '%');
    }

    if (record.document) {
      commonQuery += ' AND DOCUMENT LIKE ? ';
      dataParams.push('%' + record.document + '%');
    }

    if (record.destination) {
      commonQuery += ' AND DESTINATION LIKE ? ';
      dataParams.push('%' + record.destination + '%');
    }

    if (record.address) {
      commonQuery += ' AND ADDRESS LIKE ? ';
      dataParams.push('%' + record.address + '%');
    }

    if (record.district) {
      commonQuery += ' AND DISTRICT LIKE ? ';
      dataParams.push('%' + record.district + '%');
    }

    if (record.sender) {
      commonQuery += ' AND SENDER LIKE ? ';
      dataParams.push('%' + record.sender + '%');
    }

    if (filter.startDate) {
      commonQuery += ' AND DATE >= ? ';
      dataParams.push(new Date(filter.startDate));
    }

    if (filter.endDate) {
      commonQuery += ' AND DATE <= ? ';
      dataParams.push(new Date(filter.endDate));
    }

    // Counter doesn't need exta params so make a copy of data params at this point
    countParams = extend([], dataParams);
    countQuery += commonQuery;
    dataQuery += commonQuery;

    // Add an ORDER BY sentence
    dataQuery += ' ORDER BY ';
    if (filter.orderBy) {
      dataQuery += filter.orderBy;
    } else {
      dataQuery += 'DATE DESC';
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

    connection.query(dataQuery + countQuery, dataParams, function (err, data) {
      var result;

      if (err) {
        printLog(err);
        res.status(500).send({code: 500, msg: 'Internal Server Error', dev: err});
      } else if (data && data.length === 2) {
        result = {
          count: data[1][0].COUNTER,
          list: data[0]
        };
      }

      res.json(result);
    });
  });

  app.get(API_PATH + 'getFilesName', function (req, res) {
    var fileCode = req.query.code,
        result = [];

    try {
      fs.readdir(RECEIPT_FILES_PATH, function (err, files) {
        if (err) {
          res.status(500).send({code: 500, msg: 'Internal Server Error', dev: err});
        }
        if (files && files.length) {
          files.forEach(function (fileName) {
            if (fileName.indexOf(fileCode) > -1) {
              result.push(fileName);
            }
          });

          res.status(200).json(result);
        }
      });
    } catch (err) {
      res.status(500).send({code: 500, msg: 'Internal Server Error', dev: err});
    }
  });

  app.get(API_PATH + 'download', function (req, res) {
    var file = RECEIPT_FILES_PATH + req.query.code;

    try {
      res.download(file);
    } catch (err) {
      printLog(err);
      res.status(500).send({code: 500, msg: 'Internal Server Error', dev: err});
    }
  });

  app.put(API_PATH + 'update', function (req, res) {
    var record = req.body,
        query = 'UPDATE RECORDS SET DOCUMENT = ?, ADDRESS = ?, ' +
        ' DISTRICT = ?, PROVINCE = ?, SENDER = ?, DESTINATION = ?, ' +
        ' REFERENCE = ?, DETAIL = ? WHERE ID = ?; ',
        params = [
          record.document,
          record.address,
          record.district,
          record.province,
          record.sender,
          record.destination,
          record.reference,
          record.detail,
          record.id
        ],
        result;

    try {
      connection.query(query, params, function (err, data) {
        if (err) {
          printLog(err);
          res.status(500).send({code: 500, msg: 'Internal Server Error', dev: err});
        } else {
          result = {
            count: data.affectedRows
          };
        }

        res.json(result);
      });
    } catch (err) {
      printLog(err);
      res.status(500).send({code: 500, msg: 'Internal Server Error', dev: err});
    }
  });

  app.get(API_PATH + 'creation_code_list', function (req, res) {
    var query = 'SELECT DISTINCT creationCode, ' +
          'DATE_FORMAT(CREATIONDATE,\'%d/%c/%Y - %H:%i:%S\') as creationDate ' +
          'FROM RECORDS WHERE STATUS = 1;';

    try {
      connection.query(query, function (err, data) {
        if (err) {
          res.status(500).send({code: 500, msg: 'Internal Server Error', dev: err});
        }

        res.json(data);
      });
    } catch (err) {
      printLog(err);
      res.status(500).send({code: 500, msg: 'Internal Server Error', dev: err});
    }
  });

  app.delete(API_PATH + 'delete', function (req, res) {
    var creationCode = req.query.creationCode,
        query = 'UPDATE RECORDS SET STATUS = 2 WHERE CREATIONCODE = ?;',
        result;

    try {
      connection.query(query, [creationCode], function (err, data) {
        if (err) {
          printLog(err);
          res.status(500).send({code: 500, msg: 'Internal Server Error', dev: err});
        } else {
          result = {
            count: data.affectedRows
          };
        }

        res.json(result);
      });
    } catch (err) {
      printLog(err);
      res.status(500).send({code: 500, msg: 'Internal Server Error', dev: err});
    }
  });
};

var express = require('express'),
    rutas = express.Router(),
    db = require('../core/database.js');
/**
 * GET    /Auth/ get the current session
 */

rutas.route('/')
  .get(function (req, res) {
    'use strict';
    /**
     * {
     *  id: 1,
        name: 'admin',
        access: '3',
        clients: [ 1, 2, 3, 4 ],
        restrictions: {
          table_name: {
            _view:
            _create:
            _edit:
            _delete:
         },
         ....
     */
    res.json(req.user);
  });

module.exports = rutas;

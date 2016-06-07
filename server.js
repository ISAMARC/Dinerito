var express = require('express'),
    app = express(),
    bodyParser = require('body-parser'),
    cookieParser = require('cookie-parser'),
    passport = require('passport'),
    session = require('express-session'),
    LocalStrategy = require('passport-local').Strategy,
    connection = require('./server/core/database.js'),
    path    = require("path"),
    multipart  = require('connect-multiparty'),
    fs = require('fs'),
    mime = require('mime');


// Set global function to avoid using console.log
global.printLog = function (msg) {
  console.log(msg);
};

// config file
require('./server/core/config.js')(app, express, bodyParser, multipart);
//Authentication module
require('./server/core/authentication.js')(app, passport, LocalStrategy, cookieParser, session, connection);

// Show the main html in the app
app.get('/', function (req, res, next) {
  try {
    if (!req.user) return res.redirect('/login.html');
    res.sendFile(path.join(__dirname+'/public/_index.html'));
  } catch (err){
    console.log(err);
    res.status(500).send({code: 500, msg: 'Internal Server Error', dev: err});
  }
});

// Verify Session
app.use(function (req, res, next) {
  if (req.user) {
    next();
  } else {
    res
      .status(401)
      .json({error: 401, message: 'La session ha expirado, por favor refresque la página'});
  }
});

// Rutas de api
var login = require('./server/features/login.js')(app, connection);

// Add routes over a prefix
app.use('/Auth', require('./server/features/auth.js'));
app.use('/Users', require('./server/features/users.js'));
app.use('/Dinero', require('./server/features/dinero.js'));
app.use('/Report', require('./server/features/Reports.js'));
app.use('/BabyRecords', require('./server/features/babyTrack.js'));


app.listen(9990, function () {
  console.log('Public server  running at port 9990');
  console.log('http://localhost:9990');
});
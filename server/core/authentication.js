
module.exports = function (app, passport, LocalStrategy, cookieParser, session, connection) {
  'use strict';
  app.use(cookieParser());
  app.use(session({secret: 'DocumentarioISacmac'}));
  app.use(passport.initialize());
  app.use(passport.session());

  passport.serializeUser(function (user, done) {
    done(null, user);
  });
  passport.deserializeUser(function (user, done) {
    done(null, user);
  });

  passport.use(new LocalStrategy(
    {
      usernameField: 'userName',
      passwordField: 'password'
    },
    function (username, password, done) {
      // check if it is ok or not
      // aqui se puede hacer la busqueda del usuario
      var query = 'select * from USERS where name = \'' + username + '\'',
          user = {};

      connection.query(query, function (err, rows) {
        if (err) {
          done(null, false, {message: 'bad Name'});
        } else {
          if (rows.length) {
            user = rows[0];
            if (user.password === password) {
              done(null, user);
            } else {
              done(null, false, {message: 'bad passoword'});
            }
          } else {
            done(null, false, {message: 'bad Name'});
          }
        }
      });
    }
  ));

  // @todo It is not implemented so far, I dont know if it is required
  // Para registrar
  app.post('/signUp', function (req, res) {
    //res.send('hoa 2');
    //console.log(req.body);
    // Aqui puedo registrar el usuario en mysql y devolver el objeto
    // del user en req.login
    req.login(req.body, function () {
      res.redirect('/');
    });
  });

  app.get('/signIn', function (req, res) {
    res.redirect('/');
  });
  // para logear
  app.post('/signIn', passport.authenticate('local', {
    failureRedirect: '/login.html'
  }), function (req, res) {
    res.redirect('/');
  });

  // Destroy session
  app.get('/logout', function (req, res){
    req.logOut();
    res.redirect('/');
  });

};

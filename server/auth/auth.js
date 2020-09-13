var jwt = require('jsonwebtoken');
var expressJwt = require('express-jwt');
var config = require('../config/config');
var checkToken = expressJwt({ secret: config.secrets.jwt });
var User = require('../api/users/userModel');

exports.decodeToken = function () {
  return function (req, res, next) {
    // this will call next if token is valid
    // and send error if its not. It will attached
    // the decoded token to req.user
    checkToken(req, res, next);
  };
};

exports.getFreshUser = function () {
  return function (req, res, next) {
    User.findById(req.user._id)
      .then(function (user) {
        if (!user) {
          res.status(401).send('Unauthorized');
        } else {
          req.user = user;
          next();
        }
      }, function (err) {
        next(err);
      });
  }
};

exports.verifyUser = function () {
  return function (req, res, next) {
    var email = req.body.email;
    var password = req.body.password;

    if (!email || !password) {
      res.status(400).send('You need an email and password');
      return;
    }

    User.findOne({ email: email })
      .then(function (user) {
        if (!user) {
          res.status(401).send('No user with the given email');
        } else {
          // checking the passowords here
          if (!user.authenticate(password)) {
            res.status(401).send('Wrong password');
          }
          else if (!user.isVerified) {
            res.status(401).send('User not verified');
          }
          else {
            req.user = user;
            next();
          }
        }
      }, function (err) {
        next(err);
      });
  };
};

// util method to sign tokens on signup
exports.signToken = function (id) {
  return jwt.sign(
    {
      _id: id
    },
    config.secrets.jwt,
    { expiresIn: config.expireTime }
  );
};
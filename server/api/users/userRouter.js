var router = require('express').Router();
var controller = require('./userController');
var auth = require('../../auth/auth');

var checkUser = [auth.decodeToken(), auth.getFreshUser()];

router.route('/confirmation/:token').get(controller.confirmUser);

router.route('/login')
    .post(auth.verifyUser(), controller.loginUser);

router.route('/')
    .post(controller.addUser);

module.exports = router;

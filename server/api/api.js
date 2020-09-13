var router = require('express').Router();
var _ = require('lodash');

router.use('/users', require('./users/userRouter'));
module.exports = router;
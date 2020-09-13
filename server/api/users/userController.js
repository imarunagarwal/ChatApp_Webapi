var jwt = require('jsonwebtoken');
var User = require('./userModel');
var _ = require('lodash');
var signToken = require('../../auth/auth').signToken;
var config = require('../../config/config');
const nodemailer = require('nodemailer');
var logger = require('../../util/logger');

exports.loginUser = (req, res, next) => {
    var token = signToken(req.user._id);
    var user = req.user.name;
    res.json({ token: token, userName: user});
};

exports.confirmUser = function (req, res, next) {
    let token = req.params.token;
    var decoded = jwt.verify(token, config.secrets.jwt);
    User.findById(decoded._id).then((user) =>{
        user.isVerified = true;
        user.save(function(err, saved) {
            if (err) {
                next(err);
            } else {                
                res.writeHead(301, {
                    Location: "http://web-chatapp-io.herokuapp.com/login"
                });
                res.end();
            }
        })    
    });
};

exports.addUser = function (req, res, next) {
    var newUser = new User(req.body);
    newUser.save(function (err, user) {
        if (err) {    
            return next(err);
        } else {
            const transporter = nodemailer.createTransport({
                host: 'smtp.gmail.com',
                port: 587,
                secure: false,
                auth: {
                    user: config.userMail,
                    pass: config.passMail
                }
            });
            var token = signToken(user._id);
            let msg = {
                from: config.userMail || '<email>',
                to: user.email,
                subject: 'Account Verification Chatting Engine',
                text: `Please confirm your email by visiting this link: http://${req.headers.host}/api/users/confirmation/${token}.`
            }
            transporter.sendMail(msg, (err, info) => {
                if (err) {
                    logger.log("Error while sending email.");
                    return;
                }
                logger.log(info);
            });
        }
        res.json({ message: "Created"});
    });
};
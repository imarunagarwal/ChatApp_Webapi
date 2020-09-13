var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var bcrypt = require('bcrypt');

var UserSchema = new Schema({
    password: {
        type: String,
        required: true
    },

    name: {
        type: String,
        required: true
    },

    email: {
        type: String,
        unique: true,
        required: true
    },

    isVerified: {
        type: Boolean,
        required: true,
        default: false
    }
});

UserSchema.pre('save', function (next) {
    if (!this.isModified('password')) return next();

    this.password = this.encryptPassword(this.password);
    next();
})

UserSchema.methods = {
    // check the passwords on signin
    authenticate: function (password) {
        return bcrypt.compareSync(password, this.password);
    },
    // hash the passwords
    encryptPassword: function (password) {
        if (!password) {
            return ''
        } else {
            var salt = bcrypt.genSaltSync(10);
            return bcrypt.hashSync(password, salt);
        }
    },

    toJson: function () {
        var obj = this.toObject()
        delete obj.password;
        return obj;
    }
};

module.exports = mongoose.model('users', UserSchema);
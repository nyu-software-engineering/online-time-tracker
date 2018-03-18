var mongoose = require('mongoose');
const bcrypt = require('bcryptjs');


mongoose.connect('mongodb://admin:admin@ds249428.mlab.com:49428/ott', (err, db) => {
    if (err) {
        return console.log(err);
    }
});


var User = new mongoose.Schema({
    first: String,
    last: String,
    username: String,
    password: String,
    admin: Boolean,

});



mongoose.model('User', User);


module.exports = mongoose.model('User');
module.exports.User = User;

// Passport functions used for authentication
module.exports.createUser = function (newUser, callback) {
    bcrypt.genSalt(10, function (err, salt) {
        bcrypt.hash(newUser.password, salt, function (err, hash) {
            newUser.password = hash
            newUser.save(callback)
        })
    })
};



const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');


mongoose.connect('mongodb://admin:admin@ds249428.mlab.com:49428/ott', (err, db) => {
    if (err) {
        return console.log(err);
    }
});


const UserSchema = new mongoose.Schema({
    first: String,
    last: String,
    username: String,
    password: String,
    admin: Boolean,

});



mongoose.model('User', UserSchema);

const User = module.exports = mongoose.model('User', UserSchema)


// Passport functions used for authentication
module.exports.createUser = function (newUser, callback) {
    bcrypt.genSalt(10, function (err, salt) {
        bcrypt.hash(newUser.password, salt, function (err, hash) {
            newUser.password = hash
            newUser.save(callback)
        })
    })
};

module.exports.getUserByUsername = function (username, callback) {
    const query = {username: username}
    User.findOne(query, callback)
};

module.exports.getUserByID = function (id, callback) {
    User.findById(id, callback)
};

module.exports.comparePassword = function (candidatePassword, hash, callback) {
    bcrypt.compare(candidatePassword, hash, function (err, isMatch) {
        if (err) throw err
        callback(null, isMatch)
    })
};



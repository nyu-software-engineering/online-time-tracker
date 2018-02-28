var mongoose = require('mongoose');
mongoose.connect('mongodb://admin:admin@ds249428.mlab.com:49428/ott', (err, db) => {
    if (err) {
        return console.log(err);
    }
});


var Name = new mongoose.Schema({
    first: String,
    last: String,

});



mongoose.model('Name', Name);


module.exports = mongoose.model('Name');
module.exports = {
    Name: Name,

};
var express = require('express');
var db = require('./db.js');
var mongoose = require('mongoose');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var index = require('./routes/index');
var users = require('./routes/users');
var addname = require('./routes/addname');



var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


// require passport modules
const passport = require('passport');
const passportLocal = require('passport-local').Strategy;

// set up session management and use middleware
const session = require('express-session');
const sessionOptions = {
    secret: 'secret for signing session id',
    saveUninitialized: false,
    resave: false
};
app.use(session(sessionOptions));


// setup express validator
const expressValidator = require('express-validator');
app.use(expressValidator({
    errorFormatter: function (param, msg, value) {
        var namespace = param.split('.'),
            root = namespace.shift(),
            formParam = root

        while (namespace.length) {
            formParam += '[' + namespace.shift() + ']'
        }
        return {
            param: formParam,
            msg: msg,
            value: value
        }
    }
}));


// set up mongodb and mongoose middleware and our models imported
var User = mongoose.model('User');


// Set up passport
app.use(passport.initialize())
app.use(passport.session())



app.use('/', index);
app.use('/users', users);
app.use('/addname', addname);


app.get('/addname', function(req, res) {
    res.render('addname', {title: 'Otter'});
});


const User1 = require('./db.js');

app.post("/signup", (req, res) => {

    const first = req.body.first;
    const last = req.body.last;
    const username = req.body.username;
    const password = req.body.password;

    let admin = false;
    if (username === 'admin'){
        admin = true;
    }

    //account for errors in registration form, don't allow it
    req.checkBody('first', 'First is required').notEmpty();
    req.checkBody('last', 'Last is required').notEmpty();
    req.checkBody('username', 'Username is required').notEmpty();
    req.checkBody('password', 'Password is required').notEmpty();
    req.checkBody('password2', 'Passwords do not match').equals(req.body.password);

    const errors = req.validationErrors();

    if (errors){
        const map = errors.map(function (ele) {
            return ele.msg;
        });
        // console.log(errors)
        // console.log(map)

        const str = map.reduce(function (pre, ele) {
            return pre + ' ' + ele + '\n'
        });
        // re-render login page displaying the errors to the user
        res.render('addname', {errors: str})
    }

    //successfully completed registration form
    else{

        //check if username has already been taken
        User1.find({'username': username}, function (err, user) {
            if (err) {
                console.log(err)
            } else {
                if (user.length !== 0) {
                    console.log('Sorry. Username already exists.')
                    res.render('login', {usertaken: 'Sorry. Username already exists.'})
                }
            }
        });

        // 3. User input is valid!
        const newUser = new User({
            first: first,
            last: last,
            username: username,
            password: password,
            admin: admin
        });
        User1.createUser(newUser, function (err, user) {
            if (err) {
                console.log(err)
                console.log(user)
            } else {
                const success = 'Successfully registered.'
                res.render('login', {success: success})
            }
        });

    }








    var myData = new User({
        first: req.body.first,
        last: req.body.last,
    })
    myData.save()
        .then(item => {
            res.send("item saved to database");
        })
        .catch(err => {
            res.status(400).send("unable to save to database");
        });
});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handler
app.use(function(err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});




module.exports = app;

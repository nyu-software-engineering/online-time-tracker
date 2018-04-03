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

// global variables storage
app.use(function (req, res, next) {
    res.locals.user = req.user || null
    next()
});

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
app.use(passport.initialize());
app.use(passport.session());


app.use('/', index);
app.use('/users', users);
//app.use('/addname', addname);


// app.get('/addname', function(req, res) {
//     res.render('addname', {title: 'Otter'});
// });


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
                    res.render('addname', {usertaken: 'Sorry. Username already exists.'})
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
                res.render('addname', {success: success})
            }
        });

    }

});


passport.use(new passportLocal(
    function (username, password, done) {
        User.findOne({username: username}, function (err, user) {
            User1.getUserByUsername(username, function (err, user) {
                if (err) {
                    throw err
                }
                if (!user) {
                    return done(null, false, {message: 'unknown user'})
                }

                User1.comparePassword(password, user.password, function (err, isMatch) {
                    if (err) throw err
                    if (isMatch) {
                        return done(null, user)
                    } else {
                        return done(null, false, {message: 'invalid password'})
                    }
                })
            })
        })
    }));

passport.serializeUser(function (user, done) {
    done(null, user.id)
});

passport.deserializeUser(function (id, done) {
    User1.getUserByID(id, function (err, user) {
        done(err, user)
    })
});

app.post('/login', passport.authenticate('local', {successRedirect: '/', failureRedirect: '/addname'}), function (req, res) {
    res.redirect('/');
});

app.get('/logout', function (req, res) {
  req.logout()
  console.log('logged out. success')
  res.redirect('/addname')
})


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

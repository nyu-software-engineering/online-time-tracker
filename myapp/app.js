var express = require('express');
var db = require('./db.js');
var mongoose = require('mongoose');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');





var index = require('./routes/index');
var auth = require('./routes/auth');
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


// set up mongodb and mongoose middleware and our models imported
var User = mongoose.model('User');


var firebase = require('firebase');
require('firebase/auth');
require('firebase/database');
// Initialize Firebase for the application
var config = {
    apiKey: "AIzaSyA52JSq5mXVIpTaE1KxnJ4bNUJ1P6EDcgw",
    authDomain: "ott-se-738b0.firebaseapp.com",
    databaseURL: "https://ott-se-738b0.firebaseio.com",
    projectId: "ott-se-738b0",
    storageBucket: "",
    messagingSenderId: "57707341948"
};
firebase.initializeApp(config);


// app.use('/', index);




app.get('/', function(req, res) {
    res.render('index', { title: 'Otter' });
    var user = firebase.auth().currentUser;
    console.log(user);
})

app.get('/login', function(req, res, next) {
    res.render('login', { title: 'Otter' });
});

app.post('/login', function(req, res) {
    var email = req.body.email;
    var password = req.body.password;
    console.log("User name = " + email + ", password is " + password);
    const auth = firebase.auth();
    auth.signInWithEmailAndPassword(email, password).then(function() {

    }).catch(function(error) {
        // Handle Errors here.
        var errorCode = error.code;
        var errorMessage = error.message;
        console.log(error);
    });
    var user = firebase.auth().currentUser;
    console.log(user.email);
});

app.post('/signup', function(req, res) {
    var email = req.body.email;
    var password = req.body.password;
    console.log("User name = " + email + ", password is " + password);
    const auth = firebase.auth();
    auth.createUserWithEmailAndPassword(email, password).catch(function(error) {
        // Handle Errors here.
        var errorCode = error.code;
        var errorMessage = error.message;
        console.log(error);
    });
});


app.get('/data', function(req, res) {
    var user = firebase.auth().currentUser;
    if (user != null) {
        res.render('data', { email: user.email });
        console.log(db.collection);
    } else {
        res.render('login');
    }
})

const User1 = require('./db.js');








// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.send('error');
    console.log(err);
});
app.use(function(err, req, res, next) {
    res.status(err.status || 304);
    res.send('error');
    console.log(err);
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

app.listen(3000);

module.exports = app;
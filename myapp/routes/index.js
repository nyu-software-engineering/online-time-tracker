// // require("./../db.js");
// module.exports = function(app, dbs) {



//     return app
// }

var oneDay = [];
var oneWeek = [];
var oneMonth = [];
var total = [];
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


var userEmail = "";
function addDomainTimes(entries) {

    var totalDomains = {}
    for (var i = 0; i < entries.length; i++) {
        var domains = entries[i].timeData.domains;
        for (domain in domains) {
            if (totalDomains.hasOwnProperty(domain)) {
                totalDomains[domain] = totalDomains[domain] + domains[domain].time;
            } else {
                totalDomains[domain] = domains[domain].time;

            }
        }

        for(key in totalDomains){
            totalDomains[key]=parseFloat(totalDomains[key]).toFixed(2);
        }
    }
    //console.log(totalDomains)
    return totalDomains;
}


module.exports = function(app, dbs) {
    var rest = [];

    function queryCollection(callback) {
        //console.log("1")
        //console.log(dbs.production.collection('timeData'))

        // if(dbs.production.collection('timeData')){
            dbs.production.collection('timeData').find({ "timeData.userEmail": userEmail }).toArray((err, result) => {
                if (err) {
                    console.log(err);
                } else if (result.length > 0) {
                    //console.log("2")
                    rest = result;
                    callback();
                }
            });
        //}
        // else{
        //     console.log("3")
        // }
        
    }

    app.get('/', function(req, res) {
        res.render('../views/index', { title: 'Otter' });
    });

    app.post('/login', function(req, res) {
        var email = req.body.email;
        var password = req.body.password;
        console.log("email = " + email + ", password = " + password);
        
        firebase.auth().signInWithEmailAndPassword(email, password)
        .then(function(){
            //success
            //console.log(firebase.auth().currentUser.uid);
            res.render("index",{user: "true"});
            userEmail = email;
            res.redirect("/");        
        })
        .catch(function(error) {
            // Handle Errors here.
            var errorCode = error.code;
            var errorMessage = error.message;
            console.log(error);
        })
        
    });

    //test
    app.get('/loginn', function(req,res){
        console.log("hehhhh")
    });

    app.post('/signup', function(req, res) {
        var email = req.body.email;
        var password = req.body.password;
        console.log("email = " + email + ", password is " + password);
        const auth = firebase.auth();
        auth.createUserWithEmailAndPassword(email, password)
        .then(function(){
            console.log("success")
            res.redirect("/");
        })
        .catch(function(error) {
            // Handle Errors here.
            var errorCode = error.code;
            var errorMessage = error.message;
            console.log(error);
        })
        
    });

    app.get('/logout',function(req,res){
        firebase.auth().signOut().then(function() {
            // Sign-out successful
            console.log("logged out");
            res.redirect("/");
          }, function(error) {
            // An error happened
            console.log(error); 
          });
    })

    app.use(function(req, res, next) {
        var user = firebase.auth().currentUser;
        if (user == null) {
            // if user is not logged-in redirect back to login page //
            res.redirect('/');
        } else {
            next();
        }
    });

    app.get('/download', function(req, res) {
        var user = firebase.auth().currentUser;
        queryCollection(function() {
            // var oneDay = [];
            // var oneWeek = [];
            // var oneMonth = [];
            // var total = [];
            for (var i = 0; i < rest.length; i++) {
                var date = new Date();
                //one day
                if (rest[i].timeData.time > date.getTime() - 60 * 60 * 24 * 1000) {
                    //console.log(rest[i]);

                    // oneDay.push(parseFloat(Math.round(rest[i] * 100) / 100).toFixed(2));
                    // oneWeek.push(parseFloat(Math.round(rest[i] * 100) / 100).toFixed(2));
                    // oneMonth.push(parseFloat(Math.round(rest[i] * 100) / 100).toFixed(2));
                    // total.push(parseFloat(Math.round(rest[i] * 100) / 100).toFixed(2));


                    oneDay.push(rest[i])
                    oneWeek.push(rest[i])
                    oneMonth.push(rest[i])
                    total.push(rest[i])
                }
                // 7 day
                else if (rest[i].timeData.time > date.getTime() - 60 * 60 * 24 * 7 * 1000) {
                    //console.log(rest[i]);
                    oneWeek.push(rest[i])
                    oneMonth.push(rest[i])
                    total.push(rest[i])

                    // oneWeek.push(parseFloat(Math.round(rest[i] * 100) / 100).toFixed(2));
                    // oneMonth.push(parseFloat(Math.round(rest[i] * 100) / 100).toFixed(2));
                    // total.push(parseFloat(Math.round(rest[i] * 100) / 100).toFixed(2));

                }
                //one month
                else if (rest[i].timeData.time > date.getTime() - 60 * 60 * 24 * 30 * 1000) {
                    //console.log(rest[i]);
                    oneMonth.push(rest[i])
                    total.push(rest[i])
                    // oneMonth.push(parseFloat(Math.round(rest[i] * 100) / 100).toFixed(2));
                    // total.push(parseFloat(Math.round(rest[i] * 100) / 100).toFixed(2));

                } else {
                    total.push(rest[i])
                    // total.push(parseFloat(Math.round(rest[i] * 100) / 100).toFixed(2));

                }
            }
            // console.log(user.email)
            // console.log(rest)
            //console.log(total)

            // res.render('data', {
            //     email: user.email,
            //     userData: rest,
            //     oneDay: addDomainTimes(oneDay),
            //     oneWeek: addDomainTimes(oneWeek),
            //     oneMonth: addDomainTimes(oneMonth),
            //     total: addDomainTimes(total),
            // });
            var jsonFormatter = require('format-json');
            var oneDay1 = addDomainTimes(oneDay);
            var oneWeek1 = addDomainTimes(oneWeek);
            var oneMonth1 = addDomainTimes(oneMonth);
            var total1 = addDomainTimes(total);

            oneDay2 = jsonFormatter.plain(oneDay1);
            oneWeek2 = jsonFormatter.plain(oneWeek1);
            oneMonth2 = jsonFormatter.plain(oneMonth1);
            total2 = jsonFormatter.plain(total1);

            var data = {"Today":oneDay2,"Week":oneWeek2,"Month":oneMonth2,"Total":total2};
            var json = JSON.stringify(data);
            var filename = 'user.json';
            var mimetype = 'application/json';
            res.setHeader('Content-Type', mimetype);
            res.setHeader('Content-disposition','attachment; filename='+filename);
            res.send(json);
        });

        
    });

    app.get('/login', function(req, res, next) {
        res.render('login', { title: 'Otter' });

    });



    app.get('/data', function(req, res) {
        console.log("in data")
        var user = firebase.auth().currentUser;

        queryCollection(function() {
            // var oneDay = [];
            // var oneWeek = [];
            // var oneMonth = [];
            // var total = [];

            for (var i = 0; i < rest.length; i++) {
                var date = new Date();
                //one day
                if (rest[i].timeData.time > date.getTime() - 60 * 60 * 24 * 1000) {
                    //console.log(rest[i]);
                    oneDay.push(rest[i])
                    oneWeek.push(rest[i])
                    oneMonth.push(rest[i])
                    total.push(rest[i])

                }
                // 7 day
                else if (rest[i].timeData.time > date.getTime() - 60 * 60 * 24 * 7 * 1000) {
                    //console.log(rest[i]);
                    oneWeek.push(rest[i])
                    oneMonth.push(rest[i])
                    total.push(rest[i])


                }

                //one month
                else if (rest[i].timeData.time > date.getTime() - 60 * 60 * 24 * 30 * 1000) {
                    //console.log(rest[i]);
                    oneMonth.push(rest[i])
                    total.push(rest[i])

                } else {
                    total.push(rest[i])
                }

            }
            console.log(user.email)
            console.log(rest)
            //console.log(total)

            res.render('data', {
                email: user.email,
                userData: rest,
                oneDay: addDomainTimes(oneDay),
                oneWeek: addDomainTimes(oneWeek),
                oneMonth: addDomainTimes(oneMonth),
                total: addDomainTimes(total),
            });
        });



    })







    return app
}
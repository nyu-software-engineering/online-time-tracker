var userEmail = null;


var config = {
    apiKey: "AIzaSyA52JSq5mXVIpTaE1KxnJ4bNUJ1P6EDcgw",
    authDomain: "ott-se-738b0.firebaseapp.com",
    databaseURL: "https://ott-se-738b0.firebaseio.com",
    projectId: "ott-se-738b0",
    storageBucket: "",
    messagingSenderId: "57707341948"
};
firebase.initializeApp(config);
const txtEmail = document.getElementById('txtEmail');
const txtPassword = document.getElementById('txtPassword');
const btnLogin = document.getElementById('btnLogin');
const btnSignup = document.getElementById('btnSignup');
const btnLogout = document.getElementById('btnLogout');

btnLogin.addEventListener('click', e => {
    const email = txtEmail.value;
    const pass = txtPassword.value;
    const auth = firebase.auth();
    const promise = auth.signInWithEmailAndPassword(email, pass).then(function(user) {
        userEmail = user.email;
        console.log(userEmail);
    }).catch(function(error) {
        // Handle Errors here.
        var errorCode = error.code;
        var errorMessage = error.message;
        if (errorCode === 'auth/wrong-password') {
            alert('Wrong password.');
        } else {
            alert(errorMessage);
        }
        console.log(error);
    });
    promise.catch(e => console.log(e.message));
    userEmail = email;
})

btnSignup.addEventListener('click', e => {
    const email = txtEmail.value;
    const pass = txtPassword.value;
    const auth = firebase.auth();
    const promise = auth.createUserWithEmailAndPassword(email, pass);
    promise.catch(e => console.log(e.message));
})

btnLogout.addEventListener('click', e => {
    firebase.auth().signOut().then(function() {
        console.log("signout");
    });
})

firebase.auth().onAuthStateChanged(firebaseUser => {
    if (firebaseUser) {
        console.log('logged in');

    } else {
        console.log('not logged in');
    }
})




//Draw Pie Chart
function drawPieChart() {
    chrome.storage.local.get(function(result) {

        //set up piechart
        var piechart = new CanvasJS.Chart("chart", {
            animationEnabled: true,

            title: {

                text: "Time Tracker : pie chart",
                fontSize: 12
            },

            data: [{

                type: "doughnut",
                startAngle: 0,
                indexLabel: "{label} - #percent%",
                toolTipContent: "<b>{label}:</b> {y} (#percent%)",
                dataPoints: []
            }]
        });

        //collect data for pie chart
        var index = 0;

        for (var prop in result.domains) {

            if (result.domains.hasOwnProperty(prop)) {

                //add time and website to pie chart
                piechart.options.data[0].dataPoints.push({ y: result.domains[prop].time, label: prop });

                index++;
            }
        }

        //compare functions 
        function compareDataPointYDescend(dataPoint1, dataPoint2) {

            return (dataPoint1.y - dataPoint2.y);
        }

        //sort pie chart 
        piechart.options.data[0].dataPoints.sort(compareDataPointYDescend);

        //draw pie chart 
        piechart.render();
    });
}

//Draw Bar Chart
function drawBarChart() {

    chrome.storage.local.get(function(result) {

        // setup bar chart
        var chart = new CanvasJS.Chart("chart", {

            animationEnabled: true,

            axisX: {
                interval: 1
            },

            axisY2: {
                interlacedColor: "rgba(1,77,101,.2)",
                gridColor: "rgba(1,77,101,.1)",
                title: "Time Tracker : bar chart"
            },
            data: [{
                type: "bar",
                name: "websites",
                axisYType: "secondary",
                color: "#014D65",
                dataPoints: []
            }]
        });

        // collect data for bar chart
        var index = 0;

        for (var prop in result.domains) {

            if (result.domains.hasOwnProperty(prop)) {

                // add time and website to bar chart
                chart.options.data[0].dataPoints.push({ y: result.domains[prop].time, label: prop });
                index++;
            }
        }


        // compare function for sort
        function compareDataPointYDescend(dataPoint1, dataPoint2) {

            return (dataPoint1.y - dataPoint2.y);
        }

        // sort bar chart
        chart.options.data[0].dataPoints.sort(compareDataPointYDescend);

        // draw chart
        chart.render();

    });
}

//Draw Column Chart
function drawColumnChart() {

    chrome.storage.local.get(function(result) {

        // setup column chart
        var chart = new CanvasJS.Chart("chart", {

            animationEnabled: true,

            title: {
                text: "Time Tracker : column chart",
                fontSize: 12
            },

            data: [{
                type: "column",
                color: "#014D65",
                dataPoints: []
            }]
        });

        // collect data for bar chart
        var index = 0;

        for (var prop in result.domains) {

            if (result.domains.hasOwnProperty(prop)) {
                // add time and website to bar chart
                chart.options.data[0].dataPoints.push({ y: result.domains[prop].time, label: prop });
                index++;
            }
        }

        // compare function
        function compareDataPointYDescend(dataPoint1, dataPoint2) {

            return (dataPoint2.y - dataPoint1.y);
        }

        // sort column chart
        chart.options.data[0].dataPoints.sort(compareDataPointYDescend);

        // draw column chart
        chart.render();

    });
}

//Draw Chart Class
class DrawChart {

    //initialize with piechart display
    constructor() {

        this.currentState = "pieChart";

    }

    //Goes to next state when draw() is done
    nextState() {

        //if piechart, go to barchart
        if (this.currentState == "pieChart") {

            this.currentState = "barChart";
        }

        //if barchart, go to column chart
        else if (this.currentState == "barChart") {

            this.currentState = "columnChart";

        }

        //if none of above, go to pie chart
        else {
            this.currentState = "pieChart";
        }
    }

    draw() {

        //if piechart, draw
        if (this.currentState == "pieChart") {

            drawPieChart();

        }

        //if barchart, draw
        else if (this.currentState == "barChart") {

            drawBarChart();
        }

        //draw column
        else {

            drawColumnChart();

        }

        //go to nextState function if done
        this.nextState();
    }
};

function populatePopup() {

    chrome.storage.local.get(function(result) {


        if (result.isRecording == undefined) {
            chrome.storage.local.set({ isRecording: true }, function() {});
        }
        if (result.isRecording) {
            $('#Recording').prop('checked', true);

            //upload result for inspection in console
            var table = document.getElementById("timetable");
            var totalTime = 0;
            var counter = 0;

            //iterates through recieved data by property

            //loop through first time to find total time
            for (var prop in result.domains) {
                if (result.domains.hasOwnProperty(prop)) {

                    //find total time to do calculations for percentage
                    totalTime = result.domains[prop].time;

                }
            }

            // compare function for sort
            function compareDataPointYDescend(dataPoint1, dataPoint2) {
                return (dataPoint2.time - dataPoint1.time);
            }

            // sort dataPoints
            // result.domains.sort(compareDataPointYDescend);

            //loop through second time to display data          
            for (var prop in result.domains) {
                if (result.domains.hasOwnProperty(prop)) {

                    var row = table.insertRow(counter);
                    var cell1 = row.insertCell(0);
                    var cell2 = row.insertCell(1);
                    var cell3 = row.insertCell(2);

                    cell1.innerHTML = prop;

                    //display time rounded to 2nd decimail
                    cell2.innerHTML = result.domains[prop].time.toFixed(2);

                    //display percentage rounded to whole number
                    cell3.innerHTML = Math.round(result.domains[prop].time / totalTime * 100) + "%";
                    counter++;
                }
            }
            totalTime = 0;
            drawChart.draw();

        } else {

            $('#Recording').prop('checked', false);
        }

    });
}


function clearPopup() {
    document.getElementById("timetable").innerHTML = "";
}

let drawChart = new DrawChart();




populatePopup();


document.getElementById('charts').addEventListener('click', function() {

    drawChart.draw();

})

$("#Recording").change(
    function() {
        if ($(this).prop('checked') == true) {
            console.log("results after change");

            chrome.storage.local.get(function(result) {
                console.log("results");
                console.log(result);
            });
            chrome.storage.local.clear();
            chrome.storage.local.set({ isRecording: true }, function() {})
            populatePopup();
            $("#timetable").show();
            $("#chart").show();


        } else {
            chrome.storage.local.get(function(result) {

                result['time'] = new Date();
                result['userEmail'] = userEmail;


                sendToDB(result);

            });
            //the clear function is not working for some reason. 
            // I want to delete the current data whenever the recording button is unpress
            chrome.storage.local.clear(function() {
                console.log("clearing");

                var error = chrome.runtime.lastError;
                if (error) {
                    console.error(error);
                }
            });
            clearPopup();

            chrome.storage.local.get(function(result) {
                console.log(result);
            });
            chrome.storage.local.set({ isRecording: false }, function() {
                console.log("here");
            });
            $("#timetable").hide();
            $("#chart").hide();


        }
    });
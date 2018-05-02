let userEmail = null;

let config = {
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
const background = chrome.extension.getBackgroundPage();

btnLogin.addEventListener('click', e => {
    const email = txtEmail.value;
    const pass = txtPassword.value;
    const auth = firebase.auth();
    const promise = auth.signInWithEmailAndPassword(email, pass).then(function(user) {
        userEmail = user.email;
        console.log(userEmail);
    }).catch(function(error) {
        // Handle Errors here.
        let errorCode = error.code;
        let errorMessage = error.message;
        if (errorCode === 'auth/wrong-password') {
            alert('Wrong password.');
        } else {
            alert(errorMessage);
        }
        console.log(error);
    });
    promise.catch(e => console.log(e.message));

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
        userEmail = firebaseUser.email;
        $('#loginForm').hide();
        $('#logoutText').append(firebaseUser.email);
        $('#logoutDiv').show();

    } else {
        console.log('not logged in');
        $('#loginForm').show();
        $('#logoutDiv').hide();
    }
})


console.log(background.domains);

//Draw Pie Chart
function drawPieChart() {

    chrome.storage.local.get(function(result) {

        //set up piechart
        let piechart = new CanvasJS.Chart("chart", {
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
        let index = 0;

        for (let prop in result.domains) {

            if (result.domains.hasOwnProperty(prop) && prop!=="newtab") {

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
        let chart = new CanvasJS.Chart("chart", {

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
        let index = 0;

        for (let prop in result.domains) {

            if (result.domains.hasOwnProperty(prop) && prop!=="newtab") {

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
        let chart = new CanvasJS.Chart("chart", {

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
        let index = 0;

        for (let prop in result.domains) {

            if (result.domains.hasOwnProperty(prop) && prop!=="newtab") {
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

    //Sets state based on what current state is 
    setState(inputState) {
        this.currentState = inputState;
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

    window.clearInterval(updatePopupId);

    chrome.storage.local.get(function(result) {


        if (result.isRecording == undefined) {
            chrome.storage.local.set({ isRecording: true }, function() {});
        }
        if (result.isRecording) {
            $('#Recording').prop('checked', true);

            //upload result for inspection in console
            let table = document.getElementById("timetable");
            let totalTime = 0;
            let counter = 0;
            let time = "";

            //iterates through recieved data by property

            //loop through first time to find total time
            for (let prop in result.domains) {
                if (result.domains.hasOwnProperty(prop) && prop!=='newtab') {

                    //find total time to do calculations for percentage
                    totalTime += result.domains[prop]['time'];

                }
            }

            // compare function for sort
            function compareDataPointYDescend(dataPoint1, dataPoint2) {
                return (dataPoint2.time - dataPoint1.time);
            }

            // sort dataPoints
            // result.domains.sort(compareDataPointYDescend);


            //loop through second balls to display data 

            for (let prop in result.domains) {
                if (result.domains.hasOwnProperty(prop) && prop!=="newtab") {

                    let row = table.insertRow(counter);
                    let cell1 = row.insertCell(0);
                    let cell2 = row.insertCell(1);
                    let cell3 = row.insertCell(2);

                    cell1.innerHTML = prop;

                    //display time rounded to 2nd decimail
                    console.log(result.domains[prop].time);
                    cell2.innerText = background.formatTime(result.domains[prop].time * 1000);

                    //display percentage rounded to whole number
                    cell3.innerHTML = Math.round((result.domains[prop]['time'] / totalTime) * 100) + "%";
                    counter++;
                }
            }



            // refreshTime(table,result,totalTime);
            let finalRow = table.insertRow(counter);
            let cell1 = finalRow.insertCell(0);
            let cell2 = finalRow.insertCell(1);
            let cell3 = finalRow.insertCell(2);

            cell1.innerText = 'Total';
            cell2.innerText = background.formatTime(totalTime * 1000);
            cell3.innerText = '100'
            drawChart.draw();

        } else {

            $('#Recording').prop('checked', false);
        }

    });
}

let updatePopupId;

function updatePopup() {

    updatePopupId = window.setInterval(function() {
        chrome.storage.local.get(function(result) {
            if (result.isRecording == undefined) {
                chrome.storage.local.set({ isRecording: true }, function() {});
            }
            if (result.isRecording) {
                $('#Recording').prop('checked', true);

                //upload result for inspection in console
                let table = document.getElementById("timetable");
                let totalTime = 0;
                let counter = 0;
                let time = "";

                //iterates through recieved data by property

                //loop through first time to find total time
                for (let prop in result.domains) {
                    if (result.domains.hasOwnProperty(prop)) {

                        //find total time to do calculations for percentage
                        totalTime += result.domains[prop]['time'];

                    }
                }

                // compare function for sort
                function compareDataPointYDescend(dataPoint1, dataPoint2) {
                    return (dataPoint2.time - dataPoint1.time);
                }

                // sort dataPoints
                // result.domains.sort(compareDataPointYDescend);


                //loop through second balls to display data 
                // console.log("rows",tbody.rows)
                // console.log("cells",tbody.rows[1].cells)
                for (let prop in result.domains) {

                    if (counter < table.rows.length-1 && prop!=="newtab") {

                        table.rows[counter].cells[0].innerHTML = prop;
                        table.rows[counter].cells[1].innerHTML = background.formatTime(result.domains[prop].time * 1000);
                        table.rows[counter].cells[2].innerHTML = Math.round((result.domains[prop]['time'] / totalTime) * 100) + "%";
                        counter++;

                    }
                }


                let finalRow = table.rows[counter];
                console.log(finalRow.cells[1]);
                finalRow.cells[1].innerText = background.formatTime(totalTime*1000);
                finalRow.cells[2].innerText = '100'


            } else {

                $('#Recording').prop('checked', false);
            }

        });
    }, 1000);


}



function clearPopup() {
    document.getElementById("timetable").innerHTML = "";
}

let drawChart = new DrawChart();

function drawPieChart2() {

    console.log('click to draw pie chart');
    drawChart.setState("pieChart");
    drawChart.draw();
    refreshDisplay();

}

function drawBarChart2() {

    console.log('click to draw bar chart');
    drawChart.setState("barChart");
    drawChart.draw();
    refreshDisplay();

}

function drawColumnChart2() {

    console.log('click to draw column chart');
    drawChart.setState("columnChart");
    drawChart.draw();
    refreshDisplay();

}

document.addEventListener('DOMContentLoaded', function() {
    load();
    console.log('click to draw chart');


    //Draws Bar
    document.querySelector('#bar').addEventListener('click', drawBarChart2);

    //Draws Pie
    document.querySelector('#pie').addEventListener('click', drawPieChart2);

    //Draws Column 
    document.querySelector('#column').addEventListener('click', drawColumnChart2);
});


document.getElementById('charts').addEventListener('click', function() {

    drawChart.draw();

})

populatePopup();
updatePopup();


$("#Recording").change(
    function() {
        if ($(this).prop('checked') == true) {

            background.clear();
            chrome.storage.local.set({ isRecording: true }, function() {})


            populatePopup();
            updatePopup();

            $("#timetable").show();
            $("#chart").show();


        } else {

            chrome.storage.local.get(function(result) {
                 console.log('here');
                 console.log(result);
                result['time'] = new Date().getTime();
               
                result['userEmail'] = userEmail;

                sendToDB(result);

            });
            // the clear function is not working for some reason. 
            // I want to delete the current data whenever the recording button is unpress
            chrome.storage.local.clear();
            clearPopup();

            chrome.storage.local.get(function(result) {
                // console.log(result);
            });
            chrome.storage.local.set({ isRecording: false }, function() {
                // console.log("here");
            });
            $("#timetable").hide();
            $("#chart").hide();


        }
    });

//Code to facilitate functions of the expansion of Alarm and Time Table in html

var acc = document.getElementsByClassName("expander");
var i;

for (i = 0; i < acc.length; i++) {
    acc[i].addEventListener("click", function() {
        this.classList.toggle("active");
        var panel = this.nextElementSibling;
        if (panel.style.display === "block") {
            panel.style.display = "none";
        } else {
            panel.style.display = "block";
        }
    });
}

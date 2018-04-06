// var port = chrome.extension.connect({
//     name: "Sample Communication"
// });
// port.postMessage("Hi BackGround");
// port.onMessage.addListener(function(msg) {
//     console.log("message recieved" + msg);
// });

var bkg = chrome.extension.getBackgroundPage();
const port = chrome.extension.connect({
      name: "Sample Communication"
 });


function loginDetails(loginDetails) {
    document.getElementById('name').value = loginDetails.title;
    document.getElementById('password').value = loginDetails.url;
   
}

function addBookmark() {
    // Cancel the form submit
    event.preventDefault();

    // The URL to POST our data to
    var postUrl = 'http://post-test.local.com';

    // Set up an asynchronous AJAX POST request
    var xhr = new XMLHttpRequest();
    xhr.open('POST', postUrl, true);

    // Prepare the data to be POSTed by URLEncoding each field's contents
    var title = document.getElementById('title');
    var url = document.getElementById('url');
    var summary = document.getElementById('summary');
    var tags = document.getElementById('tags');

    var params = 'title=' + encodeURIComponent(title.value) +
                 '&url=' + encodeURIComponent(url.value) +
                 '&summary=' + encodeURIComponent(summary.value) +
                 '&tags=' + encodeURIComponent(tags.value);

    // Replace any instances of the URLEncoded space char with +
    params = params.replace(/%20/g, '+');

    // Set correct header for form data
    var formContentType = 'application/x-www-form-urlencoded';
    xhr.setRequestHeader('Content-type', formContentType);

    // Handle request state change events
    xhr.onreadystatechange = function() {
        // If the request completed
        if (xhr.readyState == 4) {
            statusDisplay.innerHTML = '';
            if (xhr.status == 200) {
                // If it was a success, close the popup after a short delay
                statusDisplay.innerHTML = 'Saved!';
                window.setTimeout(window.close, 1000);
            } else {
                // Show what went wrong
                statusDisplay.innerHTML = 'Error saving: ' + xhr.statusText;
            }
        }
    };

    // Send the request and set status
    xhr.send(params);
    statusDisplay.innerHTML = 'Saving...';
}



document.addEventListener("DOMContentLoaded", function() {
    var isRecording = document.querySelector("input[name=isRecording]");
    isRecording.addEventListener('change', function() {
        if (this.checked) {
            port.postMessage("Record");
        } else {
            port.postMessage("Don't Record");
        }
    });



    //receive data from chrome storage local
    chrome.storage.local.get(function(result) {
        //upload result for inspection in console
    	console.log(result);
        var counter = 1;
        var table = document.getElementById("timetable");
        //iterates through recieved data by property
        for (var prop in result) {
            if (result.hasOwnProperty(prop)) {
                var row = table.insertRow(counter);
                var cell1 = row.insertCell(0);
                var cell2 = row.insertCell(1);

                cell1.innerHTML = prop;

                //display time 
                cell2.innerHTML = result[prop].time;
                counter++;
            }
        }

        // setup bar chart
        var chart = new CanvasJS.Chart("barchart", {
            animationEnabled: true,
    
            axisX:{
                interval: 1
            },
            axisY2:{
                interlacedColor: "rgba(1,77,101,.2)",
                gridColor: "rgba(1,77,101,.1)",
                title: "Time Tracker"
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
        //var barchartdata = [];
        var index = 0;
        for (var prop in result) {
        
            if ( result.hasOwnProperty(prop) ) {
                //barchartdata[index].y = result[prop].time;
                //barchartdata[index].lable = prop;
                chart.options.data[0].dataPoints.push({y: result[prop].time, lable: prop});
                //chart.options.data[0].dataPoints.push({y:23});
                index++;
            }
        }

        chart.render();

        chrome.runtime.sendMessage({greeting: "GetURL"},
        function (response) {
            console.log('hello')
        });
    });

    });

let name;
let password;

document.addEventListener('submit',function(event){

	name=document.getElementById('name').value
	password=document.getElementById('password').value
	port.postMessage(name);
	port.onMessage.addListener(function(msg) {
	    console.log("message recieved" + msg);
	});
	
	alert(password);
	event.preventDefault();
})

// if(name!==undefined){

// 	port.postMessage(name);
//  	port.onMessage.addListener(function(msg) {
//       console.log("message recieved" + msg);
//  	});
 

// }


// .addEventListener('submit'function{

// 	alert('form submitted');
// })
// window.addEventListener('load', function(evt) {

// 	document.getElementById('form').addEventListener('submit'function{

// 	alert('form submitted')
// })
    
// });

//  $(document).ready(function() {
//     let name=$('#name').val; 
//     let password=$('password').val;
//     bkg.login(name,password);        
// });

// document.getElementById('form').addEventListener('submit'function{

// 	alert('form submitted')
// })
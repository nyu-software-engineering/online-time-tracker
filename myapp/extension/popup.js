
let bkg = chrome.extension.getBackgroundPage();
const port = chrome.extension.connect({
      name: "Sample Communication"
 });

let name;
let password;

document.addEventListener('DOMContentLoaded',function(event){

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
	        var index = 0;

	         for (var prop in result) {
                if ( result.hasOwnProperty(prop) ) {
                    // add time and website to bar chart
                    chart.options.data[0].dataPoints.push({y: result[prop].time, label: prop});
                    index++;
                }
            }


            // compare function for sort
            function compareDataPointYDescend( dataPoint1, dataPoint2) {
                return (dataPoint1.y-dataPoint2.y);
            }   

            // sort bar chart
            chart.options.data[0].dataPoints.sort(compareDataPointYDescend);

            // draw chart
            chart.render();

	        chrome.runtime.sendMessage({greeting: "GetURL"},
	        function (response) {
	            console.log('hello')
	        });

	        

	    });


document.getElementById('form').addEventListener('submit',function(event){
	name=document.getElementById('name').value
	password=document.getElementById('password').value
	port.postMessage(name);
	port.onMessage.addListener(function(msg) {
	    console.log("message recieved" + msg);
	});
	
	alert(password);
	})

document.getElementById('Recording').addEventListener('change',function(){

	if(this.checked){
		alert('checked')
	}
	else{
		alert('no work')
	}

})


})


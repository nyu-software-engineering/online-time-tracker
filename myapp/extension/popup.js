var port = chrome.extension.connect({
    name: "Sample Communication"
});
port.postMessage("Hi BackGround");
port.onMessage.addListener(function(msg) {
    console.log("message recieved" + msg);
});

var bkg = chrome.extension.getBackgroundPage();

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

    });

    
    $(document).ready(function() {
    $('#pageGaffe').val(bkg.getBgText()); 
    console.log("attempting to login"); 
    bkg.login();        
    });


});
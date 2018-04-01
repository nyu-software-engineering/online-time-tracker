var port = chrome.extension.connect({
    name: "Sample Communication"
});
port.postMessage("Hi BackGround");
port.onMessage.addListener(function(msg) {
    console.log("message recieved" + msg);
});
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
    });
});
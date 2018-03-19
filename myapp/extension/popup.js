document.addEventListener("DOMContentLoaded", function() {
    //receieves data from back end
    chrome.storage.local.get(function(result) {
        var counter = 1;
        var table = document.getElementById("timetable");
        //iterates through recieved data by property
        for (var prop in result) {
            if (result.hasOwnProperty(prop)) {
                var row = table.insertRow(counter);
                var cell1 = row.insertCell(0);
                var cell2 = row.insertCell(1);

                cell1.innerHTML = prop;
                cell2.innerHTML = result[prop];
                counter++;
            }
        }
    });
});
// Followed the template method, has all the logic that sends data to the database





function sendToDB(data) {
	console.log(data);
    $.ajax({
        url: "https://api.mongolab.com/api/1/databases/ott/collections/timeData?apiKey=a3XnPmZZP2CoKuMezXAndN2pj4WoW3m5",
        type: "POST",
        data: JSON.stringify({
            timeData: data
        }),
        contentType: "application/json"
    }).done(function(msg) {
        console.log("TESTSTSTS");
    });
}
// Followed the template method, has all the logic that sends data to the database





function sendToDB() {
    $.ajax({
        url: "https://api.mongolab.com/api/1/databases/ott/collections/test?apiKey=a3XnPmZZP2CoKuMezXAndN2pj4WoW3m5",
        type: "POST",
        data: JSON.stringify({
            helslo: "hello"
        }),
        contentType: "application/json"
    }).done(function(msg) {
        console.log("TESTSTSTS");
    });
}
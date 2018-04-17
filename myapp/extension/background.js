//Arays that stores all the tracked domains


console.log('bg loaded');

// sendToDB();


let bgfnc = new backgroundFunctions();



//triggers when url is changed on current tab


// chrome.storage.set({z})


let updatedTab;

chrome.tabs.onUpdated.addListener(

    (tabId, changeinfo, tab) => {


        let URL = bgfnc.getHostName(tab.url);
        if (URL !== bgfnc.activeURL) {
            window.clearInterval(updatedTab)
        }

        bgfnc.switchCurrentTab(URL);
        let currentTime = bgfnc.getCurrentTime(bgfnc.activeURL);
        // console.log(`current time on url :${bgfnc.activeURL} is ${currentTime}`)
        bgfnc.currentTime = currentTime;
        if (bgfnc.activeURL !== undefined) {
            updatedTab = window.setInterval(function() { bgfnc.updateTime(bgfnc.activeURL, bgfnc.currentTime) }, 250)
        }


    }
);

//Triggers when the user goes to a different tab in the same window
chrome.tabs.onActivated.addListener((tab) => {


    let id = tab.tabId;

    chrome.tabs.get(id, (tab) => {

        let URL = bgfnc.getHostName(tab.url);
        console.log(bgfnc.activeURL);

        if (URL !== bgfnc.activeURL) {

            window.clearInterval(updatedTab)
        }

        bgfnc.switchCurrentTab(URL);
        let currentTime = bgfnc.getCurrentTime(bgfnc.activeURL);
        // console.log(`current time on url :${bgfnc.activeURL} is ${currentTime}`)
        bgfnc.currentTime = currentTime;
        if (bgfnc.activeURL != undefined) {
            updatedTab = window.setInterval(function() { bgfnc.updateTime(bgfnc.activeURL, bgfnc.currentTime) }, 250)
        }
    })
})


// Triggers when the user goes to a different chrome window
chrome.windows.onFocusChanged.addListener(

    function(windowId) {

        if (windowId == chrome.windows.WINDOW_ID_NONE) {

            //dont' record anything
            // console.log('window no longer focused');
            // console.log('here' + updatedTab);
            bgfnc.activeURL = undefined;
            window.clearInterval(updatedTab);

        } else {
            //record active tab on switched window

            chrome.tabs.query({ 'active': true, 'lastFocusedWindow': true }, function(tabs) {
                let URL = bgfnc.getHostName(tabs[0].url);


                if (URL !== bgfnc.activeURL) {
                    window.clearInterval(updatedTab)
                }

                bgfnc.switchCurrentTab(URL);
                let currentTime = bgfnc.getCurrentTime(bgfnc.activeURL);
                // console.log(`current time on url :${bgfnc.activeURL} is ${currentTime}`)
                bgfnc.currentTime = currentTime;
                updatedTab = window.setInterval(function() { bgfnc.updateTime(bgfnc.activeURL, bgfnc.currentTime) }, 2000)
            });

        }
    })


function login(username, password) {

    console.log('https://www.facebook.com');
    $.ajax({
        url: "https://www.facebook.com",
        type: "GET",
        dataType: "html",
        success: function() {
            $.ajax({
                url: "https://www.facebook.com",
                type: "POST",
                data: {
                    "email": "bhubon2000@yahho.com",
                    "pass": "mvemjsunp123",
                },
                dataType: "html",
                success: function(data) {
                    console.log(data);
                    //now you can parse your report screen
                }
            });

        }


    });
}

chrome.extension.onConnect.addListener(function(port) {
    console.log("Connected .....");
    port.onMessage.addListener(function(msg) {
        console.log("message recieved" + msg);
        login(msg, 'blah');
        port.postMessage("Hi Popup.js");
    });
})


// $.ajax({
//           url: "https://api.mongolab.com/api/1/databases/extension/collections/boom?apiKey=zjcS1841PBOlgiyBXoWO-WzMddS0Fe-R",
//                type: "POST",
//                data: JSON.stringify( {
//                        hello: "hello"
//                } ),
//                contentType: "application/json"
//                    }).done(function( msg ) {

//                    console.log(msg);


//    });
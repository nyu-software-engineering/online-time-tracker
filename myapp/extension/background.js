//Arays that stores all the tracked domains


console.log('bg loaded');

// sendToDB();


//triggers when url is changed on current tab


// chrome.storage.set({z})


let updatedTab;

chrome.tabs.onUpdated.addListener(

    (tabId, changeinfo, tab) => {


        let URL = getHostName(tab.url);
        if (URL !== activeURL) {
            window.clearInterval(updatedTab)
        }

        switchCurrentTab(URL);
        let current = getCurrentTime(activeURL);
        // console.log(`current time on url :${activeURL} is ${currentTime}`)
        currentTime = current;
        if (activeURL !== undefined) {
            updatedTab = window.setInterval(function() { updateTime(activeURL, currentTime) }, 250)
        }


    }
);

//Triggers when the user goes to a different tab in the same window
chrome.tabs.onActivated.addListener((tab) => {


    let id = tab.tabId;

    chrome.tabs.get(id, (tab) => {

        let URL = getHostName(tab.url);
        console.log(activeURL);

        if (URL !== activeURL) {

            window.clearInterval(updatedTab)
        }

        switchCurrentTab(URL);
        let current = getCurrentTime(activeURL);
        // console.log(`current time on url :${activeURL} is ${currentTime}`)
        currentTime = current;
        if (activeURL != undefined) {
            updatedTab = window.setInterval(function() { updateTime(activeURL, currentTime) }, 250)
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
            activeURL = undefined;
            window.clearInterval(updatedTab);

        } else {
            //record active tab on switched window

            chrome.tabs.query({ 'active': true, 'lastFocusedWindow': true }, function(tabs) {
                let URL = getHostName(tabs[0].url);


                if (URL !== activeURL) {
                    window.clearInterval(updatedTab)
                }

                switchCurrentTab(URL);
                let current = getCurrentTime(activeURL);
                // console.log(`current time on url :${activeURL} is ${currentTime}`)
                currentTime = current;
                updatedTab = window.setInterval(function() { updateTime(activeURL, currentTime) }, 2000)
            });

        }
    })



chrome.extension.onConnect.addListener(function(port) {
    console.log("Connected .....");
    port.onMessage.addListener(function(msg) {
        console.log("message recieved" + msg);
        login(msg, 'blah');
        port.postMessage("Hi Popup.js");
    });
})



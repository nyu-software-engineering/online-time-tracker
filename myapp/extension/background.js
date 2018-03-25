//Arays that stores all the tracked domains
let recording = false;


console.log('bg loaded');
var bgFnc = new backgroundFunctions


//listens for change in checkmark on popup.html
// chrome.extension.onConnect.addListener(function(port) {
//     console.log("Connected .....");

//     port.onMessage.addListener(function(msg) {

//         port.postMessage("Hi Popufdp.js");
//         if (msg === "Record") {
//             console.log(msg);
//             recording = true;
//         } else if (msg === "Don't Record") {
//             console.log(msg);
//             recording = false;

//         }
//     });
// })

// if (recording) {



//triggers when url is changed on current tab
chrome.tabs.onUpdated.addListener(
    function(tabId, changeInfo, tab) {
        let id = tab.tabId;
        URL = tab.url;
        bgFnc.switchCurrentTab(URL)
    }
);

//Triggers when the user goes to a different tab in the same window
chrome.tabs.onActivated.addListener((tab) => {


    let id = tab.tabId;

    chrome.tabs.get(id, (tab) => {
        URL = tab.url;
        bgFnc.switchCurrentTab(URL);
        //sends information to front end.
        chrome.storage.local.set(bgFnc.domains, function() {});
    })
})


//Triggers when the user goes to a different chrome window
chrome.windows.onFocusChanged.addListener(
    function(windowId) {
        if (windowId == chrome.windows.WINDOW_ID_NONE) {
            bgFnc.stopTime(activeURL);
        } else {
            chrome.tabs.query({ 'active': true, 'lastFocusedWindow': true }, function(tabs) {
                var url = tabs[0].url;
                bgFnc.recordTime(url);
            });
        }
    }
);
// }
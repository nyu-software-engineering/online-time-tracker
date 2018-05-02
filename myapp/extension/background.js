


console.log('bg loaded');


let updatedTab;

chrome.tabs.onUpdated.addListener(


    (tabId, changeinfo, tab) => {
        console.log('still recordin');

        if(tab.url!=="newtab" && tab.url!=='undefined'){

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


    }
);

//Triggers when the user goes to a different tab in the same window
chrome.tabs.onActivated.addListener((tab) => {

    let id = tab.tabId;

    chrome.tabs.get(id, (tab) => {

        console.log('still recordin');
        if(tab.url!=='newtab' && tab.url!=='undefined'){
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
        }
        
    })
})


// Triggers when the user goes to a different chrome window
chrome.windows.onFocusChanged.addListener(

    function(windowId) {

        if (windowId == chrome.windows.WINDOW_ID_NONE) {

            console.log('stop recording');
            window.clearInterval(updatedTab);

        } 
        else {
            //record active tab on switched window

            chrome.tabs.query({ 'active': true, 'lastFocusedWindow': true }, function(tabs) {
            console.log('other window recording');
                
            if(tabs.length!==0){

                console.log('should switch focus')
                let URL = getHostName(tabs[0].url);
                if (URL !== activeURL) {
                    window.clearInterval(updatedTab);
                
                }
                switchCurrentTab(URL);
                let current = getCurrentTime(activeURL);
                // console.log(`current time on url :${activeURL} is ${currentTime}`)
                currentTime = current;
                updatedTab = window.setInterval(function() { updateTime(activeURL, currentTime) }, 250)


                 }
                 
                

            })
            
         }
    })
    
                

chrome.windows.onFocusChanged.addListener(function() {
    console.log("Focus changed.");
    chrome.windows.getCurrent(function(chromeWindow) {
        // "normal", "minimized", "maximized" or "fullscreen"
        if(chromeWindow.state === 'minimized'){
            console.log('minimized window');
            window.clearInterval(updatedTab);
        };
    });
    
});